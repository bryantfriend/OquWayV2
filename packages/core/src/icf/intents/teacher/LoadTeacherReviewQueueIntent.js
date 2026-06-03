import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.35-teacher-dashboard";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.35-teacher-dashboard";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.35-teacher-dashboard";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.35-teacher-dashboard";
import { processLoadTeacherReviewQueue } from "../../stages/process/processors.js?v=1.1.35-teacher-dashboard";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function LoadTeacherReviewQueueIntent() {
  return {
    type: "LoadTeacherReviewQueueIntent",
    validate: [validateAuthenticated, validateTeacherReviewQueuePayload],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherReviewQueue],
    emit: [emitIntentResult]
  };
}
