import { validateAuthenticated, validateCourseId, validateStepMediaFile } from "../../stages/validate/validators.js?v=1.1.82-shared-command-center-shell";
import { normalizeCourseId, normalizeStepMediaUpload } from "../../stages/normalize/normalizers.js?v=1.1.82-shared-command-center-shell";
import { attachActorContext, attachActorRoleContext } from "../../stages/addContext/contexts.js?v=1.1.82-shared-command-center-shell";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.82-shared-command-center-shell";
import { processUploadCourseIcon } from "../../stages/process/processors.js?v=1.1.82-shared-command-center-shell";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.82-shared-command-center-shell";

export function UploadCourseIconIntent() {
  return {
    type: "UploadCourseIconIntent",
    validate: [
      validateAuthenticated,
      validateCourseId,
      validateStepMediaFile
    ],
    normalize: [
      normalizeCourseId,
      normalizeStepMediaUpload
    ],
    addContext: [
      attachActorContext,
      attachActorRoleContext
    ],
    authorize: [
      requireCourseCreatorAuthorization
    ],
    process: [
      processUploadCourseIcon
    ],
    emit: [
      emitIntentResult
    ]
  };
}