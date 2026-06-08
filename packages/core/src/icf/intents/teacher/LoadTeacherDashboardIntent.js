import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.127-teacher-students-scope";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.127-teacher-students-scope";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.127-teacher-students-scope";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.127-teacher-students-scope";
import { processLoadTeacherDashboard } from "../../stages/process/processors.js?v=1.1.127-teacher-students-scope";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.127-teacher-students-scope";

export function LoadTeacherDashboardIntent() {
  return {
    type: "LoadTeacherDashboardIntent",
    validate: [validateAuthenticated, validateTeacherReviewQueuePayload],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherDashboard],
    emit: [emitIntentResult]
  };
}


