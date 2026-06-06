import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.79-user-command-center";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.79-user-command-center";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.79-user-command-center";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.79-user-command-center";
import { processLoadTeacherDashboard } from "../../stages/process/processors.js?v=1.1.79-user-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.79-user-command-center";

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


