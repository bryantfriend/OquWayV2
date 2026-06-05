import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processLoadAdminProfile } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

export function LoadAdminProfileIntent() {
  return {
    type: "LoadAdminProfileIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processLoadAdminProfile],
    emit: [emitIntentResult]
  };
}
