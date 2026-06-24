import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.82-shared-command-center-shell";
import { createDefaultProgressDocument } from "../../../process/domain/student/studentProgressHelpers.js?v=1.1.82-shared-command-center-shell";
import { resolveStudentId } from "../../../../../../../domain/users/index.js";

export async function attachStudentOpenCourseContext(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};
  var studentId = resolveStudentId(executionState.context ? executionState.context.studentProfile : null, actor) || readText(payload.studentId || actor.id);
  var resolvedActor = Object.assign({}, actor, { id: studentId });
  var courseId = readText(payload.courseId);
  var preferredSource = readText(payload.courseRecordSource || payload.source || payload.courseSource);
  var preferredModuleSource = readText(payload.moduleSource || payload.studentOpenModuleSource || preferredSource);
  var attemptedCoursePaths = [];
  var attemptedModulePaths = [];
  var timing = createStudentOpenCourseTiming("StudentOpenCourseIntent:addContext", executionState);

  try {
    var courseContext = await loadCourse(courseId, attemptedCoursePaths, preferredSource);
    timing.mark("course document lookup");

    if (!courseContext.course) {
      logAddContextFailure(studentId, courseId, attemptedCoursePaths, attemptedModulePaths, "Course was not found.");
      return {
        valid: true,
        data: {
          studentOpenCourses: [],
          studentOpenCourse: null,
          studentOpenModules: [],
          studentOpenCourseSource: "",
          studentOpenModuleSource: "",
          studentOpenFirstRunnableStep: null,
          studentOpenProgressLoaded: false,
          studentOpenCourseLoadError: "Course not found: " + courseId
        }
      };
    }

    var moduleCourseIds = buildCourseIdentityCandidates(courseId, payload, courseContext.course);
    var moduleContext = await loadModules(
      resolvedActor,
      courseId,
      moduleCourseIds,
      attemptedModulePaths,
      courseContext.courseSource,
      preferredModuleSource
    );
    timing.mark("module tree hydration");
    var course = Object.assign({}, courseContext.course, {
      id: courseId || courseContext.course.id,
      canonicalCourseId: moduleContext.canonicalCourseId || courseContext.course.id || courseId,
      moduleCourseId: moduleContext.moduleCourseId || courseId,
      moduleSource: moduleContext.moduleSource,
      moduleOrder: moduleContext.moduleOrder.length > 0 ? moduleContext.moduleOrder : courseContext.course.moduleOrder,
      moduleCount: moduleContext.modules.length,
      modules: moduleContext.modules
    });

    timing.finish({
      studentIdPresent: Boolean(studentId),
      courseId: courseId,
      courseSource: courseContext.courseSource,
      moduleCount: moduleContext.modules.length,
      moduleSource: moduleContext.moduleSource,
      moduleCourseId: moduleContext.moduleCourseId
    });

    return {
      valid: true,
      data: {
        studentOpenCourses: [course],
        studentOpenCourse: course,
        studentOpenModules: moduleContext.modules,
        studentOpenCourseSource: courseContext.courseSource,
        studentOpenModuleSource: moduleContext.moduleSource,
        studentOpenFirstRunnableStep: findFirstRunnableStep(course),
        studentOpenProgressLoaded: true
      }
    };
  } catch (error) {
    logAddContextFailure(studentId, courseId, attemptedCoursePaths, attemptedModulePaths, error.message || String(error));
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_OPEN_COURSE_CONTEXT_FAILED",
          message: "Failed to load course context: " + (error.message || String(error))
        }
      ]
    };
  }
}

async function loadCourse(courseId, attemptedCoursePaths, preferredSource) {
  var sources = buildCourseSourceOrder(preferredSource, "");
  var sourceIndex = 0;

  while (sourceIndex < sources.length) {
    var source = sources[sourceIndex];
    var path = source + "/" + courseId;
    attemptedCoursePaths.push(path);

    try {
      var courseSnap = await getDoc(doc(db, source, courseId));

      if (courseSnap.exists()) {
        return {
          course: Object.assign({ id: courseSnap.id }, courseSnap.data()),
          courseSource: source
        };
      }
    } catch (error) {
      // Keep trying fallback paths; the final failure log includes all attempts.
    }

    sourceIndex = sourceIndex + 1;
  }

  return {
    course: null,
    courseSource: ""
  };
}

