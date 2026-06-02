import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js";

export async function attachStepPreviewContext(executionState) {
  var payload = executionState.payload || {};
  var courseId = readText(payload.courseId);
  var moduleId = readText(payload.moduleId);
  var modeId = readText(payload.modeId);
  var stepId = readText(payload.stepId);

  console.info("[step-preview]", {
    courseId: courseId,
    moduleId: moduleId,
    modeId: modeId,
    stepId: stepId
  });

  try {
    var courseSnap = await getDoc(doc(db, "catalogCourses", courseId));
    if (!courseSnap.exists()) {
      return createNotFoundError("COURSE_NOT_FOUND", "Course not found: " + courseId);
    }

    var moduleSnap = await getDoc(doc(db, "catalogCourses", courseId, "modules", moduleId));
    if (!moduleSnap.exists()) {
      return createNotFoundError("MODULE_NOT_FOUND", "Module not found: " + moduleId);
    }

    var modeSnap = await getDoc(doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", modeId));
    if (!modeSnap.exists()) {
      return createNotFoundError("LEARNING_MODE_NOT_FOUND", "Learning mode not found: " + modeId);
    }

    var stepSnap = await getDoc(doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", modeId, "steps", stepId));
    if (!stepSnap.exists()) {
      return createNotFoundError("STEP_PREVIEW_STEP_NOT_FOUND", "Step not found: " + stepId);
    }

    return {
      valid: true,
      data: {
        course: Object.assign({ id: courseSnap.id }, courseSnap.data()),
        module: Object.assign({ id: moduleSnap.id }, moduleSnap.data()),
        learningMode: Object.assign({ id: modeSnap.id }, modeSnap.data()),
        step: Object.assign({ id: stepSnap.id }, stepSnap.data()),
        previewPaths: {
          coursePath: "catalogCourses/" + courseId,
          modulePath: "catalogCourses/" + courseId + "/modules/" + moduleId,
          learningModePath: "catalogCourses/" + courseId + "/modules/" + moduleId + "/learningModes/" + modeId,
          stepPath: "catalogCourses/" + courseId + "/modules/" + moduleId + "/learningModes/" + modeId + "/steps/" + stepId
        }
      }
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STEP_PREVIEW_CONTEXT_READ_FAILED",
          message: "Unable to preview this step. " + error.message
        }
      ]
    };
  }
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function createNotFoundError(code, message) {
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
