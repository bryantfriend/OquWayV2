import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.152-course-builder-loading-timeout";
import { getIntentDefinition } from "../../../../../packages/icf/index.js?v=1.1.152-course-builder-loading-timeout";
import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.152-course-builder-loading-timeout";

export const courseAssignmentService = {
  listAssignableTargets: async function () {
    var results = await Promise.allSettled([
      runCourseAssignmentIntent("ListClassesIntent", {}),
      runCourseAssignmentIntent("ListStudentsIntent", {}),
      runCourseAssignmentIntent("ListLocationsIntent", {})
    ]);

    return {
      classes: readListResult(results[0], "classes"),
      students: readListResult(results[1], "students"),
      locations: readListResult(results[2], "locations"),
      warnings: readListWarnings(results)
    };
  },

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

function readListResult(settledResult, key) {
  if (!settledResult || settledResult.status !== "fulfilled") {
    return [];
  }

  try {
    var data = readIntentDataOrThrow(settledResult.value);
    return data && Array.isArray(data[key]) ? data[key] : [];
  } catch (error) {
    return [];
  }
}

function readListWarnings(results) {
  var warnings = [];

  results.forEach(function (settledResult) {
    if (!settledResult) {
      return;
    }

    if (settledResult.status === "rejected") {
      warnings.push(settledResult.reason && settledResult.reason.message ? settledResult.reason.message : "Could not load an assignment target list.");
      return;
    }

    try {
      readIntentDataOrThrow(settledResult.value);
    } catch (error) {
      warnings.push(error.message);
    }
  });

  return warnings;
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
