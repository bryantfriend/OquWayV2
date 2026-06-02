import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processGenerateModuleSkeleton } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function GenerateModuleSkeletonIntent() {
  return {
    type: "GenerateModuleSkeletonIntent",
    validate: [validateAuthenticated, validateCourseId],
    normalize: [normalizeCourseId, normalizeModuleShell],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processGenerateModuleSkeleton],
    emit: [emitIntentResult]
  };
}
