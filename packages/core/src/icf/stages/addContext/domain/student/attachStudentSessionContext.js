import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.82-shared-command-center-shell";
import { createDefaultProgressDocument } from "../../../process/domain/student/studentProgressHelpers.js?v=1.1.82-shared-command-center-shell";
import { resolveStudentId } from "../../../../../../../domain/users/index.js";

export async function attachStudentSessionContext(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;
  var resolvedActor = Object.assign({}, actor || {}, {
    id: resolveStudentId(executionState.context ? executionState.context.studentProfile : null, actor) || (actor && actor.id ? actor.id : "")
  });

  if (!payload.courseId || !payload.moduleId || !payload.sessionId) {
    return { valid: true };
  }

  try {
    var context = await loadStudentSessionContext(payload);

    if (!context.course) {
      return createMissingContextError("STUDENT_COURSE_NOT_FOUND", "Course not found: " + payload.courseId);
    }

    if (!context.module) {
      return createMissingContextError("STUDENT_MODULE_NOT_FOUND", "Module not found: " + payload.moduleId);
    }

    if (!context.session) {
      return createMissingContextError("STUDENT_SESSION_NOT_FOUND", "Session not found: " + payload.sessionId);
    }

    return {
      valid: true,
      data: {
        course: context.course,
        module: context.module,
        session: context.session,
        progress: await readStudentProgress(resolvedActor, payload)
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_SESSION_CONTEXT_FAILED",
          message: "Failed to load student session context: " + error.message
        }
      ]
    };
  }
}

async function loadStudentSessionContext(payload) {
  var sources = ["catalogCourses", "courses"];
  var sourceIndex = 0;

  while (sourceIndex < sources.length) {
    var context = await readSessionContextFromSource(sources[sourceIndex], payload);

    if (context.course && context.module && context.session) {
      return context;
    }

    sourceIndex = sourceIndex + 1;
  }

  return {
    course: null,
    module: null,
    session: null
  };
}

async function readSessionContextFromSource(source, payload) {
  var courseSnap = await getDoc(doc(db, source, payload.courseId));
  var moduleSnap = await getDoc(doc(db, source, payload.courseId, "modules", payload.moduleId));
  var sessionSnap = null;
  var module = null;

  if (!courseSnap.exists() || !moduleSnap.exists()) {
    return {
      course: courseSnap.exists() ? Object.assign({ id: courseSnap.id }, courseSnap.data()) : null,
      module: null,
      session: null
    };
  }

  module = Object.assign({ id: moduleSnap.id }, moduleSnap.data());
  module.learningModes = await loadLearningModes(source, payload.courseId, module.id, module.learningModes);
  sessionSnap = await getDoc(doc(db, source, payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId));

  return {
    course: Object.assign({ id: courseSnap.id }, courseSnap.data()),
    module: module,
    session: sessionSnap.exists()
      ? normalizeSession(sessionSnap.id, sessionSnap.data())
      : createSessionFromLearningMode(module, payload.sessionId)
  };
}

async function loadLearningModes(source, courseId, moduleId, embeddedLearningModes) {
  var modes = embeddedLearningModes && typeof embeddedLearningModes === "object" && !Array.isArray(embeddedLearningModes)
    ? Object.assign({}, embeddedLearningModes)
    : {};
  var modesSnap = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes"));

  modesSnap.forEach(function (modeSnap) {
    modes[modeSnap.id] = Object.assign({ id: modeSnap.id }, modeSnap.data());
  });

  var modeIds = Object.keys(modes);
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    modes[modeIds[modeIndex]].steps = await loadLearningModeSteps(source, courseId, moduleId, modeIds[modeIndex], modes[modeIds[modeIndex]].steps);
    modeIndex = modeIndex + 1;
  }

  return modes;
}

async function loadLearningModeSteps(source, courseId, moduleId, modeId, embeddedSteps) {
  var steps = Array.isArray(embeddedSteps) ? embeddedSteps.slice() : [];
  var stepsSnap = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes", modeId, "steps"));

  if (!stepsSnap.empty) {
    steps = [];
    stepsSnap.forEach(function (stepSnap) {
      steps.push(Object.assign({ id: stepSnap.id }, stepSnap.data()));
    });
  }

  return steps;
}

