import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getMultipleChoiceDefaultContent, normalizeMultipleChoiceConfig, validateMultipleChoiceConfig } from "./multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createMultipleChoiceActivityContext(container, config, callbacks) {
  var normalized = normalizeMultipleChoiceConfig(config);
  return {
    activityType: "multiple-choice",
    templateId: normalized.templateId || "multiple-choice-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateMultipleChoiceConfig(normalized)
  };
}

export function renderMultipleChoiceActivity(container, config, callbacks) {
  var context = createMultipleChoiceActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  CustomExperienceStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyMultipleChoiceActivity() {
  return null;
}

export function getMultipleChoicePreviewContent() {
  return Object.assign({ templateId: "multiple-choice-standard" }, getMultipleChoiceDefaultContent());
}
