import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processListSessions } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function ListSessionsIntent() {
  return {
    type: "ListSessionsIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId
    ],
    normalize: [
      normalizeCourseId
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument,
      attachSessionsCollection
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processListSessions
    ],
    emit: [
      emitIntentResult
    ]
  };
}
