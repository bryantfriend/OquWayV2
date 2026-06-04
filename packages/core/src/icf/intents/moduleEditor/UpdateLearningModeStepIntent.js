import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processUpdateLearningModeStep } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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
