import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.54-multi-role-assistant";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.54-multi-role-assistant";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.54-multi-role-assistant";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.54-multi-role-assistant";
import { processLoadTeacherDashboard } from "../../stages/process/processors.js?v=1.1.54-multi-role-assistant";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.54-multi-role-assistant";

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


