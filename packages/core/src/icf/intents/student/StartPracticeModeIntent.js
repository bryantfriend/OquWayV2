import { validateAuthenticated, validatePracticeModeKey } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { validateStudentProgressPayload } from "../../stages/validate/validators.js?v=1.1.29-module-render-fix";
import { normalizeStudentProgressPayload } from "../../stages/normalize/normalizers.js?v=1.1.29-module-render-fix";
import { attachActorContext, attachActorRoleContext, attachStudentSessionContext } from "../../stages/addContext/contexts.js?v=1.1.29-module-render-fix";
import { requireStudentAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.29-module-render-fix";
import { processStartPracticeMode } from "../../stages/process/processors.js?v=1.1.29-module-render-fix";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.29-module-render-fix";

export function StartPracticeModeIntent() {
  return {
    type: "StartPracticeModeIntent",
    validate: [
      validateAuthenticated,
      validateStudentProgressPayload,
      validatePracticeModeKey
    ],
    normalize: [
      normalizeStudentProgressPayload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext,
      attachStudentSessionContext
    ],
    authorize: [
      requireStudentAuthorization
    ],
    process: [
      processStartPracticeMode
    ],
    emit: [
      emitIntentResult
    ]
  };
}
