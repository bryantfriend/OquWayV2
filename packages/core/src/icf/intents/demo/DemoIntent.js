import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.121-student-dashboard-open-clean";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.121-student-dashboard-open-clean";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.121-student-dashboard-open-clean";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.121-student-dashboard-open-clean";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.121-student-dashboard-open-clean";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.121-student-dashboard-open-clean";

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
