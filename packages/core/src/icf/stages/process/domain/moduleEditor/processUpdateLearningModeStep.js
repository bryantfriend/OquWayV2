import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.116-student-token-ready";
import { createDefaultStepConfig } from "../../../../../../../domain/steps/index.js";

export async function processUpdateLearningModeStep(executionState) {
  var payload = executionState.payload || {};
  var learningMode = executionState.context.learningMode || {};
  var existingStep = findStepById(learningMode.steps, payload.stepId);

  if (!existingStep) {
    return {
      valid: false,
      errors: [
        {
          code: "LEARNING_MODE_STEP_NOT_FOUND",
          message: "Learning mode step not found: " + payload.stepId
        }
      ]
    };
  }

  var updatedStep = createUpdatedStep(existingStep, payload.updates || {});
  var updatedLearningMode = createUpdatedLearningMode(learningMode, updatedStep);

  try {
    await setDoc(
      doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId, "steps", payload.stepId),
      Object.assign({}, updatedStep, { updatedAt: serverTimestamp() }),
      { merge: true }
    );

    await setDoc(
      doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId),
      {
        stepCount: updatedLearningMode.stepCount,
        stepOrder: updatedLearningMode.stepOrder,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    await setDoc(
      doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId),
      {
        learningModes: {
          [payload.modeId]: updatedLearningMode
        },
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    executionState.result = {
      learningMode: updatedLearningMode,
      step: updatedStep,
      modeId: payload.modeId,
      stepId: payload.stepId
    };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LEARNING_MODE_STEP_UPDATE_FAILED",
          message: "Failed to update learning mode step: " + error.message
        }
      ]
    };
  }
}

function createUpdatedStep(existingStep, updates) {
  var stepType = updates.type || updates.stepTypeId || existingStep.type || existingStep.stepTypeId || "";
  var nextStep = Object.assign({}, existingStep, {
    id: existingStep.id,
    type: stepType,
    stepTypeId: updates.stepTypeId || stepType,
    updatedAt: Date.now()
  });

  if (Object.prototype.hasOwnProperty.call(updates, "title")) {
    nextStep.title = updates.title;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "instructions")) {
    nextStep.instructions = updates.instructions;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "config")) {
    nextStep.config = createDefaultStepConfig(stepType, updates.config);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "status")) {
    nextStep.status = normalizeStatus(updates.status);
  }

  return nextStep;
}

function createUpdatedLearningMode(learningMode, updatedStep) {
  var steps = Array.isArray(learningMode.steps) ? learningMode.steps.slice() : [];
  var stepFound = false;

  steps = steps.map(function (step) {
    if (step && step.id === updatedStep.id) {
      stepFound = true;
      return updatedStep;
    }

    return step;
  });

  if (!stepFound) {
    steps.push(updatedStep);
  }

  steps.sort(function (firstStep, secondStep) {
    return readOrder(firstStep) - readOrder(secondStep);
  });

  return Object.assign({}, learningMode, {
    id: learningMode.id || "",
    steps: steps,
    stepCount: steps.length,
    stepOrder: steps.map(function (step) {
      return step.id;
    }).filter(Boolean),
    updatedAt: Date.now()
  });
}

function findStepById(steps, stepId) {
  var safeSteps = Array.isArray(steps) ? steps : [];
  var index = 0;

  while (index < safeSteps.length) {
    if (safeSteps[index] && safeSteps[index].id === stepId) {
      return safeSteps[index];
    }

    index = index + 1;
  }

  return null;
}

function readOrder(step) {
  if (step && typeof step.order === "number" && Number.isFinite(step.order)) {
    return step.order;
  }

  return 0;
}

function normalizeStatus(status) {
  if (status === "draft" || status === "ready" || status === "disabled") {
    return status;
  }

  return "draft";
}
