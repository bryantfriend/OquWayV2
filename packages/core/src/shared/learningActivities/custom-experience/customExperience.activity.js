import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";
import { getCustomExperienceDefaultContent, normalizeCustomExperienceConfig, validateCustomExperienceConfig } from "./customExperience.schema.js?v=1.1.226-learning-activity-files";

export function createCustomExperienceActivityContext(container, config, callbacks) {
  var normalized = normalizeCustomExperienceConfig(config);
  return {
    activityType: "customExperience",
    templateId: normalized.templateId || "customExperience-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateCustomExperienceConfig(normalized)
  };
}

export function renderCustomExperienceActivity(container, config, callbacks) {
  var context = createCustomExperienceActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  CustomExperienceStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyCustomExperienceActivity() {
  return null;
}

export function getCustomExperiencePreviewContent() {
  return Object.assign({ templateId: "customExperience-standard" }, getCustomExperienceDefaultContent());
}
