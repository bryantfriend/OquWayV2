import { validateAuthenticated, validateTeacherClassPayload } from "../../stages/validate/validators.js?v=1.1.60-teacher-login-readtext";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.60-teacher-login-readtext";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.60-teacher-login-readtext";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.60-teacher-login-readtext";
import { processLoadTeacherStudents } from "../../stages/process/processors.js?v=1.1.60-teacher-login-readtext";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.60-teacher-login-readtext";

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


