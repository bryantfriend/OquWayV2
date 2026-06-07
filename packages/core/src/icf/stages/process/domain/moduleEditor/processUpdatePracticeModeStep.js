import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.111-student-assignment-debug-panel";
import { updatePracticeModeStep } from "./practiceModeShells.js?v=1.1.111-student-assignment-debug-panel";

export async function processUpdatePracticeModeStep(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var stepPatch = createStepPatch(payload);
  var practiceModes = updatePracticeModeStep(session.practiceModes, payload.practiceModeKey, payload.stepId, stepPatch);

  try {
    await savePracticeModes(executionState, payload, practiceModes);
    executionState.result = Object.assign({}, session, { practiceModes: practiceModes });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_UPDATE_FAILED",
          message: "Failed to update practice mode step: " + error.message
        }
      ]
    };
  }
}

function createStepPatch(payload) {
  return {
    title: payload.title,
    instructions: payload.instructions,
    config: payload.config,
    status: payload.status
  };
}

async function savePracticeModes(executionState, payload, practiceModes) {
  await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
    practiceModes: practiceModes,
    updatedAt: serverTimestamp()
  }, { merge: true });

  if (payload.modeId) {
    await setDoc(doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId, "steps", payload.stepId), {
      id: payload.stepId,
      type: payload.stepType,
      stepTypeId: payload.stepType,
      title: payload.title,
      instructions: payload.instructions,
      config: payload.config,
      status: payload.status,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
