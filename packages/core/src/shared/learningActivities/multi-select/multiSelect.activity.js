import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getMultiSelectDefaultContent, normalizeMultiSelectConfig, validateMultiSelectConfig } from "./multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createMultiSelectActivityContext(container, config, callbacks) {
  var normalized = normalizeMultiSelectConfig(config);
  return {
    activityType: "multi-select",
    templateId: normalized.templateId || "multi-select-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateMultiSelectConfig(normalized)
  };
}

export function renderMultiSelectActivity(container, config, callbacks) {
  var context = createMultiSelectActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  CustomExperienceStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyMultiSelectActivity() {
  return null;
}

export function getMultiSelectPreviewContent() {
  return Object.assign({ templateId: "multi-select-standard" }, getMultiSelectDefaultContent());
}
