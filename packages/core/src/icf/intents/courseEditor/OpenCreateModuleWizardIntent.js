import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processOpenCreateModuleWizard } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function OpenCreateModuleWizardIntent() {
  return {
    type: "OpenCreateModuleWizardIntent",
    validate: [validateAuthenticated, validateCourseId],
    normalize: [normalizeCourseId],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processOpenCreateModuleWizard],
    emit: [emitIntentResult]
  };
}
