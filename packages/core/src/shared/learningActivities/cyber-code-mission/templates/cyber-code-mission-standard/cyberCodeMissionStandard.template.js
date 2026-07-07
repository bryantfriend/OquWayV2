import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-standard";
const TEMPLATE_PATCH = {
  missionTitle: "Terminal Repair",
  missionSubtitle: "Fix the broken signal.",
  instructions: "Inspect the starter code and decide what should change.",
  starterCode: "<h1>Signal online</h1>",
  successMessage: "Signal restored.",
  theme: "neon"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Cyber Code Mission",
  title: "Terminal Repair",
  layout: "terminal-run",
  interaction: "terminal",
  accent: "#38bdf8",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getCyberCodeMissionDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
