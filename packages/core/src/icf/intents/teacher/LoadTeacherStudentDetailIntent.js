import { validateAuthenticated, validateTeacherStudentDetailPayload } from "../../stages/validate/validators.js?v=1.1.222-activity-step-rendering";
import { normalizeTeacherStudentDetailPayload } from "../../stages/normalize/normalizers.js?v=1.1.222-activity-step-rendering";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.222-activity-step-rendering";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processLoadTeacherStudentDetail } from "../../stages/process/processors.js?v=1.1.222-activity-step-rendering";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.222-activity-step-rendering";

export function LoadTeacherStudentDetailIntent() {
  return {
    type: "LoadTeacherStudentDetailIntent",
    validate: [validateAuthenticated, validateTeacherStudentDetailPayload],
    normalize: [normalizeTeacherStudentDetailPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherStudentDetail],
    emit: [emitIntentResult]
  };
}
