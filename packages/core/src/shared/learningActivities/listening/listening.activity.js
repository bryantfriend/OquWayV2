import { ListeningStep } from "../../stepTypes/ListeningStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getListeningDefaultContent, normalizeListeningConfig, validateListeningConfig } from "./listening.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createListeningActivityContext(container, config, callbacks) {
  var normalized = normalizeListeningConfig(config);
  return {
    activityType: "listening",
    templateId: normalized.templateId || "listening-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateListeningConfig(normalized)
  };
}

export function renderListeningActivity(container, config, callbacks) {
  var context = createListeningActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  ListeningStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyListeningActivity() {
  return null;
}

export function getListeningPreviewContent() {
  return Object.assign({ templateId: "listening-standard" }, getListeningDefaultContent());
}
