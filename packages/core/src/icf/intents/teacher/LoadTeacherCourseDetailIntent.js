import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.179-teacher-analytics-dashboard";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.194-lesson-monitor";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.179-teacher-analytics-dashboard";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.179-teacher-analytics-dashboard";
import { processLoadTeacherCourseDetail } from "../../stages/process/processors.js?v=1.1.194-lesson-monitor";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.179-teacher-analytics-dashboard";

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
