import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.40-teacher-profile-admin-fix";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.40-teacher-profile-admin-fix";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.40-teacher-profile-admin-fix";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.40-teacher-profile-admin-fix";
import { processLoadTeacherReviewQueue } from "../../stages/process/processors.js?v=1.1.40-teacher-profile-admin-fix";
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

