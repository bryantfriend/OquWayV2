import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.228-learning-activity-drag-interactions";

export const introCardSchema = TextBriefingStep.editorSchema || { fields: [] };

export function getIntroCardDefaultContent() {
  return {
    "heading": "Lesson Introduction",
    "bodyText": "Start here to understand the main idea.",
    "calloutText": "Look for the one concept you should remember."
  };
}

export function normalizeIntroCardConfig(config) {
  return TextBriefingStep.createConfig(Object.assign({}, getIntroCardDefaultContent(), config || {}));
}

export function validateIntroCardConfig(config) {
  var normalized = normalizeIntroCardConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
