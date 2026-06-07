import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.120-student-course-debug-summary";
import { getIntentDefinition } from "../../../../../packages/icf/index.js?v=1.1.120-student-course-debug-summary";
import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.120-student-course-debug-summary";

export const courseAssignmentService = {
  createCourseAssignment: async function (courseId, targetType, targetId, status) {
    var result = await runCourseAssignmentIntent("CreateCourseAssignmentIntent", {
      courseId: courseId,
      targetType: targetType,
      targetId: targetId,
      status: status
    });

    return readIntentDataOrThrow(result);
  },

  listCourseAssignments: async function (courseId) {
    var result = await runCourseAssignmentIntent("ListCourseAssignmentsIntent", {
      courseId: courseId
    });
    var data = readIntentDataOrThrow(result);

    if (data && Array.isArray(data.assignments)) {
      return data.assignments;
    }

    return [];
  },

  updateCourseAssignment: async function (assignmentId, status) {
    var result = await runCourseAssignmentIntent("UpdateCourseAssignmentIntent", {
      assignmentId: assignmentId,
      status: status
    });

    return readIntentDataOrThrow(result);
  },

  disableCourseAssignment: async function (assignmentId) {
    var result = await runCourseAssignmentIntent("DisableCourseAssignmentIntent", {
      assignmentId: assignmentId
    });

    return readIntentDataOrThrow(result);
  },

  archiveCourseAssignment: async function (assignmentId) {
    var result = await runCourseAssignmentIntent("ArchiveCourseAssignmentIntent", {
      assignmentId: assignmentId
    });

    return readIntentDataOrThrow(result);
  }
};

async function runCourseAssignmentIntent(intentType, payload) {
  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload,
    actor: getActor(),
    meta: {
      createdAt: Date.now(),
      source: "course-creator-dashboard"
    }
  });
}

function getActor() {
  if (auth.currentUser) {
    return {
      id: auth.currentUser.uid,
      role: "ROLE_COURSE_CREATOR"
    };
  }

  return null;
}

function readIntentDataOrThrow(result) {
  if (result && result.emitted && result.emitted.success) {
    return result.emitted.data;
  }

  throw new Error(readIntentErrorMessage(result));
}

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    if (result.emitted.errors[0].message) {
      return result.emitted.errors[0].message;
    }

    if (result.emitted.errors[0].code) {
      return result.emitted.errors[0].code;
    }
  }

  if (result && result.errors && result.errors.length > 0) {
    if (result.errors[0].message) {
      return result.errors[0].message;
    }

    if (result.errors[0].code) {
      return result.errors[0].code;
    }
  }

  return "Unknown course assignment error";
}
