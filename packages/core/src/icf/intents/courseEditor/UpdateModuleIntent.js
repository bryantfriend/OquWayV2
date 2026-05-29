import { validateAuthenticated, validateCourseId, validateModuleId } from "../../stages/validate/validators.js";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { attachCourseDocument } from "../../stages/addContext/contexts.js";
import { attachModuleDocument } from "../../stages/addContext/contexts.js";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js";
import { processUpdateModule } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

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
