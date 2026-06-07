import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processCreateModule } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

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
