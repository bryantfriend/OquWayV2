import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.35-teacher-dashboard";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.35-teacher-dashboard";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.35-teacher-dashboard";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.35-teacher-dashboard";
import { processLoadTeacherClasses } from "../../stages/process/processors.js?v=1.1.35-teacher-dashboard";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function LoadTeacherClassesIntent() {
  return {
    type: "LoadTeacherClassesIntent",
    validate: [validateAuthenticated],
    normalize: [normalizeTeacherDashboardPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachTeacherProfileContext],
    authorize: [requireTeacherDashboardAuthorization],
    process: [processLoadTeacherClasses],
    emit: [emitIntentResult]
  };
}
