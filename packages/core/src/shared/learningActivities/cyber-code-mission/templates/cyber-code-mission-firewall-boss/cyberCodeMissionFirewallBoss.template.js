import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-firewall-boss";
const TEMPLATE_PATCH = {
  "missionTitle": "Firewall Boss",
  "missionSubtitle": "Choose fixes to defeat the firewall error.",
  "instructions": "Each good debugging move lowers the challenge meter.",
  "starterCode": "if password = safe:\n  unlock()",
  "data": "Use comparison\nCheck syntax\nRead error\nTest again"
};
const TEMPLATE_OPTIONS = {
  "title": "Firewall Boss",
  "archetype": "boss-battle",
  "eyebrow": "Cyber Mission",
  "accent": "#dc2626",
  "bossName": "Firewall Error"
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
