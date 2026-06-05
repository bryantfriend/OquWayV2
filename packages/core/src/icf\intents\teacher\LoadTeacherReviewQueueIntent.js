import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.61-assignment-ownership-read";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.61-assignment-ownership-read";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.61-assignment-ownership-read";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.61-assignment-ownership-read";
import { processLoadTeacherReviewQueue } from "../../stages/process/processors.js?v=1.1.61-assignment-ownership-read";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.61-assignment-ownership-read";

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


