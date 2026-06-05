import { validateAuthenticated, validateCourseId, validateLearningModeId, validateModuleId, validatePracticeModeStepId } from "../../stages/validate/validators.js?v=1.1.78-location-command-center";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.78-location-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { attachCourseDocumentForModule, attachLearningModeDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.78-location-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.78-location-command-center";
import { processUpdateLearningModeStep } from "../../stages/process/processors.js?v=1.1.78-location-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.78-location-command-center";

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
