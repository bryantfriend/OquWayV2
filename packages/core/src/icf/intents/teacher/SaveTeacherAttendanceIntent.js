import { validateAuthenticated, validateTeacherAttendanceSavePayload } from "../../stages/validate/validators.js?v=1.1.222-activity-step-rendering";
import { normalizeTeacherAttendancePayload } from "../../stages/normalize/normalizers.js?v=1.1.222-activity-step-rendering";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.222-activity-step-rendering";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processSaveTeacherAttendance } from "../../stages/process/processors.js?v=1.1.222-activity-step-rendering";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.222-activity-step-rendering";

export function SaveTeacherAttendanceIntent() {
  return {
    type: "SaveTeacherAttendanceIntent",
    validate: [validateAuthenticated, validateTeacherAttendanceSavePayload],
    normalize: [normalizeTeacherAttendancePayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processSaveTeacherAttendance],
    emit: [emitIntentResult]
  };
}
