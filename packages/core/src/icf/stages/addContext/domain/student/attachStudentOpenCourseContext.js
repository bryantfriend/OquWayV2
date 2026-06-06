import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.80-course-module-command-center";
import { normalizePracticeModes } from "../../../process/domain/moduleEditor/practiceModeShells.js?v=1.1.80-course-module-command-center";
import { createDefaultProgressDocument } from "../../../process/domain/student/studentProgressHelpers.js?v=1.1.80-course-module-command-center";

export async function attachStudentOpenCourseContext(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};
  var studentId = readText(payload.studentId || actor.id);
  var courseId = readText(payload.courseId);
  var attemptedCoursePaths = [];
  var attemptedModulePaths = [];

  try {
    var courseContext = await loadCourse(courseId, attemptedCoursePaths);

    if (!courseContext.course) {
      logAddContextFailure(studentId, courseId, attemptedCoursePaths, attemptedModulePaths, "Course was not found.");
      return {
        valid: false,
        errors: [
          {
            code: "STUDENT_OPEN_COURSE_NOT_FOUND",
            message: "Course not found: " + courseId
          }
        ]
      };
    }

    var moduleContext = await loadModules(actor, courseId, attemptedModulePaths);
    var course = Object.assign({}, courseContext.course, {
      modules: moduleContext.modules
    });

    console.info("[student-open-course:context]", {
      studentId: studentId,
      courseId: courseId,
      courseFound: true,
      moduleCount: moduleContext.modules.length,
      moduleSource: moduleContext.moduleSource
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

async function loadCourse(courseId, attemptedCoursePaths) {
  var sources = ["catalogCourses", "courses"];
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

async function loadModules(actor, courseId, attemptedModulePaths) {
  var sources = ["catalogCourses", "courses"];
  var sourceIndex = 0;

  while (sourceIndex < sources.length) {
    var source = sources[sourceIndex];
    var path = source + "/" + courseId + "/modules";
    attemptedModulePaths.push(path);

    try {
      var modules = await loadModulesFromSource(actor, source, courseId);

      if (modules.length > 0 || source === sources[sources.length - 1]) {
        return {
          modules: modules,
          moduleSource: source
        };
      }
    } catch (error) {
      if (source === sources[sources.length - 1]) {
        throw error;
      }
    }

    sourceIndex = sourceIndex + 1;
  }

  return {
    modules: [],
    moduleSource: "none"
  };
}

async function loadModulesFromSource(actor, source, courseId) {
  var modulesSnap = await getDocs(collection(db, source, courseId, "modules"));
  var modules = [];

  modulesSnap.forEach(function (moduleSnap) {
    modules.push(Object.assign({ id: moduleSnap.id }, moduleSnap.data()));
  });

  modules.sort(compareByOrderThenTitle);

  var moduleIndex = 0;
  while (moduleIndex < modules.length) {
    modules[moduleIndex].learningModes = await loadLearningModes(source, courseId, modules[moduleIndex].id, modules[moduleIndex].learningModes);
    modules[moduleIndex].sessions = await loadSessions(actor, source, courseId, modules[moduleIndex]);
    moduleIndex = moduleIndex + 1;
  }

  return modules;
}

async function loadLearningModes(source, courseId, moduleId, embeddedLearningModes) {
  var modes = normalizeEmbeddedLearningModes(embeddedLearningModes);
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

  steps.sort(compareByOrderThenTitle);
  return steps;
}

async function loadSessions(actor, source, courseId, module) {
  var sessionsSnap = await getDocs(collection(db, source, courseId, "modules", module.id, "sessions"));
  var sessions = [];

  sessionsSnap.forEach(function (sessionSnap) {
    var session = Object.assign({ id: sessionSnap.id }, sessionSnap.data());
    session.practiceModes = normalizePracticeModes(session.practiceModes);
    sessions.push(session);
  });

  if (sessions.length === 0) {
    sessions = createSessionsFromLearningModes(module);
  }

  sessions.sort(compareSessionOrder);

  var sessionIndex = 0;
  while (sessionIndex < sessions.length) {
    sessions[sessionIndex].progress = await loadProgress(actor, courseId, module.id, sessions[sessionIndex].id);
    sessionIndex = sessionIndex + 1;
  }

  return sessions;
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
  var steps = Array.isArray(mode.steps) ? mode.steps.slice() : [];

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

function readText(value) {
  return typeof value === "string" ? value : "";
}
