import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";

export const roadmapSchema = CustomExperienceStep.editorSchema || { fields: [] };

export function getRoadmapDefaultContent() {
  return {
    "experienceType": "roadmap",
    "title": "Learning Roadmap",
    "theme": "pathway",
    "instructions": "Review the checkpoints before you continue.",
    "data": "{\"checkpoints\":[\"Start\",\"Practice\",\"Apply\"]}"
  };
}

export function normalizeRoadmapConfig(config) {
  return CustomExperienceStep.createConfig(Object.assign({}, getRoadmapDefaultContent(), config || {}));
}

export function validateRoadmapConfig(config) {
  var normalized = normalizeRoadmapConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
