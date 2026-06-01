import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachLearningModeDocument(executionState) {
  const payload = executionState.payload || {};
  const courseId = payload.courseId || "";
  const moduleId = payload.moduleId || "";
  const modeId = payload.modeId || "";
  const modePath = readCourseCollectionName(executionState) + "/" + courseId + "/modules/" + moduleId + "/learningModes/" + modeId;

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
    const modeSnap = await getDoc(doc(db, readCourseCollectionName(executionState), courseId, "modules", moduleId, "learningModes", modeId));

    if (modeSnap.exists()) {
      return {
        valid: true,
        data: {
          learningMode: Object.assign({ id: modeSnap.id }, modeSnap.data()),
          learningModePath: modePath
        }
      };
    }

    const moduleMode = readModeFromModuleContext(executionState, modeId);

    if (moduleMode) {
      return {
        valid: true,
        data: {
          learningMode: Object.assign({ id: modeId }, moduleMode),
          learningModePath: modePath
        }
      };
    }

    return {
      valid: false,
      errors: [
        {
          code: "LEARNING_MODE_NOT_FOUND",
          message: "Learning mode not found: " + modeId
        }
      ]
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LEARNING_MODE_READ_FAILED",
          message: "Failed to attach learning mode: " + error.message
        }
      ]
    };
  }
}

function readModeFromModuleContext(executionState, modeId) {
  const module = executionState.context && executionState.context.module ? executionState.context.module : null;

  if (!module || !module.learningModes || typeof module.learningModes !== "object") {
    return null;
  }

  return module.learningModes[modeId] || null;
}

function readCourseCollectionName(executionState) {
  if (executionState.context && executionState.context.courseCollectionName) {
    return executionState.context.courseCollectionName;
  }

  return "catalogCourses";
}

function isDevelopmentLoggingEnabled() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.search.indexOf("debug") !== -1;
}
