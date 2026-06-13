import { validateAuthenticated, validateModuleStatusPayload } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeModuleStatusPayload } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { attachActorContext, attachActorRoleContext, attachUpdatedByContext } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { attachCourseDocument, attachModuleDocument } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processUpdateModuleStatus } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

export function UpdateModuleStatusIntent() {
  return {
    type: "UpdateModuleStatusIntent",
    validate: [validateAuthenticated, validateModuleStatusPayload],
    normalize: [normalizeModuleStatusPayload],
    addContext: [attachActorContext, attachActorRoleContext, attachUpdatedByContext, attachCourseDocument, attachModuleDocument],
    authorize: [requireCourseCreatorAuthorization],
    process: [processUpdateModuleStatus],
    emit: [emitIntentResult]
  };
}
