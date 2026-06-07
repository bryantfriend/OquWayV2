import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.117-student-identity-binding";

export async function processUpdateCourseAssignment(executionState) {
  var payload = executionState.payload;
  var existingAssignment = executionState.context.courseAssignment;

  try {
    var updateData = {
      status: payload.status,
      updatedAt: serverTimestamp()
    };

    if (payload.status === "disabled") {
      updateData.disabledAt = serverTimestamp();
      updateData.disabledBy = executionState.actor && executionState.actor.id ? executionState.actor.id : "";
    }

    await setDoc(doc(db, "courseAssignments", payload.assignmentId), updateData, { merge: true });

    executionState.result = Object.assign({}, existingAssignment, updateData);
    return { valid: true };
  } catch (error) {
    logCourseAssignmentProcessError("UpdateCourseAssignmentIntent", executionState, error, payload.assignmentId);
    return {
      valid: false,
      errors: [
        {
          code: "COURSE_ASSIGNMENT_UPDATE_FAILED",
          message: "Failed to update course assignment: " + error.message
        }
      ]
    };
  }
}

function logCourseAssignmentProcessError(intentName, executionState, error, assignmentId) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[course-assignment-debug] Process failed.", {
    intentName: executionState.intentType || intentName,
    actor: executionState.actor && executionState.actor.id ? executionState.actor.id : "unknown",
    path: "courseAssignments/" + (assignmentId || ""),
    firebaseErrorCode: error && error.code ? error.code : "",
    message: error && error.message ? error.message : String(error || "unknown error")
  });
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
      || window.location.hostname === "");
}
