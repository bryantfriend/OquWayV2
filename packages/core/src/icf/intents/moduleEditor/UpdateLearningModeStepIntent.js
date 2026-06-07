import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.111-student-assignment-debug-panel";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.111-student-assignment-debug-panel";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.111-student-assignment-debug-panel";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.111-student-assignment-debug-panel";
import { processUpdateLearningModeStep } from "../../stages/process/processors.js?v=1.1.111-student-assignment-debug-panel";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.111-student-assignment-debug-panel";

export function UpdateLearningModeStepIntent() {
  return {
    type: "UpdateLearningModeStepIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateLearningModeId,
      validatePracticeModeStepId,
      validateStepUpdates
    ],
    normalize: [
      normalizeCourseId
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachLearningModeDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUpdateLearningModeStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}

function validateStepUpdates(executionState) {
  var payload = executionState.payload || {};

  if (!payload.updates || typeof payload.updates !== "object" || Array.isArray(payload.updates)) {
    return {
      valid: false,
      errors: [
        {
          code: "STEP_UPDATES_REQUIRED",
          message: "Step updates are required."
        }
      ]
    };
  }

  return { valid: true };
}
