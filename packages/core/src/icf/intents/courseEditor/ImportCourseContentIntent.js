import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.231-platform-performance-release";
import { normalizeCourseId } from "../../stages/normalize/normalizers.js?v=1.1.231-platform-performance-release";
import { attachActorContext, attachActorRoleContext, attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.231-platform-performance-release";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.231-platform-performance-release";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.231-platform-performance-release";
import { normalizeCourseImportDefinition } from "../../../shared/courseImport/courseImport.js?v=1.1.231-platform-performance-release";
import { processImportCourseContent } from "../../stages/process/domain/courseEditor/processImportCourseContent.js?v=1.1.231-platform-performance-release";

export function ImportCourseContentIntent() {
  return {
    type: "ImportCourseContentIntent",
    validate: [validateAuthenticated, validateCourseId, validateImportDefinition],
    normalize: [normalizeCourseId],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocument, attachModulesCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processImportCourseContent],
    emit: [emitIntentResult]
  };
}

function validateImportDefinition(executionState) {
  var payload = executionState.payload || {};
  var normalized = normalizeCourseImportDefinition(payload.importData);

  if (!normalized.valid) {
    return {
      valid: false,
      errors: normalized.errors
    };
  }

  executionState.payload = Object.assign({}, payload, {
    importData: normalized.data,
    applyCourseMetadata: payload.applyCourseMetadata !== false
  });

  return { valid: true };
}
