import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processCreateModule } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function CreateModuleIntent() {
  return {
    type: "CreateModuleIntent",
    validate: [
      validateAuthenticated,
      validateCourseId
    ],
    normalize: [
      normalizeCourseId,
      normalizeModuleShell
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocument,
      attachModulesCollection
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processCreateModule
    ],
    emit: [
      emitIntentResult
    ]
  };
}
