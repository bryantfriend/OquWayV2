import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachActorContext, attachActorRoleContext, attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { processLoadModules } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

export function LoadModulesIntent() {
  return {
    type: "LoadModulesIntent",
    validate: [
      validateAuthenticated,
      validateCourseId
    ],
    normalize: [normalizeCourseId],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachCourseDocument,
      attachModulesCollection
    ],
    authorize: [requireCourseCreatorAuthorization],
    process: [processLoadModules],
    emit: [emitIntentResult]
  };
}
