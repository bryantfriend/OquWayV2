import { validateAuthenticated, validateTeacherClassPayload } from "../../stages/validate/validators.js?v=1.1.53-teacher-profile-auth";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.53-teacher-profile-auth";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.53-teacher-profile-auth";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.53-teacher-profile-auth";
import { processLoadTeacherStudents } from "../../stages/process/processors.js?v=1.1.53-teacher-profile-auth";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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


