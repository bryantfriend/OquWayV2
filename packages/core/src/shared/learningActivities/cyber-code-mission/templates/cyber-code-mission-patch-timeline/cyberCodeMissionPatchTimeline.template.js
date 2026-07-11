import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-patch-timeline";
const TEMPLATE_PATCH = {
  "missionTitle": "Patch Timeline",
  "missionSubtitle": "Unlock the repair sequence in order.",
  "instructions": "Move through each patch step.",
  "starterCode": "// patch plan",
  "data": "Find bug\nEdit code\nRun test\nExplain fix"
};
const TEMPLATE_OPTIONS = {
  "title": "Patch Timeline",
  "archetype": "timeline-unlock",
  "eyebrow": "Cyber Mission",
  "accent": "#7c3aed"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getCyberCodeMissionDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
