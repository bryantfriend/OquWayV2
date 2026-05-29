import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeSessionShell } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processCreateSession } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
