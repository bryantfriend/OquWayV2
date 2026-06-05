import { validateAuthenticated, validateCourseAssignmentOwnershipPayload } from "../../stages/validate/validators.js?v=1.1.61-assignment-ownership-read";
import { normalizeCourseAssignmentOwnershipPayload } from "../../stages/normalize/normalizers.js?v=1.1.61-assignment-ownership-read";
import { attachActorContext, attachActorRoleContext, attachCourseAssignmentContext } from "../../stages/addContext/contexts.js?v=1.1.61-assignment-ownership-read";
import { requireCourseAssignmentOwnershipAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.61-assignment-ownership-read";
import { processAssignCourseTeacher } from "../../stages/process/processors.js?v=1.1.61-assignment-ownership-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.61-assignment-ownership-read";

export function AssignCourseTeacherIntent() {
  return {
    type: "AssignCourseTeacherIntent",
    validate: [validateAuthenticated, validateCourseAssignmentOwnershipPayload],
    normalize: [normalizeCourseAssignmentOwnershipPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseAssignmentContext],
    authorize: [requireCourseAssignmentOwnershipAuthorization],
    process: [processAssignCourseTeacher],
    emit: [emitIntentResult]
  };
}
