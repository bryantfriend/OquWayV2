import { validateAuthenticated, validateTeacherClassPayload } from "../../stages/validate/validators.js?v=1.1.122-teacher-dashboard-overhaul";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.122-teacher-dashboard-overhaul";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.122-teacher-dashboard-overhaul";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.122-teacher-dashboard-overhaul";
import { processLoadTeacherStudents } from "../../stages/process/processors.js?v=1.1.122-teacher-dashboard-overhaul";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.122-teacher-dashboard-overhaul";

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


