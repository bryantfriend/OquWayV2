import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.129-teacher-query-noise";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.129-teacher-query-noise";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.129-teacher-query-noise";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.129-teacher-query-noise";
import { processLoadTeacherDashboard } from "../../stages/process/processors.js?v=1.1.129-teacher-query-noise";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.129-teacher-query-noise";

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


