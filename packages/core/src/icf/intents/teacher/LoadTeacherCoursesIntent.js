import { validateAuthenticated, validateTeacherReviewQueuePayload } from "../../stages/validate/validators.js?v=1.1.62-external-task-review-loop";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.62-external-task-review-loop";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.62-external-task-review-loop";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.62-external-task-review-loop";
import { processLoadTeacherCourses } from "../../stages/process/processors.js?v=1.1.62-external-task-review-loop";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.62-external-task-review-loop";

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
