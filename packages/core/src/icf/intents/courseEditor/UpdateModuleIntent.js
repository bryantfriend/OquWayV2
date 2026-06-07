import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processUpdateModule } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

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
