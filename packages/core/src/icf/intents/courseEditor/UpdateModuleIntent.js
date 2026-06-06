import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.108-student-class-alias-merge";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.108-student-class-alias-merge";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.108-student-class-alias-merge";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.108-student-class-alias-merge";
import { processUpdateModule } from "../../stages/process/processors.js?v=1.1.108-student-class-alias-merge";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.108-student-class-alias-merge";

export function UpdateModuleIntent() {
  return {
    type: "UpdateModuleIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateModuleId
    ],
    normalize: [
      normalizeCourseId,
      normalizeModuleShell
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocument,
      attachModuleDocument
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUpdateModule
    ],
    emit: [
      emitIntentResult
    ]
  };
}
