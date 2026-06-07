import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";
import { db, doc, getDoc } from "../../../infrastructure/firebase/firestore.js?v=1.1.110-student-class-alias-query";

export function OpenCourseCommandCenterIntent() {
  return {
    type: "OpenCourseCommandCenterIntent",
    validate: [validateAuthenticated, validateCourseCommandCenterPayload],
    normalize: [normalizeCourseCommandCenterPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseCommandCenterContext],
    authorize: [requireSuperAdminAccess],
    process: [processOpenCourseCommandCenter],
    emit: [emitIntentResult]
  };
}

async function attachCourseCommandCenterContext(executionState) {
  try {
    var courseId = executionState.payload.courseId;
    var catalogRef = doc(db, "catalogCourses", courseId);
    var catalogSnapshot = await getDoc(catalogRef);
    var courseSnapshot = catalogSnapshot;
    var source = "catalogCourses";

    if (!catalogSnapshot.exists()) {
      var legacyRef = doc(db, "courses", courseId);
      courseSnapshot = await getDoc(legacyRef);
      source = "courses";
    }

    if (!courseSnapshot.exists()) {
      return {
        valid: false,
        errors: [{
          code: "COURSE_NOT_FOUND",
          field: "courseId",
          message: "The selected course was not found."
        }]
      };
    }

    executionState.context.selectedCourse = Object.assign({
      id: courseSnapshot.id,
      source: source
    }, courseSnapshot.data() || {});

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        code: "COURSE_COMMAND_CONTEXT_FAILED",
        message: error && error.message ? error.message : "Could not load selected course context."
      }]
    };
  }
}

function validateCourseCommandCenterPayload(executionState) {
  var courseId = executionState && executionState.payload ? executionState.payload.courseId : "";

  if (typeof courseId !== "string" || courseId.trim() === "") {
    return {
      valid: false,
      errors: [{
        code: "COURSE_ID_REQUIRED",
        field: "courseId",
        message: "courseId is required to open Course Command Center."
      }]
    };
  }

  return { valid: true };
}

function normalizeCourseCommandCenterPayload(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    courseId: String(executionState.payload.courseId || "").trim()
  });

  return { valid: true };
}

function processOpenCourseCommandCenter(executionState) {
  var course = executionState.context.selectedCourse || {};

  executionState.result = {
    courseId: executionState.payload.courseId,
    course: {
      id: course.id || executionState.payload.courseId,
      title: course.title || course.name || "",
      status: course.status || course.lifecycleStatus || "draft",
      source: course.source || "catalogCourses"
    },
    openedAt: Date.now()
  };

  return { valid: true };
}
