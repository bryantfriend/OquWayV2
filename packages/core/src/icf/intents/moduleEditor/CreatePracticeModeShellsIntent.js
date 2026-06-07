import { validateAuthenticated, validateCourseId, validateModuleId, validateSessionId } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachCourseDocumentForModule, attachModuleDocument, attachSessionDocument } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processCreatePracticeModeShells } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

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
