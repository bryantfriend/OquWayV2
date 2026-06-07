import { validateResolveLocationSlugPayload } from "../../stages/validate/validators.js?v=1.1.120-student-course-debug-summary";
import { normalizeResolveLocationSlugPayload } from "../../stages/normalize/normalizers.js?v=1.1.120-student-course-debug-summary";
import { allowPublicLocationRead } from "../../stages/authorize/authorizers.js?v=1.1.120-student-course-debug-summary";
import { processResolveLocationBySlug } from "../../stages/process/processors.js?v=1.1.120-student-course-debug-summary";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.120-student-course-debug-summary";

export function ResolveLocationBySlugIntent() {
  return {
    type: "ResolveLocationBySlugIntent",
    validate: [
      validateResolveLocationSlugPayload
    ],
    normalize: [
      normalizeResolveLocationSlugPayload
    ],
    addContext: [],
    authorize: [
      allowPublicLocationRead
    ],
    process: [
      processResolveLocationBySlug
    ],
    emit: [
      emitIntentResult
    ]
  };
}