function createSessionFromLearningMode(module, sessionId) {
  var modes = module && module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeIds = Object.keys(modes);
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    var mode = modes[modeIds[modeIndex]];
    var modeSessionId = readText(mode && (mode.legacySessionId || mode.id || modeIds[modeIndex]));

    if (modeSessionId === sessionId) {
      return normalizeSession(modeSessionId, {
        id: modeSessionId,
        moduleId: module.id,
        title: mode.title || mode.name || mode.displayName || "Learning mode",
        learningModeId: readText(mode.id || modeIds[modeIndex]),
        learningModeType: mode.modeType || "primary",
        practiceModes: createPracticeModesFromLearningMode(mode, modeIndex),
        order: readOrder(mode)
      });
    }

    modeIndex = modeIndex + 1;
  }

  return null;
}

function createPracticeModesFromLearningMode(mode, modeIndex) {
  var practiceModes = normalizePracticeModes(null);
  var key = mapLearningModeToPracticeModeKey(mode, modeIndex);

  practiceModes[key] = Object.assign({}, practiceModes[key], {
    key: key,
    title: normalizeTitle(mode.title || mode.name || mode.displayName || "Learning mode", practiceModes[key].title),
    status: mode.status || "ready",
    enabled: mode.enabled !== false,
    steps: readPlayableStepsFromLearningMode(mode),
    order: readOrder(mode)
  });

  return practiceModes;
}

function readPlayableStepsFromLearningMode(mode) {
  var steps = Array.isArray(mode && mode.steps) ? mode.steps.slice() : [];

  if (steps.length > 0) {
    return steps;
  }

  return createStepsFromPages(mode && mode.pages)
    .concat(createStepsFromBlocks(mode && mode.blocks))
    .concat(createStepsFromTracks(mode && mode.tracks));
}

function createStepsFromTracks(tracks) {
  var source = Array.isArray(tracks) ? tracks : [];
  var steps = [];
  var trackIndex = 0;

  while (trackIndex < source.length) {
    steps = steps.concat(createStepsFromPages(source[trackIndex] ? source[trackIndex].pages : null));
    steps = steps.concat(createStepsFromBlocks(source[trackIndex] ? source[trackIndex].blocks : null));
    trackIndex = trackIndex + 1;
  }

  return steps;
}

function createStepsFromPages(pages) {
  var source = Array.isArray(pages) ? pages : [];
  var steps = [];
  var pageIndex = 0;

  while (pageIndex < source.length) {
    steps = steps.concat(createStepsFromBlocks(source[pageIndex] ? source[pageIndex].blocks : null));
    pageIndex = pageIndex + 1;
  }

  return steps;
}

function createStepsFromBlocks(blocks) {
  var source = Array.isArray(blocks) ? blocks : [];
  var steps = [];
  var blockIndex = 0;

  while (blockIndex < source.length) {
    var block = source[blockIndex] && typeof source[blockIndex] === "object" ? source[blockIndex] : {};
    steps.push(Object.assign({}, block, {
      id: readText(block.id || block.blockId || block.stepId) || "block-step-" + (blockIndex + 1),
      type: readText(block.type || block.blockType || block.stepType) || "text",
      order: typeof block.order === "number" ? block.order : blockIndex + 1,
      title: block.title || block.prompt || block.question || "Learning activity"
    }));
    blockIndex = blockIndex + 1;
  }

  return steps;
}

function normalizeSession(sessionId, sessionData) {
  var session = Object.assign({ id: sessionId }, sessionData);
  session.practiceModes = normalizePracticeModes(session.practiceModes);
  return session;
}

function mapLearningModeToPracticeModeKey(mode, modeIndex) {
  if (mode && mode.practiceModeKey) {
    return mode.practiceModeKey;
  }

  if (mode && mode.modeType === "review") {
    return "afterClass";
  }

  if (mode && mode.modeType === "practice") {
    return "dailyPractice";
  }

  if (mode && mode.modeType === "assessment") {
    return "classroomLesson";
  }

  return modeIndex === 0 ? "beforeClass" : "classroomLesson";
}

function normalizeTitle(value, fallbackTitle) {
  if (typeof value === "string") {
    return {
      en: value,
      ru: "",
      ky: ""
    };
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.assign({}, fallbackTitle || {}, value);
  }

  return fallbackTitle;
}

function readOrder(value) {
  return value && typeof value.order === "number" ? value.order : 9999;
}

async function readStudentProgress(actor, payload) {
  if (!actor || !actor.id) {
    return createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId);
  }

  try {
    var progressRef = doc(db, "studentProgress", actor.id, "courses", payload.courseId, "sessions", payload.sessionId);
    var progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId);
    }

    return Object.assign(
      createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId),
      progressSnap.data()
    );
  } catch (error) {
    return createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId);
  }
}

function createMissingContextError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
