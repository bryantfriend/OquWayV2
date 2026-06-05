import { processCreateModule } from "./processCreateModule.js?v=1.1.62-external-task-review-loop";

export async function processCreateModuleFromWizard(executionState) {
  var payload = executionState.payload || {};
  var title = readTitle(payload.title);

  if (!title) {
    return {
      valid: false,
      errors: [
        {
          code: "MODULE_WIZARD_TITLE_REQUIRED",
          message: "Add a module title before generating the module."
        }
      ]
    };
  }

  executionState.payload = Object.assign({}, payload, {
    createdFromWizard: true
  });

  return processCreateModule(executionState);
}

function readTitle(title) {
  if (typeof title === "string") {
    return title.trim();
  }

  if (title && typeof title === "object") {
    return (title.en || title.ru || title.ky || "").trim();
  }

  return "";
}
