import { CyberCodeMissionStep } from "../../stepTypes/CyberCodeMissionStep.js?v=1.1.226-learning-activity-files";
import { getCyberCodeMissionDefaultContent, normalizeCyberCodeMissionConfig, validateCyberCodeMissionConfig } from "./cyberCodeMission.schema.js?v=1.1.226-learning-activity-files";

export function createCyberCodeMissionActivityContext(container, config, callbacks) {
  var normalized = normalizeCyberCodeMissionConfig(config);
  return {
    activityType: "cyberCodeMission",
    templateId: normalized.templateId || "cyberCodeMission-standard",
    container: container,
    content: normalized,
    callbacks: callbacks && typeof callbacks === "object" ? callbacks : {},
    validation: validateCyberCodeMissionConfig(normalized)
  };
}

export function renderCyberCodeMissionActivity(container, config, callbacks) {
  var context = createCyberCodeMissionActivityContext(container, config, callbacks);

  if (!container) {
    return context;
  }

  CyberCodeMissionStep.renderPlayer(container, context.content, callbacks);
  return context;
}

export function destroyCyberCodeMissionActivity() {
  return null;
}

export function getCyberCodeMissionPreviewContent() {
  return Object.assign({ templateId: "cyberCodeMission-standard" }, getCyberCodeMissionDefaultContent());
}
