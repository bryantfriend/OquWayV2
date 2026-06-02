import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

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