async function loadModules(actor, progressCourseId, courseIds, attemptedModulePaths, courseSource, preferredSource) {
  var sources = buildCourseSourceOrder(preferredSource, courseSource);
  var courseIndex = 0;

  while (courseIndex < courseIds.length) {
    var courseId = courseIds[courseIndex];
    var sourceIndex = 0;

    while (sourceIndex < sources.length) {
      var source = sources[sourceIndex];
      var path = source + "/" + courseId + "/modules";
      attemptedModulePaths.push(path);

      try {
        var modules = await loadModulesFromSource(actor, source, courseId, progressCourseId);

        if (modules.length > 0) {
          return {
            modules: modules,
            moduleSource: source,
            moduleCourseId: courseId,
            canonicalCourseId: courseId,
            moduleOrder: modules.map(readModuleId).filter(Boolean)
          };
        }
      } catch (error) {
        if (source === sources[sources.length - 1] && courseIndex === courseIds.length - 1) {
          throw error;
        }
      }

      sourceIndex = sourceIndex + 1;
    }

    courseIndex = courseIndex + 1;
  }

  return {
    modules: [],
    moduleSource: "none",
    moduleCourseId: progressCourseId,
    canonicalCourseId: progressCourseId,
    moduleOrder: []
  };
}

async function loadModulesFromSource(actor, source, courseId, progressCourseId) {
  var modulesSnap = await getDocs(collection(db, source, courseId, "modules"));
  var modules = [];

  modulesSnap.forEach(function (moduleSnap) {
    modules.push(Object.assign({ id: moduleSnap.id }, moduleSnap.data()));
  });

  modules.sort(compareByOrderThenTitle);

  modules = await Promise.all(modules.map(function (module) {
    return hydrateOpenModule(actor, source, courseId, progressCourseId, module);
  }));

  return modules;
}

async function hydrateOpenModule(actor, source, courseId, progressCourseId, module) {
  var learningModes = await loadLearningModes(source, courseId, module.id, module.learningModes);
  var hydratedModule = Object.assign({}, module, {
    source: source,
    moduleCourseId: courseId,
    learningModes: learningModes
  });

  hydratedModule.sessions = await loadSessions(actor, source, courseId, progressCourseId, hydratedModule);
  return hydratedModule;
}

async function loadLearningModes(source, courseId, moduleId, embeddedLearningModes) {
  var modes = normalizeEmbeddedLearningModes(embeddedLearningModes);
  var modesSnap = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes"));

  modesSnap.forEach(function (modeSnap) {
    modes[modeSnap.id] = Object.assign({ id: modeSnap.id }, modeSnap.data());
  });

  await Promise.all(Object.keys(modes).map(function (modeId) {
    return loadLearningModeSteps(source, courseId, moduleId, modeId, modes[modeId].steps).then(function (steps) {
      modes[modeId].steps = sortStepsByStableOrder(steps, modes[modeId].stepOrder);
      modes[modeId].stepOrder = modes[modeId].steps.map(function (step) {
        return step && step.id ? step.id : "";
      }).filter(Boolean);
      modes[modeId].stepCount = modes[modeId].steps.length;
    });
  }));

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

  steps.sort(compareByOrderThenTitle);
  return steps;
}

async function loadSessions(actor, source, courseId, progressCourseId, module) {
  var sessionsSnap = await getDocs(collection(db, source, courseId, "modules", module.id, "sessions"));
  var sessions = [];

  sessionsSnap.forEach(function (sessionSnap) {
    var session = Object.assign({ id: sessionSnap.id }, sessionSnap.data());
    session.practiceModes = normalizePracticeModes(session.practiceModes);
    sessions.push(session);
  });

  sessions = hydrateSessionsFromLearningModes(module, sessions);

  sessions.sort(compareSessionOrder);

  sessions = await Promise.all(sessions.map(function (session) {
    return loadProgress(actor, progressCourseId, module.id, session.id).then(function (progress) {
      return Object.assign({}, session, {
        progress: progress
      });
    });
  }));

  return sessions;
}

