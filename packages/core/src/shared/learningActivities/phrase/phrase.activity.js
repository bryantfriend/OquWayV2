import { PhraseStep } from "../../stepTypes/PhraseStep.js?v=1.1.226-learning-activity-files";
import { getPhraseDefaultContent, normalizePhraseConfig, validatePhraseConfig } from "./phrase.schema.js?v=1.1.226-learning-activity-files";

export function createPhraseActivityContext(container, config, callbacks) {
  var normalized = normalizePhraseConfig(config);
  return {
    activityType: "phrase",
    templateId: normalized.templateId || "phrase-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validatePhraseConfig(normalized)
  };
}

export function renderPhraseActivity(container, config, callbacks) {
  var context = createPhraseActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  PhraseStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyPhraseActivity() {
  return null;
}

export function getPhrasePreviewContent() {
  return Object.assign({ templateId: "phrase-standard" }, getPhraseDefaultContent());
}
