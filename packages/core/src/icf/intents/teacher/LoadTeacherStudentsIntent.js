import { validateAuthenticated, validateTeacherClassPayload } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processLoadTeacherStudents } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

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


