import { validateAuthenticated, validateLocationPayload } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeLocationPayload } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processCreateLocation } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

export function CreateLocationIntent() {
  return {
    type: "CreateLocationIntent",
    validate: [validateAuthenticated, validateLocationPayload],
    normalize: [normalizeLocationPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processCreateLocation],
    emit: [emitIntentResult]
  };
}
