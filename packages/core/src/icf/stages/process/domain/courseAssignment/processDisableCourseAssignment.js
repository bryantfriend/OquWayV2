import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.118-fruit-login-student-identity";

export async function processDisableCourseAssignment(executionState) {
  var payload = executionState.payload || {};
  var existingAssignment = executionState.context.courseAssignment;
  var actorUid = executionState.actor && executionState.actor.id ? executionState.actor.id : "";
  var path = "courseAssignments/" + (payload.assignmentId || "");

  try {
    var updateData = {
      status: "disabled",
      disabledAt: serverTimestamp(),
      disabledBy: actorUid,
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, "courseAssignments", payload.assignmentId), updateData, { merge: true });

    executionState.result = Object.assign({}, existingAssignment, updateData);
    return { valid: true };
  } catch (error) {
    logDisableFailure(payload.assignmentId, actorUid, path, error);

    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_DISABLE_FAILED",
          message: "Failed to disable course assignment: " + readErrorMessage(error)
        }
      ]
    };
  }
}

function logDisableFailure(assignmentId, actorUid, path, error) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[course-assignment:disable] failed", {
    assignmentId: assignmentId || "",
    actorUid: actorUid || "",
    path: path || "",
    errorCode: error && error.code ? error.code : "",
    errorMessage: readErrorMessage(error)
  });
}

function readErrorMessage(error) {
  return error && error.message ? error.message : String(error || "unknown error");
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && window.location
    && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
      || window.location.hostname === "");
}
