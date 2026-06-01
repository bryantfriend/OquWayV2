import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachLearningModeDocument(executionState) {
  const payload = executionState.payload || {};
  const courseId = payload.courseId || "";
  const moduleId = payload.moduleId || "";
  const modeId = payload.modeId || "";
  const modePath = "catalogCourses/" + courseId + "/modules/" + moduleId + "/learningModes/" + modeId;
  const attemptedPaths = [
    "catalogCourses/" + courseId,
    "catalogCourses/" + courseId + "/modules/" + moduleId,
    modePath
  ];

  if (isDevelopmentLoggingEnabled()) {
    console.info("[step:add] context", {
      intent: executionState.intentType,
      courseId: courseId,
      moduleId: moduleId,
      modeId: modeId,
      stepTypeId: payload.stepTypeId || payload.stepType || "",
      modePath: modePath
    });
  }

  if (!courseId || !moduleId || !modeId || !(payload.stepTypeId || payload.stepType)) {
    if (isDevelopmentLoggingEnabled()) {
      console.warn("[step:add] missing context", {
        courseId: courseId,
        moduleId: moduleId,
        modeId: modeId,
        stepTypeId: payload.stepTypeId || payload.stepType || ""
      });
    }
  }

  if (!courseId || !moduleId || !modeId) {
    return { valid: true };
  }

  try {
    const courseSnap = await getDoc(doc(db, "catalogCourses", courseId));

    if (!courseSnap.exists()) {
      return createFailedContextResult("COURSE_NOT_FOUND", "Course not found: " + courseId, courseId, moduleId, modeId, payload, attemptedPaths);
    }

    const moduleSnap = await getDoc(doc(db, "catalogCourses", courseId, "modules", moduleId));

    if (!moduleSnap.exists()) {
      return createFailedContextResult("MODULE_NOT_FOUND", "Module not found: " + moduleId, courseId, moduleId, modeId, payload, attemptedPaths);
    }

    const modeSnap = await getDoc(doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", modeId));

    if (modeSnap.exists()) {
      return {
        valid: true,
        data: {
          learningMode: Object.assign({ id: modeSnap.id }, modeSnap.data()),
          learningModePath: modePath
        }
      };
    }

    const moduleMode = readModeFromModuleDocument(moduleSnap.data(), modeId);

    if (moduleMode) {
      return {
        valid: true,
        data: {
          learningMode: Object.assign({ id: modeId }, moduleMode),
          learningModePath: modePath
        }
      };
    }

    return createFailedContextResult("LEARNING_MODE_NOT_FOUND", "Learning mode not found: " + modeId, courseId, moduleId, modeId, payload, attemptedPaths);
  } catch (error) {
    return createFailedContextResult("LEARNING_MODE_READ_FAILED", "Failed to attach learning mode: " + error.message, courseId, moduleId, modeId, payload, attemptedPaths);
  }
}

function readModeFromModuleDocument(moduleData, modeId) {
  if (!moduleData || !moduleData.learningModes || typeof moduleData.learningModes !== "object") {
    return null;
  }

  return moduleData.learningModes[modeId] || null;
}

function createFailedContextResult(code, message, courseId, moduleId, modeId, payload, attemptedPaths) {
  if (isDevelopmentLoggingEnabled()) {
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

function isDevelopmentLoggingEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.search.indexOf("debug") !== -1;
}
