import { validateAuthenticated, validateCourseId, validateModuleId, validatePracticeModeKey, validatePracticeModeStepId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseId, normalizePracticeModeStep } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processUpdatePracticeModeStep } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function UpdatePracticeModeStepIntent() {
  return {
    type: "UpdatePracticeModeStepIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId,
      validatePracticeModeKey,
      validatePracticeModeStepId
    ],
    normalize: [
      normalizeCourseId,
      normalizePracticeModeStep
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUpdatePracticeModeStep
    ],
    emit: [
      emitIntentResult
    ]
  };
}
