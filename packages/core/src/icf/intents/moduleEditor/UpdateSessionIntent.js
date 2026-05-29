import { validateAuthenticated, validateCourseId, validateModuleId, validateSessionId } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeSessionShell } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processUpdateSession } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function UpdateSessionIntent() {
  return {
    type: "UpdateSessionIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId,
      validateSessionId
    ],
    normalize: [
      normalizeCourseId,
      normalizeSessionShell
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocumentForModule,
      attachModuleDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUpdateSession
    ],
    emit: [
      emitIntentResult
    ]
  };
}
