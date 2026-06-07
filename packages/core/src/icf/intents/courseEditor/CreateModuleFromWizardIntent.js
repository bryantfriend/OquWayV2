import { validateAuthenticated, validateCourseId } from "../../stages/validate/validators.js?v=1.1.110-student-class-alias-query";
import { normalizeCourseId, normalizeModuleShell } from "../../stages/normalize/normalizers.js?v=1.1.110-student-class-alias-query";
import { attachActorContext, attachActorRoleContext, attachCourseDocument, attachModulesCollection } from "../../stages/addContext/contexts.js?v=1.1.110-student-class-alias-query";
import { requireCourseCreatorAuthorization } from "../../stages/authorize/authorizers.js?v=1.1.110-student-class-alias-query";
import { processCreateModuleFromWizard } from "../../stages/process/processors.js?v=1.1.110-student-class-alias-query";
import { emitIntentResult } from "../../stages/emit/emitters.js?v=1.1.110-student-class-alias-query";

export function CreateModuleFromWizardIntent() {
  return {
    type: "CreateModuleFromWizardIntent",
    validate: [validateAuthenticated, validateCourseId, validateModuleWizardTitle],
    normalize: [normalizeCourseId, normalizeModuleShell],
    addContext: [attachActorContext, attachActorRoleContext, attachCourseDocument, attachModulesCollection],
    authorize: [requireCourseCreatorAuthorization],
    process: [processCreateModuleFromWizard],
    emit: [emitIntentResult]
  };
}

function validateModuleWizardTitle(executionState) {
  var payload = executionState.payload || {};
  var title = payload.title;
  var titleText = "";

  if (typeof title === "string") {
    titleText = title.trim();
  } else if (title && typeof title === "object") {
    titleText = (title.en || title.ru || title.ky || "").trim();
  }

  if (!titleText) {
    return {
      valid: false,
      errors: [
        {
          code: "MODULE_WIZARD_TITLE_REQUIRED",
          message: "Module title is required."
        }
      ]
    };
  }

  return { valid: true };
}
