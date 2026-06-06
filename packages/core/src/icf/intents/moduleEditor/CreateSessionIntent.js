import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeCourseId, normalizeSessionShell } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processCreateSession } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

export function CreateSessionIntent() {
  return {
    type: "CreateSessionIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId
    ],
    normalize: [
      normalizeCourseId,
      normalizeSessionShell
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
      processCreateSession
    ],
    emit: [
      emitIntentResult
    ]
  };
}
