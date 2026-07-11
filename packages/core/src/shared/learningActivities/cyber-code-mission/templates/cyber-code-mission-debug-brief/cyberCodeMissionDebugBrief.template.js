import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-debug-brief";
const TEMPLATE_PATCH = {
  "missionTitle": "Debug Brief",
  "missionSubtitle": "Open bug clues before choosing a fix.",
  "instructions": "Inspect every clue in the case file.",
  "starterCode": "const score = 10\nconsole.log(scroe)",
  "data": "Typo in variable\nMissing semicolon\nConsole clue"
};
const TEMPLATE_OPTIONS = {
  "title": "Debug Brief",
  "archetype": "evidence-board",
  "eyebrow": "Cyber Mission",
  "accent": "#f59e0b"
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
