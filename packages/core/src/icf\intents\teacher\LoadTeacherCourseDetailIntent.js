import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.81-class-command-center";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.81-class-command-center";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.81-class-command-center";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.81-class-command-center";
import { processLoadTeacherCourseDetail } from "../../stages/process/processors.js?v=1.1.81-class-command-center";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.81-class-command-center";

export function LoadTeacherCourseDetailIntent() {
  return {
    type: "LoadTeacherCourseDetailIntent",
    validate: [validateAuthenticated, validateTeacherReviewQueuePayload],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherCourseDetail],
    emit: [emitIntentResult]
  };
}
