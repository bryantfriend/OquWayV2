import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getIntroCardDefaultContent, normalizeIntroCardConfig, validateIntroCardConfig } from "./introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createIntroCardActivityContext(container, config, callbacks) {
  var normalized = normalizeIntroCardConfig(config);
  return {
    activityType: "intro-card",
    templateId: normalized.templateId || "intro-card-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateIntroCardConfig(normalized)
  };
}

export function renderIntroCardActivity(container, config, callbacks) {
  var context = createIntroCardActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  TextBriefingStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyIntroCardActivity() {
  return null;
}

export function getIntroCardPreviewContent() {
  return Object.assign({ templateId: "intro-card-standard" }, getIntroCardDefaultContent());
}
