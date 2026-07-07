import { SpeakingPromptStep } from "../../stepTypes/SpeakingPromptStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getSpeakingPromptDefaultContent, normalizeSpeakingPromptConfig, validateSpeakingPromptConfig } from "./speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createSpeakingPromptActivityContext(container, config, callbacks) {
  var normalized = normalizeSpeakingPromptConfig(config);
  return {
    activityType: "speakingPrompt",
    templateId: normalized.templateId || "speakingPrompt-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateSpeakingPromptConfig(normalized)
  };
}

export function renderSpeakingPromptActivity(container, config, callbacks) {
  var context = createSpeakingPromptActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  SpeakingPromptStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroySpeakingPromptActivity() {
  return null;
}

export function getSpeakingPromptPreviewContent() {
  return Object.assign({ templateId: "speakingPrompt-standard" }, getSpeakingPromptDefaultContent());
}
