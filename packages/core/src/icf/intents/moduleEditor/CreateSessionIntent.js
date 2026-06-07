import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.113-student-rules-read";
import { normalizeCourseId, normalizeSessionShell } from "../../stages/normalize/normalizers.js?v=1.1.113-student-rules-read";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionsCollection } from "../../stages/addContext/contexts.js?v=1.1.113-student-rules-read";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.113-student-rules-read";
import { processCreateSession } from "../../stages/process/processors.js?v=1.1.113-student-rules-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.113-student-rules-read";

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
