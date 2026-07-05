import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.226-learning-activity-files";

export const textBriefingSchema = TextBriefingStep.editorSchema || { fields: [] };

export function getTextBriefingDefaultContent() {
  return {
    "heading": "Digital Safety Briefing",
    "bodyText": "Read the key idea, then continue when you are ready.",
    "calloutText": "Pause and look for the one idea you can use today."
  };
}

export function normalizeTextBriefingConfig(config) {
  return TextBriefingStep.createConfig(Object.assign({}, getTextBriefingDefaultContent(), config || {}));
}

export function validateTextBriefingConfig(config) {
  var normalized = normalizeTextBriefingConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
