export function normalizeLocationLoginModePayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    loginMode: normalizeLoginMode(payload.loginMode)
  };
}

export function normalizeLocationLoginSlugPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    loginSlug: normalizeLoginSlug(payload.loginSlug)
  };
}

export function normalizeResolveLocationSlugPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    loginSlug: normalizeLoginSlug(payload.loginSlug)
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeLoginMode(value) {
  var loginMode = normalizeText(value);

  if (loginMode === "standard" || loginMode === "hybrid") {
    return loginMode;
  }

  return "fruit";
}

function normalizeLoginSlug(value) {
  var text = normalizeText(value).toLowerCase();

  text = text.replace(/[^a-z0-9]+/g, "-");
  text = text.replace(/^-+/, "");
  text = text.replace(/-+$/, "");

  return text;
}
