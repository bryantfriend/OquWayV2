import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.119-student-dashboard-debug-safe";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.119-student-dashboard-debug-safe";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.119-student-dashboard-debug-safe";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.119-student-dashboard-debug-safe";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.119-student-dashboard-debug-safe";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.119-student-dashboard-debug-safe";

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
