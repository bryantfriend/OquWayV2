import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { getRoadmapDefaultContent, normalizeRoadmapConfig, validateRoadmapConfig } from "./roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";

export function createRoadmapActivityContext(container, config, callbacks) {
  var normalized = normalizeRoadmapConfig(config);
  return {
    activityType: "roadmap",
    templateId: normalized.templateId || "roadmap-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateRoadmapConfig(normalized)
  };
}

export function renderRoadmapActivity(container, config, callbacks) {
  var context = createRoadmapActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  CustomExperienceStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyRoadmapActivity() {
  return null;
}

export function getRoadmapPreviewContent() {
  return Object.assign({ templateId: "roadmap-standard" }, getRoadmapDefaultContent());
}
