import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.128-teacher-query-fallbacks";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.128-teacher-query-fallbacks";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.128-teacher-query-fallbacks";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.128-teacher-query-fallbacks";
import { processLoadTeacherCourses } from "../../stages/process/processors.js?v=1.1.128-teacher-query-fallbacks";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.128-teacher-query-fallbacks";

export function LoadTeacherCoursesIntent() {
  return {
    type: "LoadTeacherCoursesIntent",
    validate: [validateAuthenticated, validateTeacherReviewQueuePayload],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherCourses],
    emit: [emitIntentResult]
  };
}
