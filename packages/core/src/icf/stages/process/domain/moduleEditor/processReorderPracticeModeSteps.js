import { db, doc, serverTimestamp, writeBatch } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";
import { reorderPracticeModeSteps } from "./practiceModeShells.js?v=1.1.162-modal-stack";
import { countModuleSteps as countSharedModuleSteps } from "../../../../../../../domain/progress/index.js";

export async function processReorderPracticeModeSteps(executionState) {
  var payload = executionState.payload || {};
  var session = executionState.context.session;
  var modeId = readModeId(executionState);
  var collectionName = readCourseCollectionName(executionState);
  var learningMode = readLearningMode(executionState, modeId);
  var canonicalSteps = readCanonicalSteps(learningMode);
  if (canonicalSteps.length === 0) {
    canonicalSteps = readLegacySteps(session, payload.practiceModeKey);
  }
  var validation = validateRequestedOrder(canonicalSteps, payload.orderedStepIds);

  if (!validation.valid) {
    return validation;
  }

  var reorderedSteps = createReorderedSteps(canonicalSteps, payload.orderedStepIds);
  var updatedLearningMode = createUpdatedLearningMode(learningMode, modeId, reorderedSteps);
  var practiceModes = reorderPracticeModeSteps(session.practiceModes, payload.practiceModeKey, payload.orderedStepIds);
  var selectedStepId = payload.selectedStepId && doesStepListContainStep(reorderedSteps, payload.selectedStepId)
    ? payload.selectedStepId
    : readFirstStepId(reorderedSteps);
  var updatedSession = Object.assign({}, session, {
    learningModeId: modeId,
    practiceModes: practiceModes,
    updatedAt: Date.now()
  });

  try {
    var batch = writeBatch(db);
    var moduleRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId);
    var modeRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId, "learningModes", modeId);
    var sessionRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId);

    reorderedSteps.forEach(function (step) {
      batch.set(doc(db, collectionName, payload.courseId, "modules", payload.moduleId, "learningModes", modeId, "steps", step.id), Object.assign({}, step, {
        updatedAt: serverTimestamp()
      }), { merge: true });
    });

    batch.set(modeRef, Object.assign({}, updatedLearningMode, {
      updatedAt: serverTimestamp()
    }), { merge: true });
    batch.set(moduleRef, {
      learningModes: {
        [modeId]: updatedLearningMode
      },
      stepCount: readUpdatedModuleStepCount(executionState, modeId, updatedLearningMode.stepCount),
      updatedAt: serverTimestamp()
    }, { merge: true });
    batch.set(sessionRef, Object.assign({}, updatedSession, {
      updatedAt: serverTimestamp()
    }), { merge: true });

    await batch.commit();

    executionState.result = {
      session: updatedSession,
      learningMode: updatedLearningMode,
      selectedStepId: selectedStepId,
      orderedStepIds: updatedLearningMode.stepOrder
    };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_REORDER_FAILED",
          message: "Failed to reorder practice mode steps: " + error.message
        }
      ]
    };
  }
}

function validateRequestedOrder(steps, orderedStepIds) {
  var currentStepIds = steps.map(function (step) {
    return step.id;
  });

  if (orderedStepIds.length !== currentStepIds.length) {
    return {
      valid: false,
      errors: [
        {
          code: "ORDERED_STEP_IDS_MISMATCH",
          message: "Step order must include every step in this module path exactly once."
        }
      ]
    };
  }

  var missingStepIds = currentStepIds.filter(function (stepId) {
    return orderedStepIds.indexOf(stepId) === -1;
  });
  var unknownStepIds = orderedStepIds.filter(function (stepId) {
    return currentStepIds.indexOf(stepId) === -1;
  });

  if (missingStepIds.length > 0 || unknownStepIds.length > 0) {
    return {
      valid: false,
      errors: [
        {
          code: "ORDERED_STEP_IDS_NOT_IN_PATH",
          message: "Step order contains steps that do not belong to this module path."
        }
      ]
    };
  }

  return { valid: true };
}

function createReorderedSteps(steps, orderedStepIds) {
  return orderedStepIds.map(function (stepId, index) {
    var step = findStepById(steps, stepId);
    return Object.assign({}, step, {
      order: index + 1,
      updatedAt: Date.now()
    });
  });
}

function createUpdatedLearningMode(learningMode, modeId, steps) {
  return Object.assign({}, learningMode, {
    id: modeId,
    key: modeId,
    steps: steps,
    stepOrder: steps.map(function (step) {
      return step.id;
    }),
    stepCount: steps.length,
    updatedAt: Date.now()
  });
}

function readModeId(executionState) {
  var payload = executionState.payload || {};
  var session = executionState.context.session || null;

  if (payload.modeId) {
    return payload.modeId;
  }

  if (session && session.learningModeId) {
    return session.learningModeId;
  }

  return "primary";
}

function readLearningMode(executionState, modeId) {
  if (executionState.context.learningMode) {
    return Object.assign({ id: modeId }, executionState.context.learningMode);
  }

  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};

  return Object.assign({
    id: modeId,
    key: modeId,
    status: "draft",
    steps: [],
    stepOrder: []
  }, modes[modeId] || {});
}

function readCanonicalSteps(learningMode) {
  if (!learningMode || !Array.isArray(learningMode.steps)) {
    return [];
  }

  return learningMode.steps.slice().sort(function (firstStep, secondStep) {
    return readOrder(firstStep) - readOrder(secondStep);
  });
}

function readLegacySteps(session, practiceModeKey) {
  var practiceMode = session && session.practiceModes && session.practiceModes[practiceModeKey]
    ? session.practiceModes[practiceModeKey]
    : null;
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];

  return steps.slice().sort(function (firstStep, secondStep) {
    return readOrder(firstStep) - readOrder(secondStep);
  });
}

function findStepById(steps, stepId) {
  var index = 0;
  while (index < steps.length) {
    if (steps[index] && steps[index].id === stepId) {
      return steps[index];
    }
    index = index + 1;
  }
  return null;
}

function doesStepListContainStep(steps, stepId) {
  return steps.some(function (step) {
    return step && step.id === stepId;
  });
}

function readFirstStepId(steps) {
  return steps.length > 0 && steps[0] && steps[0].id ? steps[0].id : "";
}

function readUpdatedModuleStepCount(executionState, updatedModeId, updatedModeStepCount) {
  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var nextModes = Object.assign({}, modes, {
    [updatedModeId]: Object.assign({}, modes[updatedModeId] || {}, {
      stepCount: readNumber(updatedModeStepCount, 0)
    })
  });

  return countSharedModuleSteps(Object.assign({}, module, {
    learningModes: nextModes
  }));
}

function readNumber(value, fallbackValue) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallbackValue;
}

function readOrder(step) {
  return step && typeof step.order === "number" ? step.order : 0;
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
}
