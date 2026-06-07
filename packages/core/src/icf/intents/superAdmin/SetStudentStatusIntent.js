import { validateAuthenticated, validateStudentStatusPayload } from "../../stages/validate/validators.js?v=1.1.124-location-icon-upload";
import { normalizeStudentPayload } from "../../stages/normalize/normalizers.js?v=1.1.124-location-icon-upload";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.124-location-icon-upload";
import { requireSuperAdminAccess } from "../../stages/authorize/authorizers.js?v=1.1.124-location-icon-upload";
import { processSetStudentStatus } from "../../stages/process/processors.js?v=1.1.124-location-icon-upload";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.124-location-icon-upload";

export function SetStudentStatusIntent() {
  return {
    type: "SetStudentStatusIntent",
    validate: [validateAuthenticated, validateStudentStatusPayload],
    normalize: [normalizeStudentPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireSuperAdminAccess],
    process: [processSetStudentStatus],
    emit: [emitIntentResult]
  };
}
