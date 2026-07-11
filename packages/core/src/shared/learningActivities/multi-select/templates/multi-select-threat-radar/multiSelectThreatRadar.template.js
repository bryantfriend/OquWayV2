import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-threat-radar";
const TEMPLATE_PATCH = {
  "experienceType": "multi-select",
  "title": "Threat Radar",
  "theme": "radar",
  "instructions": "Choose defensive moves to lower the risk meter.",
  "data": "Use 2FA\nOpen unknown attachment\nUpdate software\nTell password"
};
const TEMPLATE_OPTIONS = {
  "title": "Threat Radar",
  "archetype": "boss-battle",
  "eyebrow": "Multi Select",
  "accent": "#dc2626",
  "bossName": "Risk Meter"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getMultiSelectDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
