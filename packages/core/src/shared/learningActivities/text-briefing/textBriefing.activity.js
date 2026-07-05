import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.226-learning-activity-files";
import { getTextBriefingDefaultContent, normalizeTextBriefingConfig, validateTextBriefingConfig } from "./textBriefing.schema.js?v=1.1.226-learning-activity-files";

export function createTextBriefingActivityContext(container, config, callbacks) {
  var normalized = normalizeTextBriefingConfig(config);
  return {
    activityType: "textBriefing",
    templateId: normalized.templateId || "textBriefing-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateTextBriefingConfig(normalized)
  };
}

export function renderTextBriefingActivity(container, config, callbacks) {
  var context = createTextBriefingActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  TextBriefingStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyTextBriefingActivity() {
  return null;
}

export function getTextBriefingPreviewContent() {
  return Object.assign({ templateId: "textBriefing-standard" }, getTextBriefingDefaultContent());
}
