import { validateAuthenticated, validateCourseId, validateModuleId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processCreatePracticeModeShells } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function CreatePracticeModeShellsIntent() {
  return {
    type: "CreatePracticeModeShellsIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId
    ],
    normalize: [
      normalizeCourseId
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
      processCreatePracticeModeShells
    ],
    emit: [
      emitIntentResult
    ]
  };
}
