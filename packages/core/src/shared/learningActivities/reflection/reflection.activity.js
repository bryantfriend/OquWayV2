import { ReflectionStep } from "../../stepTypes/ReflectionStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getReflectionDefaultContent, normalizeReflectionConfig, validateReflectionConfig } from "./reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createReflectionActivityContext(container, config, callbacks) {
  var normalized = normalizeReflectionConfig(config);
  return {
    activityType: "reflection",
    templateId: normalized.templateId || "reflection-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateReflectionConfig(normalized)
  };
}

export function renderReflectionActivity(container, config, callbacks) {
  var context = createReflectionActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  ReflectionStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyReflectionActivity() {
  return null;
}

export function getReflectionPreviewContent() {
  return Object.assign({ templateId: "reflection-standard" }, getReflectionDefaultContent());
}
