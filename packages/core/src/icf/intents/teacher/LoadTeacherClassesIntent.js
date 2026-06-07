import { validateAuthenticated } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeTeacherDashboardPayload } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachTeacherProfileContext } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireTeacherDashboardAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processLoadTeacherClasses } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

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


