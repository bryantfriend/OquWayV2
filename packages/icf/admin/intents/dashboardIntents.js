import { addAdminContext } from "../stages/addContext.js";
import { allowAuthorizedLegacyFlow } from "../stages/authorize.js";
import { emitResult } from "../stages/emit.js";
import { callService } from "../stages/process.js";
import { allowAnyPayload } from "../stages/validate.js";

export function createDashboardIntentRegistrar(services) {
  var safeServices = services || {};
  var loadDashboard = safeServices.loadDashboard || function () { return {}; };

  return function registerDashboardIntents(registerIntent) {
    registerIntent({
      type: "LoadDashboardIntent",
      validate: [allowAnyPayload],
      normalize: [],
      addContext: [addAdminContext],
      authorize: [allowAuthorizedLegacyFlow],
      process: [callService(loadDashboard)],
      emit: [emitResult]
    });
  };
}
