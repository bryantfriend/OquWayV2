import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.81-class-command-center";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { processGenerateStarterSteps } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

export function GenerateStarterStepsIntent() {
  return {
    type: "GenerateStarterStepsIntent",
    validate: [validateAuthenticated, validateCourseId],
    normalize: [normalizeCourseId],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processGenerateStarterSteps],
    emit: [emitIntentResult]
  };
}
