import { getCyberCodeMissionDefaultContent } from "../../cyberCodeMission.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "cyberCodeMission-html-rescue";
const TEMPLATE_PATCH = {
  missionTitle: "HTML Rescue",
  missionSubtitle: "Rescue the page structure.",
  instructions: "Study the markup and choose the strongest repair.",
  starterCode: "<section>\n  <h2>Safety</h2>\n  <p>Protect your password.</p>\n</section>",
  successMessage: "Page rescued.",
  theme: "html"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Cyber Code Mission",
  title: "HTML Rescue",
  layout: "story-path",
  interaction: "terminal",
  accent: "#f59e0b",
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
