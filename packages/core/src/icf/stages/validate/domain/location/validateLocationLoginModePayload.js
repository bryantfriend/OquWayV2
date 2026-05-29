export function validateLocationId(executionState) {
  var payload = executionState.payload || {};

  if (!isNonEmptyText(payload.locationId)) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_ID_REQUIRED",
          message: "A locationId is required."
        }
      ]
    };
  }

  return { valid: true };
}

export function validateLocationLoginModePayload(executionState) {
  var payload = executionState.payload || {};
  var loginMode = readText(payload.loginMode);

  if (!isValidLoginMode(loginMode)) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_LOGIN_MODE_INVALID",
          message: "Location loginMode must be fruit, standard, or hybrid."
        }
      ]
    };
  }

  return { valid: true };
}

export function validateLocationLoginSlugPayload(executionState) {
  var payload = executionState.payload || {};
  var loginSlug = normalizeLoginSlugForValidation(payload.loginSlug);

  if (!isValidLoginSlug(loginSlug)) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_LOGIN_SLUG_INVALID",
          message: "Location loginSlug must use lowercase letters, numbers, and hyphens only."
        }
      ]
    };
  }

  if (isReservedLoginSlug(loginSlug)) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_LOGIN_SLUG_RESERVED",
          message: "That loginSlug is reserved. Please choose another one."
        }
      ]
    };
  }

  return { valid: true };
}

export function validateResolveLocationSlugPayload(executionState) {
  var payload = executionState.payload || {};
  var loginSlug = normalizeLoginSlugForValidation(payload.loginSlug);

  if (!isValidLoginSlug(loginSlug)) {
    return {
      valid: false,
      errors: [
        {
          code: "LOCATION_LOGIN_SLUG_REQUIRED",
          message: "A valid location login link is required."
        }
      ]
    };
  }

  return { valid: true };
}

function isNonEmptyText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidLoginMode(value) {
  return value === "fruit" || value === "standard" || value === "hybrid";
}

function isValidLoginSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function normalizeLoginSlugForValidation(value) {
  var text = readText(value).toLowerCase();

  text = text.replace(/[^a-z0-9]+/g, "-");
  text = text.replace(/^-+/, "");
  text = text.replace(/-+$/, "");

  return text;
}

function isReservedLoginSlug(value) {
  var reservedSlugs = [
    "admin",
    "login",
    "student",
    "dashboard",
    "editor",
    "api",
    "course",
    "courses",
    "assets"
  ];

  return reservedSlugs.indexOf(value) !== -1;
}
