import { createDefaultStepConfig, normalizeStepType } from "../../../../../shared/stepTypes/stepTypeRegistry.js?v=1.1.222-activity-step-rendering";

export function normalizePracticeModeStep(executionState) {
  var payload = executionState.payload;
  var stepType = readStepType(payload);

  return {
    valid: true,
    data: {
      stepType: stepType,
      stepId: readText(payload.stepId),
      title: normalizeLocalizedText(payload.title, "New Step"),
      instructions: normalizeLocalizedText(payload.instructions, ""),
      config: createDefaultStepConfig(stepType, payload.config),
      status: normalizeStatus(payload.status)
    }
  };
}

function readStepType(payload) {
  var config = payload && payload.config && typeof payload.config === "object" && !Array.isArray(payload.config) ? payload.config : {};
  var stepType = payload && (payload.stepType || payload.stepTypeId || payload.type || payload.activityType || config.type || config.stepType || config.activityType);

  return normalizeStepType(stepType || "");
}

function normalizeLocalizedText(value, fallbackEnglishText) {
  var localizedText = {
    en: fallbackEnglishText,
    ru: "",
    ky: ""
  };

  if (typeof value === "string") {
    localizedText.en = value.trim() || fallbackEnglishText;
    return localizedText;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return localizedText;
  }

  localizedText.en = readText(value.en) || fallbackEnglishText;
  localizedText.ru = readText(value.ru);
  localizedText.ky = readText(value.ky);

  return localizedText;
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStatus(status) {
  if (status === "draft" || status === "ready" || status === "disabled") {
    return status;
  }

  return "draft";
}
