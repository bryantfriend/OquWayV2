import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-debug-brief";
const TEMPLATE_PATCH = {
  missionTitle: "Debug Brief",
  missionSubtitle: "Find the suspicious line.",
  instructions: "Read the code and explain the likely bug.",
  starterCode: "if (score > 80) {\n  badge = \"Expert\";\n}",
  successMessage: "Bug documented.",
  theme: "debug"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Cyber Code Mission",
  title: "Debug Brief",
  layout: "field-lab",
  interaction: "terminal",
  accent: "#22c55e",
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