function hydrateSessionsFromLearningModes(module, sessions) {
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeIds = Object.keys(modes);
  var hydratedSessions = Array.isArray(sessions) ? sessions.slice() : [];
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    hydratedSessions = hydrateSessionFromLearningMode(module, hydratedSessions, modeIds[modeIndex], modes[modeIds[modeIndex]], modeIndex);
    modeIndex = modeIndex + 1;
  }

  return hydratedSessions;
}

function buildCourseIdentityCandidates(courseId, payload, course) {
  var courseIds = [];

  addCourseIdentity(courseIds, payload && payload.moduleCourseId);
  addCourseIdentity(courseIds, payload && payload.canonicalCourseId);
  addCourseIdentity(courseIds, payload && payload.catalogCourseId);
  addCourseIdentity(courseIds, payload && payload.sourceCourseId);
  addCourseIdentity(courseIds, payload && payload.publishedCourseId);
  addCourseIdentity(courseIds, courseId);
  addCourseIdentityFields(courseIds, course);

  return courseIds;
}

function addCourseIdentityFields(courseIds, source) {
  if (!source || typeof source !== "object") {
    return;
  }

  addCourseIdentity(courseIds, source.moduleCourseId);
  addCourseIdentity(courseIds, source.canonicalCourseId);
  addCourseIdentity(courseIds, source.catalogCourseId);
  addCourseIdentity(courseIds, source.courseId);
  addCourseIdentity(courseIds, source.sourceCourseId);
  addCourseIdentity(courseIds, source.publishedCourseId);
  addCourseIdentity(courseIds, source.targetCourseId);
  addCourseIdentity(courseIds, source.linkedCourseId);
  addCourseIdentity(courseIds, source.parentCourseId);
  addCourseIdentity(courseIds, source.baseCourseId);
  addCourseIdentity(courseIds, source.originalCourseId);
  addCourseIdentity(courseIds, source.templateCourseId);
  addCourseIdentity(courseIds, source.courseRefId);
  addCourseIdentity(courseIds, source.refId);
}

function addCourseIdentity(courseIds, value) {
  var courseId = readCourseIdentity(value);

  if (courseId && courseIds.indexOf(courseId) === -1) {
    courseIds.push(courseId);
  }
}

function readCourseIdentity(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    return readText(value.id || value.courseId || value.refId || value.uid);
  }

  return "";
}

function buildCourseSourceOrder(preferredSource, courseSource) {
  var sources = [];

  addCourseSource(sources, preferredSource);
  addCourseSource(sources, courseSource);
  addCourseSource(sources, "courses");
  addCourseSource(sources, "catalogCourses");

  return sources;
}

function readModuleId(module) {
  return readText(module && (module.id || module.moduleId));
}

function addCourseSource(sources, source) {
  var safeSource = readText(source);

  if ((safeSource === "courses" || safeSource === "catalogCourses") && sources.indexOf(safeSource) === -1) {
    sources.push(safeSource);
  }
}

function createSessionsFromLearningModes(module) {
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeIds = Object.keys(modes);
  var sessions = [];
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    var modeId = modeIds[modeIndex];
    var mode = modes[modeId];

    if (mode && mode.status !== "deleted") {
      sessions.push(createSessionFromLearningMode(module.id, modeId, mode, modeIndex));
    }

    modeIndex = modeIndex + 1;
  }

  return sessions;
}

function createSessionFromLearningMode(moduleId, modeId, mode, modeIndex) {
  var practiceModes = normalizePracticeModes(null);
  var key = mapLearningModeToPracticeModeKey(mode, modeIndex);
  var title = mode.title || mode.name || mode.displayName || "Learning mode";
  var steps = readPlayableStepsFromLearningMode(mode);

  practiceModes[key] = Object.assign({}, practiceModes[key], {
    key: key,
    title: normalizeTitle(title, practiceModes[key].title),
    purpose: readText(mode.purpose || mode.description),
    status: mode.status || "ready",
    enabled: mode.enabled !== false,
    steps: steps,
    order: readOrder(mode)
  });

  return {
    id: mode.legacySessionId || modeId,
    moduleId: moduleId,
    title: title,
    learningModeId: modeId,
    learningModeType: mode.modeType || "primary",
    practiceModes: practiceModes,
    order: readOrder(mode)
  };
}

