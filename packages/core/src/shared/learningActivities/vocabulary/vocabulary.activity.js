import { VocabularyStep } from "../../stepTypes/VocabularyStep.js?v=1.1.226-learning-activity-files";
import { getVocabularyDefaultContent, normalizeVocabularyConfig, validateVocabularyConfig } from "./vocabulary.schema.js?v=1.1.226-learning-activity-files";

export function createVocabularyActivityContext(container, config, callbacks) {
  var normalized = normalizeVocabularyConfig(config);
  return {
    activityType: "vocabulary",
    templateId: normalized.templateId || "vocabulary-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateVocabularyConfig(normalized)
  };
}

export function renderVocabularyActivity(container, config, callbacks) {
  var context = createVocabularyActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  VocabularyStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyVocabularyActivity() {
  return null;
}

export function getVocabularyPreviewContent() {
  return Object.assign({ templateId: "vocabulary-standard" }, getVocabularyDefaultContent());
}
