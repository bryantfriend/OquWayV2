export function normalizeModuleShell(executionState) {
  const payload = readPayload(executionState);
  const moduleData = {
    title: normalizeLocalizedText(payload.title, "New Module"),
    description: normalizeLocalizedText(payload.description, ""),
    status: normalizeStatus(payload.status),
    templateKey: normalizeTemplateKey(payload.templateKey)
  };

  appendOptionalModuleVisualFields(moduleData, payload);

  return {
    valid: true,
    data: moduleData
  };
}

function readPayload(executionState) {
  if (!executionState) {
    return {};
  }

  if (!executionState.payload) {
    return {};
  }

  return executionState.payload;
}

function normalizeLocalizedText(value, fallbackEnglishText) {
  const localizedText = {
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

  localizedText.en = readText(value.en, fallbackEnglishText);
  localizedText.ru = readText(value.ru, "");
  localizedText.ky = readText(value.ky, "");

  return localizedText;
}

function readText(value, fallbackText) {
  if (typeof value !== "string") {
    return fallbackText;
  }

  return value.trim();
}

function normalizeStatus(status) {
  if (status === "published" || status === "archived") {
    return status;
  }

  return "draft";
}

function normalizeTemplateKey(templateKey) {
  if (templateKey === "school" || templateKey === "educationCenter" || templateKey === "intensive" || templateKey === "custom") {
    return templateKey;
  }

  return "custom";
}

function appendOptionalModuleVisualFields(moduleData, payload) {
  if ("iconUrl" in payload) {
    moduleData.iconUrl = normalizeTextValue(payload.iconUrl);
  }

  if ("pathType" in payload) {
    moduleData.pathType = normalizePathType(payload.pathType);
  }

  if ("pathGroup" in payload) {
    moduleData.pathGroup = normalizeTextValue(payload.pathGroup);
  }

  if ("pathOrder" in payload) {
    moduleData.pathOrder = normalizeOptionalNumber(payload.pathOrder);
  }

  if ("parentModuleId" in payload) {
    moduleData.parentModuleId = normalizeTextValue(payload.parentModuleId);
  }
}

function normalizeTextValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizePathType(pathType) {
  if (pathType === "bonus" || pathType === "extra") {
    return pathType;
  }

  return "main";
}

function normalizeOptionalNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return null;
}
