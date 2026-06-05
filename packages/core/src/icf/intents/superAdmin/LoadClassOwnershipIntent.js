import { validateAuthenticated, validateClassOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.63-external-task-student-feedback";
import { normalizeClassOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.63-external-task-student-feedback";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.63-external-task-student-feedback";
import { requireCourseAssignmentAdminAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.63-external-task-student-feedback";
import { processLoadClassOwnership } from "../../stages/process/processors.js?v=1.1.63-external-task-student-feedback";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.63-external-task-student-feedback";

export function LoadClassOwnershipIntent() {
  return {
    type: "LoadClassOwnershipIntent",
    validate: [validateAuthenticated, validateClassOwnershipPayload],
    normalize: [normalizeClassOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext],
    authorize: [requireCourseAssignmentAdminAuthorization],
    process: [processLoadClassOwnership],
    emit: [emitIntentResult]
  };
}
