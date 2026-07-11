import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-html-rescue";
const TEMPLATE_PATCH = {
  "missionTitle": "HTML Rescue",
  "missionSubtitle": "Scan the page for missing structure.",
  "instructions": "Find each signal in the HTML rescue field.",
  "starterCode": "<html>\n<body>\n<h1>Rescue</h1>",
  "data": "doctype\nhead\nbody\nclosing tag"
};
const TEMPLATE_OPTIONS = {
  "title": "HTML Rescue",
  "archetype": "scanner-grid",
  "eyebrow": "Cyber Mission",
  "accent": "#06b6d4"
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
