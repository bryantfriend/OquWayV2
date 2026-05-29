export function normalizeModuleShell(executionState) {
  const payload = readPayload(executionState);

  return {
    valid: true,
    data: {
      title: normalizeLocalizedText(payload.title, "New Module"),
      description: normalizeLocalizedText(payload.description, ""),
      status: normalizeStatus(payload.status)
    }
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
