import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext, attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processGenerateModuleSkeleton } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

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
