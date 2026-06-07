import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.116-student-token-ready";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.116-student-token-ready";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.116-student-token-ready";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.116-student-token-ready";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.116-student-token-ready";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.116-student-token-ready";

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
