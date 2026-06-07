import { validateAuthenticated, validateTeacherClassPayload } from "../../stages/validate/validators.js?v=1.1.114-student-profile-rules";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.114-student-profile-rules";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.114-student-profile-rules";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.114-student-profile-rules";
import { processLoadTeacherStudents } from "../../stages/process/processors.js?v=1.1.114-student-profile-rules";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.114-student-profile-rules";

export function LoadTeacherStudentsIntent() {
  return {
    type: "LoadTeacherStudentsIntent",
    validate: [validateAuthenticated, validateTeacherClassPayload],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherStudents],
    emit: [emitIntentResult]
  };
}


