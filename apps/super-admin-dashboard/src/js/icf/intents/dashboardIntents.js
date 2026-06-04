import { addAdminContext } from "../../../../../../packages/icf/admin/stages/addContext.js";
import { allowAuthorizedLegacyFlow } from "../../../../../../packages/icf/admin/stages/authorize.js";
import { emitResult } from "../../../../../../packages/icf/admin/stages/emit.js";
import { callService } from "../../../../../../packages/icf/admin/stages/process.js";
import { allowAnyPayload } from "../../../../../../packages/icf/admin/stages/validate.js";

export function registerDashboardIntents(registerIntent) {
  registerIntent({
    type: "LoadDashboardIntent",
    validate: [allowAnyPayload],
    normalize: [],
    addContext: [addAdminContext],
    authorize: [allowAuthorizedLegacyFlow],
    process: [callService(function () { return {}; })],
    emit: [emitResult]
  });
}
