import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.226-learning-activity-files";
import { getDragMatchIslandDefaultContent, normalizeDragMatchIslandConfig, validateDragMatchIslandConfig } from "./dragMatchIsland.schema.js?v=1.1.226-learning-activity-files";

export function createDragMatchIslandActivityContext(container, config, callbacks) {
  var normalized = normalizeDragMatchIslandConfig(config);
  return {
    activityType: "dragMatchIsland",
    templateId: normalized.templateId || "dragMatchIsland-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateDragMatchIslandConfig(normalized)
  };
}

export function renderDragMatchIslandActivity(container, config, callbacks) {
  var context = createDragMatchIslandActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  DragMatchIslandStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyDragMatchIslandActivity() {
  return null;
}

export function getDragMatchIslandPreviewContent() {
  return Object.assign({ templateId: "dragMatchIsland-standard" }, getDragMatchIslandDefaultContent());
}
