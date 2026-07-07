import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getSortingDefaultContent, normalizeSortingConfig, validateSortingConfig } from "./sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createSortingActivityContext(container, config, callbacks) {
  var normalized = normalizeSortingConfig(config);
  return {
    activityType: "sorting",
    templateId: normalized.templateId || "sorting-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateSortingConfig(normalized)
  };
}

export function renderSortingActivity(container, config, callbacks) {
  var context = createSortingActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  DragMatchIslandStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroySortingActivity() {
  return null;
}

export function getSortingPreviewContent() {
  return Object.assign({ templateId: "sorting-standard" }, getSortingDefaultContent());
}
