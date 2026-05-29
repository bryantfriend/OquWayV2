import { validateDemoPayload } from "../../stages/validate/validators.js";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js";
import { attachDemoContext } from "../../stages/addContext/contexts.js";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js";
import { processDemoAction } from "../../stages/process/processors.js";
import { emitDemoResult } from "../../stages/emit/emitters.js";

export function DemoIntent() {
  return {
    type: "DemoIntent",
    validate: [
      validateDemoPayload
    ],
    normalize: [
      normalizeDemoPayload
    ],
    addContext: [
      attachDemoContext
    ],
    authorize: [
      authorizeDemoActor
    ],
    process: [
      processDemoAction
    ],
    emit: [
      emitDemoResult
    ]
  };
}
