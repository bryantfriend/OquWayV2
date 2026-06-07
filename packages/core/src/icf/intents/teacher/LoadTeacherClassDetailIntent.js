import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processLoadTeacherClassDetail } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

export function LoadTeacherClassDetailIntent() {
  return {
    type: "LoadTeacherClassDetailIntent",
    validate: [validateAuthenticated, validateTeacherReviewQueuePayload],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherClassDetail],
    emit: [emitIntentResult]
  };
}
