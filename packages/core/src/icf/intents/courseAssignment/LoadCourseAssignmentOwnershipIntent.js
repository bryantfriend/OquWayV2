import { validateAuthenticated, validateCourseAssignmentOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.56-assignment-ownership";
import { normalizeCourseAssignmentOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.56-assignment-ownership";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.56-assignment-ownership";
import { requireCourseAssignmentOwnershipReadAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.56-assignment-ownership";
import { processLoadCourseAssignmentOwnership } from "../../stages/process/processors.js?v=1.1.56-assignment-ownership";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

export function LoadCourseAssignmentOwnershipIntent() {
  return {
    type: "LoadCourseAssignmentOwnershipIntent",
    validate: [validateAuthenticated, validateCourseAssignmentOwnershipPayload],
    normalize: [normalizeCourseAssignmentOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseAssignmentContext],
    authorize: [requireCourseAssignmentOwnershipReadAuthorization],
    process: [processLoadCourseAssignmentOwnership],
    emit: [emitIntentResult]
  };
}
