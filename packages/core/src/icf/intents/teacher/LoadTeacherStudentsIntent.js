import { validateAuthenticated, validateTeacherClassPayload } from "../../stages/validate/validators.js?v=1.1.36-teacher-auth";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.36-teacher-auth";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.36-teacher-auth";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.36-teacher-auth";
import { processLoadTeacherStudents } from "../../stages/process/processors.js?v=1.1.36-teacher-auth";
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
