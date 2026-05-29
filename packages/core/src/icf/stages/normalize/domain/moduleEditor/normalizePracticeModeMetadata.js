export function normalizePracticeModeMetadata(executionState) {
  var payload = executionState.payload;

  return {
    valid: true,
    data: {
      practiceModeKey: payload.practiceModeKey,
      title: normalizeLocalizedTitle(payload.title),
      purpose: readPurpose(payload.purpose),
      enabled: readEnabled(payload.enabled),
      status: readStatus(payload.status)
    }
  };
}

function normalizeLocalizedTitle(title) {
  var localizedTitle = {
    en: "",
    ru: "",
    ky: ""
  };

  if (typeof title === "string") {
    localizedTitle.en = title.trim();
    return localizedTitle;
  }

  if (!title || typeof title !== "object" || Array.isArray(title)) {
    return localizedTitle;
  }

  localizedTitle.en = readText(title.en);
  localizedTitle.ru = readText(title.ru);
  localizedTitle.ky = readText(title.ky);

  return localizedTitle;
}

function readPurpose(purpose) {
  if (typeof purpose !== "string") {
    return "";
  }

  return purpose.trim();
}

function readEnabled(enabled) {
  return enabled === true;
}

function readStatus(status) {
  if (status === "shell" || status === "draft" || status === "ready" || status === "disabled") {
    return status;
  }

  return "shell";
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
