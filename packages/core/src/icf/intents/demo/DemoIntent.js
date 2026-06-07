import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.118-fruit-login-student-identity";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.118-fruit-login-student-identity";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.118-fruit-login-student-identity";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.118-fruit-login-student-identity";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.118-fruit-login-student-identity";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.118-fruit-login-student-identity";

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
