import { addAdminContext } from "../stages/addContext.js";
import { allowAuthorizedLegacyFlow } from "../stages/authorize.js";
import { emitResult } from "../stages/emit.js";
import { callService } from "../stages/process.js";
import { allowAnyPayload } from "../stages/validate.js";

export function createClassesIntentRegistrar(services) {
  var safeServices = services || {};
  var loadClasses = safeServices.loadClasses || function () { return []; };

  return function registerClassesIntents(registerIntent) {
    registerIntent({
      type: "LoadClassesIntent",
      validate: [allowAnyPayload],
      normalize: [],
      addContext: [addAdminContext],
      authorize: [allowAuthorizedLegacyFlow],
      process: [callService(loadClasses)],
      emit: [emitResult]
    });
  };
}
