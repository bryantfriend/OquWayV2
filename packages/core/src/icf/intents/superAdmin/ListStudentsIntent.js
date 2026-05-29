import { validateAuthenticated } from "../../stages/validate/validators.js";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js";
import { processListStudents } from "../../stages/process/processors.js";
import { emitIntentResult } from "../../stages/emit/emitters.js";

export function ListStudentsIntent() {
  return {
    type: "ListStudentsIntent",
    validate: [validateAuthenticated],
    normalize: [],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processListStudents],
    emit: [emitIntentResult]
  };
}
