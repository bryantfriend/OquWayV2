import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";
import { normalizePracticeModes } from "../moduleEditor/practiceModeShells.js?v=1.1.162-modal-stack";

export async function processPreviewCourse(executionState) {
  var payload = executionState.payload || {};
  var courseResult = await readCourse(payload.courseId);

  if (!courseResult.course) {
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_PREVIEW_NOT_FOUND",
          message: "Course not found for preview."
        }
      ]
    };
  }

  courseResult.course.modules = await readModules(courseResult.collectionName, payload.courseId);
  executionState.result = {
    course: courseResult.course,
    previewMode: true,
    writesProgress: false
  };

  return { valid: true };
}

async function readCourse(courseId) {
  var collectionNames = ["catalogCourses", "courses"];
  var index = 0;

  while (index < collectionNames.length) {
    var snap = await getDoc(doc(db, collectionNames[index], courseId));

    if (snap.exists()) {
      return {
        collectionName: collectionNames[index],
        course: Object.assign({ id: snap.id }, snap.data())
      };
    }

    index = index + 1;
  }

  return {
    collectionName: "catalogCourses",
    course: null
  };
}

async function readModules(collectionName, courseId) {
  var modulesSnap = await getDocs(collection(db, collectionName, courseId, "modules"));
  var modules = [];

  modulesSnap.forEach(function (moduleSnap) {
    modules.push(Object.assign({ id: moduleSnap.id }, moduleSnap.data()));
  });

  modules.sort(compareByOrder);

  for (var moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
    modules[moduleIndex].learningModes = await readLearningModes(collectionName, courseId, modules[moduleIndex].id, modules[moduleIndex].learningModes);
    modules[moduleIndex].sessions = await readSessions(collectionName, courseId, modules[moduleIndex].id);
    modules[moduleIndex].sessions = hydrateSessionStepsFromLearningModes(modules[moduleIndex].sessions, modules[moduleIndex].learningModes);
  }

  return modules;
}

async function readLearningModes(collectionName, courseId, moduleId, embeddedLearningModes) {
  var modesSnap = await getDocs(collection(db, collectionName, courseId, "modules", moduleId, "learningModes"));
  var modes = embeddedLearningModes && typeof embeddedLearningModes === "object" && !Array.isArray(embeddedLearningModes)
    ? Object.assign({}, embeddedLearningModes)
    : {};

  modesSnap.forEach(function (modeSnap) {
    modes[modeSnap.id] = Object.assign({ id: modeSnap.id }, modes[modeSnap.id] || {}, modeSnap.data());
  });

  var modeIds = Object.keys(modes);
  for (var modeIndex = 0; modeIndex < modeIds.length; modeIndex++) {
    modes[modeIds[modeIndex]] = Object.assign({ id: modeIds[modeIndex] }, modes[modeIds[modeIndex]], {
      steps: await readLearningModeSteps(collectionName, courseId, moduleId, modeIds[modeIndex], modes[modeIds[modeIndex]])
    });
  }

  return modes;
}

async function readLearningModeSteps(collectionName, courseId, moduleId, modeId, embeddedMode) {
  var stepsSnap = await getDocs(collection(db, collectionName, courseId, "modules", moduleId, "learningModes", modeId, "steps"));
  var steps = [];

  stepsSnap.forEach(function (stepSnap) {
    steps.push(Object.assign({ id: stepSnap.id }, stepSnap.data()));
  });

  if (steps.length === 0 && embeddedMode && Array.isArray(embeddedMode.steps)) {
    steps = embeddedMode.steps.slice();
  }

  steps.sort(compareByOrder);
  return steps;
}

async function readSessions(collectionName, courseId, moduleId) {
  var sessionsSnap = await getDocs(collection(db, collectionName, courseId, "modules", moduleId, "sessions"));
  var sessions = [];

  sessionsSnap.forEach(function (sessionSnap) {
    var session = Object.assign({ id: sessionSnap.id }, sessionSnap.data());
    session.practiceModes = normalizePracticeModes(session.practiceModes);
    sessions.push(session);
  });

  sessions.sort(compareByOrder);
  return sessions;
}

function hydrateSessionStepsFromLearningModes(sessions, learningModes) {
  var safeSessions = Array.isArray(sessions) ? sessions.slice() : [];
  var modes = learningModes && typeof learningModes === "object" ? learningModes : {};

  return safeSessions.map(function (session) {
    var modeId = session.learningModeId || "primary";
    var mode = modes[modeId] || modes.primary || null;
    var modeSteps = mode && Array.isArray(mode.steps) ? mode.steps : [];
    var practiceModes = normalizePracticeModes(session.practiceModes);
    var keys = Object.keys(practiceModes);

    keys.forEach(function (key) {
      var shellSteps = Array.isArray(practiceModes[key].steps) ? practiceModes[key].steps : [];
      var hydratedSteps = modeSteps.length > 0 ? mergeShellOrderWithCanonicalSteps(shellSteps, modeSteps) : shellSteps;
      practiceModes[key] = Object.assign({}, practiceModes[key], {
        steps: hydratedSteps
      });
    });

    return Object.assign({}, session, {
      practiceModes: practiceModes
    });
  });
}

function mergeShellOrderWithCanonicalSteps(shellSteps, canonicalSteps) {
  var canonicalById = {};
  var orderedSteps = [];
  var used = {};

  canonicalSteps.forEach(function (step) {
    if (step && step.id) {
      canonicalById[step.id] = step;
    }
  });

  shellSteps.forEach(function (shellStep) {
    var stepId = shellStep && shellStep.id ? shellStep.id : "";
    if (stepId && canonicalById[stepId] && !used[stepId]) {
      orderedSteps.push(Object.assign({}, shellStep, canonicalById[stepId]));
      used[stepId] = true;
    }
  });

  canonicalSteps.forEach(function (step) {
    if (step && step.id && !used[step.id]) {
      orderedSteps.push(step);
    }
  });

  orderedSteps.sort(compareByOrder);
  return orderedSteps;
}

function compareByOrder(first, second) {
  return readOrder(first) - readOrder(second);
}

function readOrder(value) {
  if (value && typeof value.order === "number") {
    return value.order;
  }

  return 0;
}
