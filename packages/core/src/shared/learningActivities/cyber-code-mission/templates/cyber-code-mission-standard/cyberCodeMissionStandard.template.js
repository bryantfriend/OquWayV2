import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-standard";
const TEMPLATE_PATCH = {
  "missionTitle": "Terminal Repair",
  "missionSubtitle": "Run the command that restores the broken page.",
  "instructions": "Inspect the starter code and choose the best fix.",
  "starterCode": "<h1>Welcome</h1>\n<p>Stay curious.</p>",
  "data": "Add missing tag\nCheck indentation\nRun preview"
};
const TEMPLATE_OPTIONS = {
  "title": "Terminal Repair",
  "archetype": "terminal-challenge",
  "eyebrow": "Cyber Mission",
  "accent": "#22c55e"
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
