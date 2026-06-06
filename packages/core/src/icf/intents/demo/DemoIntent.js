import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.107-student-firebase-auth-chain";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.107-student-firebase-auth-chain";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.107-student-firebase-auth-chain";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.107-student-firebase-auth-chain";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.107-student-firebase-auth-chain";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.107-student-firebase-auth-chain";

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
