import { collection, db, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.109-student-assignment-status-fallback";

export async function attachLearningModeDocument(executionState) {
  const payload = executionState.payload || {};
  const courseId = payload.courseId || "";
  const moduleId = payload.moduleId || "";
  const modeId = payload.modeId || "";
  const stepTypeId = payload.stepTypeId || payload.stepType || "";
  const attemptedPaths = [];

  if (isDevelopmentLoggingEnabled()) {
    console.info("[step:add] context", {
      intent: executionState.intentType,
      courseId: courseId,
      moduleId: moduleId,
      modeId: modeId,
      stepTypeId: stepTypeId,
      modePath: "catalogCourses/" + courseId + "/modules/" + moduleId + "/learningModes/" + modeId
    });
  }

  if (!courseId || !moduleId || !modeId || !stepTypeId) {
    if (isDevelopmentLoggingEnabled()) {
      console.warn("[step:add] missing context", {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId,
        stepTypeId: stepTypeId
      });
    }
  }

  if (!courseId || !moduleId || !modeId) {
    return { valid: true };
  }

  try {
    const contextResult = await readLearningModeContext(courseId, moduleId, modeId, attemptedPaths);

    if (!contextResult.valid) {
      return createFailedContextResult(contextResult.code, contextResult.message, courseId, moduleId, modeId, payload, attemptedPaths);
    }

    return {
      valid: true,
      data: contextResult.data
    };
  } catch (error) {
    return createFailedContextResult("LEARNING_MODE_READ_FAILED", "Failed to attach learning mode: " + error.message, courseId, moduleId, modeId, payload, attemptedPaths);
  }
}

async function readLearningModeContext(courseId, moduleId, modeId, attemptedPaths) {
  const collectionNames = ["catalogCourses", "courses"];
  let courseFound = false;
  let moduleFound = false;
  let collectionIndex = 0;

  while (collectionIndex < collectionNames.length) {
    const collectionName = collectionNames[collectionIndex];
    const coursePath = collectionName + "/" + courseId;
    attemptedPaths.push(coursePath);

    const courseSnap = await getDoc(doc(db, collectionName, courseId));

    if (courseSnap.exists()) {
      courseFound = true;
    } else {
      collectionIndex = collectionIndex + 1;
      continue;
    }

    const modulePath = collectionName + "/" + courseId + "/modules/" + moduleId;
    attemptedPaths.push(modulePath);

    const moduleSnap = await getDoc(doc(db, collectionName, courseId, "modules", moduleId));

    if (!moduleSnap.exists()) {
      collectionIndex = collectionIndex + 1;
      continue;
    }

    moduleFound = true;

    const modePath = collectionName + "/" + courseId + "/modules/" + moduleId + "/learningModes/" + modeId;
    attemptedPaths.push(modePath);

    const modeSnap = await getDoc(doc(db, collectionName, courseId, "modules", moduleId, "learningModes", modeId));
    const learningMode = modeSnap.exists()
      ? Object.assign({ id: modeSnap.id }, modeSnap.data())
      : readModeFromModuleDocument(moduleSnap.data(), modeId);

    if (!learningMode) {
      return {
        valid: false,
        code: "LEARNING_MODE_NOT_FOUND",
        message: "Learning mode not found: " + modeId
      };
    }

    return {
      valid: true,
      data: {
        course: Object.assign({ id: courseSnap.id }, courseSnap.data()),
        module: Object.assign({ id: moduleSnap.id }, moduleSnap.data()),
        learningMode: Object.assign({ id: modeId }, learningMode, {
          steps: await readModeSteps(collectionName, courseId, moduleId, modeId)
        }),
        learningModePath: modePath,
        courseCollectionName: collectionName,
        sessions: await readSessions(collectionName, courseId, moduleId)
      }
    };
  }

  if (!courseFound) {
    return {
      valid: false,
      code: "COURSE_NOT_FOUND",
      message: "Course not found: " + courseId
    };
  }

  if (!moduleFound) {
    return {
      valid: false,
      code: "MODULE_NOT_FOUND",
      message: "Module not found: " + moduleId
    };
  }

  return {
    valid: false,
    code: "LEARNING_MODE_NOT_FOUND",
    message: "Learning mode not found: " + modeId
  };
}

async function readModeSteps(collectionName, courseId, moduleId, modeId) {
  const stepsSnap = await getDocs(collection(db, collectionName, courseId, "modules", moduleId, "learningModes", modeId, "steps"));
  const steps = [];

  stepsSnap.forEach(function (stepSnap) {
    steps.push(Object.assign({ id: stepSnap.id }, stepSnap.data() || {}));
  });

  steps.sort(function (firstStep, secondStep) {
    return readOrder(firstStep) - readOrder(secondStep);
  });

  return steps;
}

async function readSessions(collectionName, courseId, moduleId) {
  const sessionsSnap = await getDocs(collection(db, collectionName, courseId, "modules", moduleId, "sessions"));
  const sessions = [];

  sessionsSnap.forEach(function (sessionSnap) {
    sessions.push(Object.assign({ id: sessionSnap.id }, sessionSnap.data() || {}));
  });

  sessions.sort(function (firstSession, secondSession) {
    return readOrder(firstSession) - readOrder(secondSession);
  });

  return sessions;
}

function readModeFromModuleDocument(moduleData, modeId) {
  if (!moduleData || !moduleData.learningModes || typeof moduleData.learningModes !== "object") {
    return null;
  }

  return moduleData.learningModes[modeId] || null;
}

function readOrder(value) {
  if (value && typeof value.order === "number") {
    return value.order;
  }

  return 0;
}

function createFailedContextResult(code, message, courseId, moduleId, modeId, payload, attemptedPaths) {
  if (isDevelopmentLoggingEnabled()) {
    if (code === "COURSE_NOT_FOUND") {
      console.warn("[step:add] course lookup failed", {
        courseId: courseId,
        attemptedPath: attemptedPaths.length > 0 ? attemptedPaths[attemptedPaths.length - 1] : "catalogCourses/" + courseId,
        attemptedPaths: attemptedPaths,
        currentRoute: readCurrentRoute(),
        currentCourseContext: createCourseContextSnapshot(courseId, moduleId, modeId, payload)
      });
    }

    console.warn("[step:add] addContext failed", {
      courseId: courseId,
      moduleId: moduleId,
      modeId: modeId,
      stepTypeId: payload.stepTypeId || payload.stepType || "",
      attemptedPaths: attemptedPaths,
      errorMessage: message
    });
  }

  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message,
        attemptedPaths: attemptedPaths
      }
    ]
  };
}

function createCourseContextSnapshot(courseId, moduleId, modeId, payload) {
  if (payload && payload.courseContext && typeof payload.courseContext === "object") {
    return payload.courseContext;
  }

  const coursePath = "catalogCourses/" + courseId;
  const modulePath = coursePath + "/modules/" + moduleId;
  const modePath = modulePath + "/learningModes/" + modeId;

  return {
    courseId: courseId,
    coursePath: coursePath,
    moduleId: moduleId,
    modulePath: modulePath,
    modeId: modeId,
    modePath: modePath
  };
}

function readCurrentRoute() {
  if (typeof window === "undefined" || !window.location) {
    return "";
  }

  return window.location.href;
}

function isDevelopmentLoggingEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.search.indexOf("debug") !== -1;
}
