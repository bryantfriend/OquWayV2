import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js?v=1.1.153-student-course-journey-polish";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.153-student-course-journey-polish";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.153-student-course-journey-polish";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.153-student-course-journey-polish";
import { attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.153-student-course-journey-polish";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.153-student-course-journey-polish";
import { processUpdateModule } from "../../stages/process/processors.js?v=1.1.153-student-course-journey-polish";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.153-student-course-journey-polish";

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
