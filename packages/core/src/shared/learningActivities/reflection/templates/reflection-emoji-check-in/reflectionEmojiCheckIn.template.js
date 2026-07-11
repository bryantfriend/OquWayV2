import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { mergeTemplateContent } from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-emoji-check-in";
const TEMPLATE_PATCH = {
  question: "Choose an emoji that shows how you feel about today's skill, then explain why.",
  responseType: "emoji",
  minWords: 3
};

export function renderTemplate() {
  return null;
}

export function destroyTemplate() {
  return null;
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getReflectionDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
