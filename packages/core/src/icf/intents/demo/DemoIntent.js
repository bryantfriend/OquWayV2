import { validateDemoPayload } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeDemoPayload } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { attachDemoContext } from "../../stages/addContext/contexts.js?v=1.1.120-student-course-debug-summary";
import { authorizeDemoActor } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processDemoAction } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitDemoResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

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
