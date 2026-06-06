import { validateAuthenticated, validateCourseId, validateModuleId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { normalizeCourseId, normalizeSessionShell } from "../../stages/normalize/normalizers.js?v=1.1.81-class-command-center";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { attachCourseDocumentForModule, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { processUpdateSession } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

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
