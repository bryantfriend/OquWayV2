import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processOpenCreateModuleWizard } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
