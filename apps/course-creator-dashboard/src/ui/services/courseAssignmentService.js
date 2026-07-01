import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.82-shared-command-center-shell";
import { collection, db, getDocs, query, where } from "../../../../../packages/firebase/firestore/index.js?v=1.1.82-shared-command-center-shell";
import { getIntentDefinition } from "../../../../../packages/icf/index.js?v=1.1.82-shared-command-center-shell";
import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.82-shared-command-center-shell";

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
  },

  listAssignableTargets: async function () {
    var result = {
      classes: [],
      students: [],
      locations: [],
      warnings: []
    };

    await appendReadableCollectionTargets(result, "classes", "classes", readClassTarget);
    await appendReadableCollectionTargets(result, "locations", "locations", readLocationTarget);
    await appendReadableStudentTargets(result);
    return result;
  }
};

async function appendReadableCollectionTargets(result, resultKey, collectionName, mapper) {
  try {
    var snapshot = await getDocs(collection(db, collectionName));

    snapshot.forEach(function (docSnap) {
      result[resultKey].push(mapper(docSnap.id, docSnap.data()));
    });
  } catch (error) {
    result.warnings.push("Could not load " + resultKey + ": " + error.message);
  }
}

async function appendReadableStudentTargets(result) {
  try {
    var snapshot = await getDocs(query(collection(db, "users"), where("role", "==", "student")));

    snapshot.forEach(function (docSnap) {
      result.students.push(readStudentTarget(docSnap.id, docSnap.data()));
    });
  } catch (error) {
    result.warnings.push("Could not load students: " + error.message);
  }
}

function readClassTarget(id, data) {
  return {
    id: id,
    label: readTargetLabel(data, ["name", "className", "title"], "Class " + id),
    detail: readTargetLabel(data, ["locationName", "grade", "level"], "")
  };
}

function readLocationTarget(id, data) {
  return {
    id: id,
    label: readTargetLabel(data, ["name", "locationName", "title"], "Location " + id),
    detail: readTargetLabel(data, ["city", "region", "country"], "")
  };
}

function readStudentTarget(id, data) {
  return {
    id: id,
    label: readTargetLabel(data, ["displayName", "name", "fullName", "studentName"], "Student " + id),
    detail: readTargetLabel(data, ["className", "locationName", "email"], "")
  };
}

function readTargetLabel(data, keys, fallback) {
  var index = 0;

  while (index < keys.length) {
    if (data && typeof data[keys[index]] === "string" && data[keys[index]].trim()) {
      return data[keys[index]].trim();
    }

    index = index + 1;
  }

  return fallback;
}

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