function readPlayableStepsFromLearningMode(mode) {
  var steps = Array.isArray(mode && mode.steps) ? mode.steps.slice() : [];

  if (steps.length > 0) {
    return steps;
  }

  steps = steps.concat(createStepsFromPages(mode && mode.pages));
  steps = steps.concat(createStepsFromBlocks(mode && mode.blocks));
  steps = steps.concat(createStepsFromTracks(mode && mode.tracks));

  return steps;
}

function sortStepsByStableOrder(steps, stepOrder) {
  var safeSteps = Array.isArray(steps) ? steps.slice() : [];
  var order = Array.isArray(stepOrder) ? stepOrder : [];
  var orderIndexByStepId = {};

  order.forEach(function (stepId, index) {
    if (typeof stepId === "string" && stepId.length > 0) {
      orderIndexByStepId[stepId] = index;
    }
  });

  safeSteps.sort(function (firstStep, secondStep) {
    var firstId = firstStep && firstStep.id ? firstStep.id : "";
    var secondId = secondStep && secondStep.id ? secondStep.id : "";
    var firstHasOrder = Object.prototype.hasOwnProperty.call(orderIndexByStepId, firstId);
    var secondHasOrder = Object.prototype.hasOwnProperty.call(orderIndexByStepId, secondId);

    if (firstHasOrder && secondHasOrder) {
      return orderIndexByStepId[firstId] - orderIndexByStepId[secondId];
    }

    if (firstHasOrder) {
      return -1;
    }

    if (secondHasOrder) {
      return 1;
    }

    return readOrder(firstStep) - readOrder(secondStep);
  });

  return safeSteps;
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
    if (source[pageIndex] && Array.isArray(source[pageIndex].blocks)) {
      steps = steps.concat(createStepsFromBlocks(source[pageIndex].blocks));
    } else if (source[pageIndex]) {
      steps.push(createStepFromBlock(source[pageIndex], steps.length));
    }
    pageIndex = pageIndex + 1;
  }

  return steps;
}

function createStepsFromBlocks(blocks) {
  var source = Array.isArray(blocks) ? blocks : [];
  var steps = [];
  var blockIndex = 0;

  while (blockIndex < source.length) {
    steps.push(createStepFromBlock(source[blockIndex], blockIndex));
    blockIndex = blockIndex + 1;
  }

  return steps;
}

function createStepFromBlock(block, index) {
  var safeBlock = block && typeof block === "object" ? block : {};

  return Object.assign({}, safeBlock, {
    id: readText(safeBlock.id || safeBlock.blockId || safeBlock.stepId) || "block-step-" + (index + 1),
    type: readText(safeBlock.type || safeBlock.blockType || safeBlock.stepType) || "text",
    order: typeof safeBlock.order === "number" ? safeBlock.order : index + 1,
    title: safeBlock.title || safeBlock.prompt || safeBlock.question || "Learning activity"
  });
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

async function loadProgress(actor, courseId, moduleId, sessionId) {
  if (!actor || !actor.id) {
    return createDefaultProgressDocument(courseId, moduleId, sessionId);
  }

  try {
    var progressRef = doc(db, "studentProgress", actor.id, "courses", courseId, "sessions", sessionId);
    var progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return createDefaultProgressDocument(courseId, moduleId, sessionId);
    }

    return Object.assign(createDefaultProgressDocument(courseId, moduleId, sessionId), progressSnap.data());
  } catch (error) {
    return createDefaultProgressDocument(courseId, moduleId, sessionId);
  }
}

function findFirstRunnableStep(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    var sessions = Array.isArray(modules[moduleIndex].sessions) ? modules[moduleIndex].sessions : [];
    var sessionIndex = 0;

    while (sessionIndex < sessions.length) {
      var practiceModes = sessions[sessionIndex].practiceModes || {};
      var keys = Object.keys(practiceModes);
      var keyIndex = 0;

      while (keyIndex < keys.length) {
        var mode = practiceModes[keys[keyIndex]];
        var steps = mode && Array.isArray(mode.steps) ? mode.steps : [];

        if (steps.length > 0) {
          return {
            courseId: course.id,
            moduleId: modules[moduleIndex].id,
            sessionId: sessions[sessionIndex].id,
            practiceModeKey: keys[keyIndex],
            stepId: steps[0].id || ""
          };
        }

        keyIndex = keyIndex + 1;
      }

      sessionIndex = sessionIndex + 1;
    }

    moduleIndex = moduleIndex + 1;
  }

  return null;
}

