import { ExternalTaskStep } from "../../stepTypes/ExternalTaskStep.js?v=1.1.226-learning-activity-files";
import { getExternalTaskDefaultContent, normalizeExternalTaskConfig, validateExternalTaskConfig } from "./externalTask.schema.js?v=1.1.226-learning-activity-files";

export function createExternalTaskActivityContext(container, config, callbacks) {
  var normalized = normalizeExternalTaskConfig(config);
  return {
    activityType: "externalTask",
    templateId: normalized.templateId || "externalTask-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateExternalTaskConfig(normalized)
  };
}

export function renderExternalTaskActivity(container, config, callbacks) {
  var context = createExternalTaskActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  ExternalTaskStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyExternalTaskActivity() {
  return null;
}

export function getExternalTaskPreviewContent() {
  return Object.assign({ templateId: "externalTask-standard" }, getExternalTaskDefaultContent());
}
