import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.27-module-repair";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.27-module-repair";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processCreateModule } from "../../stages/process/processors.js?v=1.1.27-module-repair";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