function normalizeEmbeddedLearningModes(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.assign({}, value);
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

function compareByOrderThenTitle(a, b) {
  var orderDifference = readOrder(a) - readOrder(b);

  if (orderDifference !== 0) {
    return orderDifference;
  }

  return readEnglishTitle(a).localeCompare(readEnglishTitle(b));
}

function compareSessionOrder(a, b) {
  var aOrder = readSessionOrder(a);
  var bOrder = readSessionOrder(b);

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return readEnglishTitle(a).localeCompare(readEnglishTitle(b));
}

function readOrder(value) {
  if (!value || typeof value.order !== "number") {
    return 9999;
  }

  return value.order;
}

function readSessionOrder(value) {
  if (value && typeof value.order === "number") {
    return value.order;
  }

  if (value && typeof value.sessionNumber === "number") {
    return value.sessionNumber;
  }

  return 9999;
}

function readEnglishTitle(value) {
  if (!value || !value.title) {
    return "";
  }

  if (typeof value.title === "string") {
    return value.title;
  }

  if (typeof value.title.en === "string") {
    return value.title.en;
  }

  return "";
}

function logAddContextFailure(studentId, courseId, attemptedCoursePaths, attemptedModulePaths, errorMessage) {
  console.warn("[student-open-course:add-context-failed]", {
    studentId: studentId,
    courseId: courseId,
    attemptedCoursePaths: attemptedCoursePaths,
    attemptedModulePaths: attemptedModulePaths,
    errorMessage: errorMessage
  });
}

function hydrateSessionFromLearningMode(module, sessions, modeId, mode, modeIndex) {
  var steps = readPlayableStepsFromLearningMode(mode);
  var sessionIndex = findLearningModeSessionIndex(sessions, modeId, mode);
  var session = sessionIndex >= 0 ? sessions[sessionIndex] : createSessionFromLearningMode(module.id, modeId, mode, modeIndex);
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var key = mapLearningModeToPracticeModeKey(mode, modeIndex);
  var currentMode = practiceModes[key] || {};
  var title = mode.title || mode.name || mode.displayName || "Learning mode";
  var hydratedSession = null;

  if (!mode || mode.status === "deleted" || steps.length === 0) {
    return sessions;
  }

  practiceModes[key] = Object.assign({}, currentMode, {
    key: key,
    title: normalizeTitle(title, currentMode.title),
    purpose: readText(mode.purpose || mode.description) || currentMode.purpose || "",
    status: mode.status || currentMode.status || "ready",
    enabled: mode.enabled !== false,
    steps: sortStepsByStableOrder(steps, mode.stepOrder),
    order: readOrder(mode)
  });

  hydratedSession = Object.assign({}, session, {
    title: normalizeTitle(title, session.title),
    learningModeId: modeId,
    learningModeType: mode.modeType || session.learningModeType || "primary",
    practiceModes: practiceModes,
    order: readOrder(mode)
  });

  if (sessionIndex >= 0) {
    sessions[sessionIndex] = hydratedSession;
    return sessions;
  }

  sessions.push(hydratedSession);
  return sessions;
}

function findLearningModeSessionIndex(sessions, modeId, mode) {
  var legacySessionId = readText(mode && mode.legacySessionId);
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    if ((legacySessionId && sessions[sessionIndex].id === legacySessionId) || sessions[sessionIndex].learningModeId === modeId) {
      return sessionIndex;
    }

    sessionIndex = sessionIndex + 1;
  }

  return -1;
}

function createStudentOpenCourseTiming(label, executionState) {
  var startedAt = Date.now();
  var previousAt = startedAt;
  var marks = [];

  return {
    mark: function (name) {
      var now = Date.now();
      marks.push({
        name: name,
        elapsedMs: now - startedAt,
        stepMs: now - previousAt
      });
      previousAt = now;
    },
    finish: function (details) {
      if (!shouldLogTiming(executionState)) {
        return;
      }

      console.info("[student-open-course:timing]", Object.assign({
        label: label,
        totalMs: Date.now() - startedAt,
        marks: marks
      }, details || {}));
    }
  };
}

function shouldLogTiming(executionState) {
  return Boolean(executionState && executionState.payload && executionState.payload.debug === true) || isDevelopmentHost();
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && window.location
    && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "");
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
