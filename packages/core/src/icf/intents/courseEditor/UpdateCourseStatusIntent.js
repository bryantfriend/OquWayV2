import { validateAuthenticated, validateCourseStatusPayload } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeCourseStatusPayload } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { attachActorContext, attachActorRoleContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { attachCourseDocument } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processUpdateCourseStatus } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

export function UpdateCourseStatusIntent() {
  return {
    type: "UpdateCourseStatusIntent",
    validate: [validateAuthenticated, validateCourseStatusPayload],
    normalize: [normalizeCourseStatusPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachUpdatedByContext, attachCourseDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processUpdateCourseStatus],
    emit: [emitIntentResult]
  };
}
