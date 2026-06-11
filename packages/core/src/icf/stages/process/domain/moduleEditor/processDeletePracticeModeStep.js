import { collection, db, doc, getDocs, serverTimestamp, writeBatch } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";
import { deletePracticeModeStep } from "./practiceModeShells.js?v=1.1.162-modal-stack";

export async function processDeletePracticeModeStep(executionState) {
  var payload = executionState.payload || {};
  var session = executionState.context.session;
  var modeId = readModeId(executionState);
  var collectionName = readCourseCollectionName(executionState);
  var learningMode = readLearningMode(executionState, modeId);
  var canonicalSteps = readCanonicalSteps(learningMode);
  if (canonicalSteps.length === 0) {
    canonicalSteps = readLegacySteps(session, payload.practiceModeKey);
  }
  var legacyContainsStep = doesLegacySessionContainStep(session, payload.practiceModeKey, payload.stepId);
  var canonicalContainsStep = doesStepListContainStep(canonicalSteps, payload.stepId);

  if (!canonicalContainsStep && !legacyContainsStep) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_NOT_FOUND",
          message: "Step was not found in this module path."
        }
      ]
    };
  }

  var remainingSteps = removeStepFromList(canonicalSteps, payload.stepId);
  var updatedLearningMode = createUpdatedLearningMode(learningMode, modeId, remainingSteps);
  var practiceModes = deletePracticeModeStep(session.practiceModes, payload.practiceModeKey, payload.stepId);
  var updatedSession = Object.assign({}, session, {
    learningModeId: modeId,
    practiceModes: practiceModes,
    updatedAt: Date.now()
  });
  var selectedStepId = readSafeSelectedStepId(canonicalSteps, remainingSteps, payload.stepId, payload.selectedStepId);

  try {
    var batch = writeBatch(db);
    var moduleRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId);
    var courseRef = doc(db, collectionName, payload.courseId);
    var modeRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId, "learningModes", modeId);
    var stepRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId, "learningModes", modeId, "steps", payload.stepId);
    var sessionRef = doc(db, collectionName, payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId);
    var updatedModuleStepCount = readUpdatedModuleStepCount(executionState, modeId, updatedLearningMode.stepCount);
    var updatedCourseStepCount = await readUpdatedCourseStepCount(collectionName, payload.courseId, payload.moduleId, updatedModuleStepCount, executionState.context.module);

    batch.delete(stepRef);
    updatedLearningMode.steps.forEach(function (step) {
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
      stepCount: updatedModuleStepCount,
      stepsInitialized: true,
      updatedAt: serverTimestamp()
    }, { merge: true });
    batch.set(courseRef, {
      stepCount: updatedCourseStepCount,
      updatedAt: serverTimestamp()
    }, { merge: true });
    batch.set(sessionRef, Object.assign({}, updatedSession, {
      updatedAt: serverTimestamp()
    }), { merge: true });

    await batch.commit();

    executionState.result = {
      session: updatedSession,
      learningMode: updatedLearningMode,
      deletedStepId: payload.stepId,
      selectedStepId: selectedStepId,
      orderedStepIds: updatedLearningMode.stepOrder,
      updatedStepCount: updatedLearningMode.stepCount,
      updatedModuleSummary: {
        id: payload.moduleId,
        stepCount: updatedModuleStepCount
      },
      updatedCourseSummary: {
        id: payload.courseId,
        stepCount: updatedCourseStepCount
      }
    };
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "PRACTICE_MODE_STEP_DELETE_FAILED",
          message: "Failed to delete practice mode step: " + error.message
        }
      ]
    };
  }
}

async function readUpdatedCourseStepCount(collectionName, courseId, updatedModuleId, updatedModuleStepCount, currentModule) {
  var modulesSnapshot = await getDocs(collection(db, collectionName, courseId, "modules"));
  var total = 0;
  var sawUpdatedModule = false;

  modulesSnapshot.forEach(function (moduleDoc) {
    if (moduleDoc.id === updatedModuleId) {
      total = total + readNumber(updatedModuleStepCount, 0);
      sawUpdatedModule = true;
      return;
    }

    total = total + countModuleSteps(moduleDoc.data() || {});
  });

  if (!sawUpdatedModule) {
    total = total + readNumber(updatedModuleStepCount, countModuleSteps(currentModule));
  }

  return total;
}

function countModuleSteps(module) {
  if (!module || typeof module !== "object") {
    return 0;
  }

  if (module.learningModes && typeof module.learningModes === "object") {
    return countLearningModeSteps(module.learningModes);
  }

  return readNumber(module.stepCount, 0);
}

function countLearningModeSteps(learningModes) {
  var total = 0;

  Object.keys(learningModes || {}).forEach(function (modeId) {
    var mode = learningModes[modeId];

    if (mode && Array.isArray(mode.stepOrder) && mode.stepOrder.length > 0) {
      total = total + mode.stepOrder.length;
      return;
    }

    if (mode && Array.isArray(mode.steps)) {
      total = total + mode.steps.length;
      return;
    }

    total = total + readNumber(mode && mode.stepCount, 0);
  });

  return total;
}

function createUpdatedLearningMode(learningMode, modeId, steps) {
  var orderedSteps = renumberSteps(steps);

  return Object.assign({}, learningMode, {
    id: modeId,
    key: modeId,
    steps: orderedSteps,
    stepOrder: orderedSteps.map(function (step) {
      return step.id;
    }),
    stepCount: orderedSteps.length,
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

function removeStepFromList(steps, stepId) {
  return steps.filter(function (step) {
    return step && step.id !== stepId;
  });
}

function renumberSteps(steps) {
  return steps.map(function (step, index) {
    return Object.assign({}, step, {
      order: index + 1,
      updatedAt: Date.now()
    });
  });
}

function doesStepListContainStep(steps, stepId) {
  return steps.some(function (step) {
    return step && step.id === stepId;
  });
}

function doesLegacySessionContainStep(session, practiceModeKey, stepId) {
  return doesStepListContainStep(readLegacySteps(session, practiceModeKey), stepId);
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

function readSafeSelectedStepId(originalSteps, remainingSteps, deletedStepId, requestedSelectedStepId) {
  if (requestedSelectedStepId && requestedSelectedStepId !== deletedStepId && doesStepListContainStep(remainingSteps, requestedSelectedStepId)) {
    return requestedSelectedStepId;
  }

  if (remainingSteps.length === 0) {
    return "";
  }

  var deletedIndex = 0;
  while (deletedIndex < originalSteps.length) {
    if (originalSteps[deletedIndex] && originalSteps[deletedIndex].id === deletedStepId) {
      break;
    }
    deletedIndex = deletedIndex + 1;
  }

  if (deletedIndex < remainingSteps.length) {
    return remainingSteps[deletedIndex].id;
  }

  return remainingSteps[remainingSteps.length - 1].id;
}

function readUpdatedModuleStepCount(executionState, updatedModeId, updatedModeStepCount) {
  var module = executionState.context.module || {};
  var modes = module.learningModes && typeof module.learningModes === "object" ? module.learningModes : {};
  var modeIds = Object.keys(modes);
  var total = 0;

  modeIds.forEach(function (modeId) {
    if (modeId === updatedModeId) {
      total = total + readNumber(updatedModeStepCount, 0);
      return;
    }

    total = total + readNumber(modes[modeId] && modes[modeId].stepCount, 0);
  });

  if (modeIds.indexOf(updatedModeId) === -1) {
    total = total + readNumber(updatedModeStepCount, 0);
  }

  return total;
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
