import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processCreateModule } from "../../stages/process/processors.js";
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
