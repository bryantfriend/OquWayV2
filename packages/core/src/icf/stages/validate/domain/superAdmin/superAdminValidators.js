export function validateLocationPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.name)) {
    errors.push({ code: "LOCATION_NAME_REQUIRED", message: "Location name is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived"]);
  validateEnum(errors, "loginMode", payload.loginMode, ["fruit", "standard", "hybrid"]);
  validateLoginSlug(errors, payload.loginSlug);
  validateOptionalUrl(errors, "photoUrl", payload.photoUrl || payload.imageUrl);
  validateOptionalUrl(errors, "iconUrl", payload.iconUrl);
  validateOptionalUrl(errors, "website", payload.website);
  validateOptionalUrl(errors, "twoGisUrl", payload.twoGisUrl);
  validateOptionalUrl(errors, "socialLinks.instagram", payload.socialLinks && payload.socialLinks.instagram);
  validateOptionalUrl(errors, "socialLinks.facebook", payload.socialLinks && payload.socialLinks.facebook);
  validateOptionalUrl(errors, "socialLinks.telegram", payload.socialLinks && payload.socialLinks.telegram);
  validateOptionalUrl(errors, "socialLinks.whatsapp", payload.socialLinks && payload.socialLinks.whatsapp);
  validateOptionalUrl(errors, "socialLinks.youtube", payload.socialLinks && payload.socialLinks.youtube);
  validateOptionalEmail(errors, payload.email);
  validateOptionalNumber(errors, "latitude", payload.latitude);
  validateOptionalNumber(errors, "longitude", payload.longitude);
  validateOptionalNumber(errors, "subscription.maxStudents", payload.subscription && payload.subscription.maxStudents);

  return buildValidationResult(errors);
}

export function validateLocationUpdatePayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "LOCATION_ID_REQUIRED", message: "Location ID is required." });
  }

  if (!isNonEmptyText(payload.name)) {
    errors.push({ code: "LOCATION_NAME_REQUIRED", message: "Location name is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived"]);
  validateEnum(errors, "loginMode", payload.loginMode, ["fruit", "standard", "hybrid"]);
  validateLoginSlug(errors, payload.loginSlug);
  validateOptionalUrl(errors, "photoUrl", payload.photoUrl || payload.imageUrl);
  validateOptionalUrl(errors, "iconUrl", payload.iconUrl);
  validateOptionalUrl(errors, "website", payload.website);
  validateOptionalUrl(errors, "twoGisUrl", payload.twoGisUrl);
  validateOptionalUrl(errors, "socialLinks.instagram", payload.socialLinks && payload.socialLinks.instagram);
  validateOptionalUrl(errors, "socialLinks.facebook", payload.socialLinks && payload.socialLinks.facebook);
  validateOptionalUrl(errors, "socialLinks.telegram", payload.socialLinks && payload.socialLinks.telegram);
  validateOptionalUrl(errors, "socialLinks.whatsapp", payload.socialLinks && payload.socialLinks.whatsapp);
  validateOptionalUrl(errors, "socialLinks.youtube", payload.socialLinks && payload.socialLinks.youtube);
  validateOptionalEmail(errors, payload.email);
  validateOptionalNumber(errors, "latitude", payload.latitude);
  validateOptionalNumber(errors, "longitude", payload.longitude);
  validateOptionalNumber(errors, "subscription.maxStudents", payload.subscription && payload.subscription.maxStudents);

  return buildValidationResult(errors);
}

export function validateClassPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.name)) {
    errors.push({ code: "CLASS_NAME_REQUIRED", message: "Class name is required." });
  }

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "CLASS_LOCATION_REQUIRED", message: "Class location is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived"]);

  return buildValidationResult(errors);
}

export function validateClassUpdatePayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.classId)) {
    errors.push({ code: "CLASS_ID_REQUIRED", message: "Class ID is required." });
  }

  if (!isNonEmptyText(payload.name)) {
    errors.push({ code: "CLASS_NAME_REQUIRED", message: "Class name is required." });
  }

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "CLASS_LOCATION_REQUIRED", message: "Class location is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived"]);

  return buildValidationResult(errors);
}

export function validateClassOwnershipPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.classId || payload.id)) {
    errors.push({ code: "CLASS_ID_REQUIRED", message: "Class ID is required." });
  }

  validateOptionalIdList(errors, "assistantIds", payload.assistantIds);

  return buildValidationResult(errors);
}

export function validateStudentPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.name)) {
    errors.push({ code: "STUDENT_NAME_REQUIRED", message: "Student name is required." });
  }

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "STUDENT_LOCATION_REQUIRED", message: "Student location is required." });
  }

  if (!isNonEmptyText(payload.classId)) {
    errors.push({ code: "STUDENT_CLASS_REQUIRED", message: "Student class is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived", "approved"]);

  if (payload.fruitPassword && (!Array.isArray(payload.fruitPassword) || payload.fruitPassword.length !== 4)) {
    errors.push({ code: "FRUIT_PASSWORD_REQUIRED", message: "Choose exactly four fruits." });
  }

  return buildValidationResult(errors);
}

export function validateStudentUpdatePayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.studentId)) {
    errors.push({ code: "STUDENT_ID_REQUIRED", message: "Student ID is required." });
  }

  if (!isNonEmptyText(payload.name)) {
    errors.push({ code: "STUDENT_NAME_REQUIRED", message: "Student name is required." });
  }

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "STUDENT_LOCATION_REQUIRED", message: "Student location is required." });
  }

  if (!isNonEmptyText(payload.classId)) {
    errors.push({ code: "STUDENT_CLASS_REQUIRED", message: "Student class is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived", "approved"]);

  return buildValidationResult(errors);
}

export function validateStudentStatusPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.studentId)) {
    errors.push({ code: "STUDENT_ID_REQUIRED", message: "Student ID is required." });
  }

  validateEnum(errors, "status", payload.status, ["active", "inactive", "archived", "approved"]);

  return buildValidationResult(errors);
}

export function validateFruitPasswordResetPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.studentId)) {
    errors.push({ code: "STUDENT_ID_REQUIRED", message: "Student ID is required." });
  }

  if (!Array.isArray(payload.fruitPassword) || payload.fruitPassword.length !== 4) {
    errors.push({ code: "FRUIT_PASSWORD_REQUIRED", message: "Choose exactly four fruits." });
  }

  return buildValidationResult(errors);
}

function validateEnum(errors, fieldName, value, allowedValues) {
  if (allowedValues.indexOf(value) === -1) {
    errors.push({
      code: "INVALID_" + fieldName.toUpperCase(),
      message: fieldName + " is invalid."
    });
  }
}

function validateLoginSlug(errors, value) {
  var slug = normalizeLoginSlugForValidation(value);
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

  if (!slug) {
    return;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push({
      code: "LOCATION_LOGIN_SLUG_INVALID",
      message: "loginSlug must use lowercase letters, numbers, and hyphens only."
    });
    return;
  }

  if (reservedSlugs.indexOf(slug) !== -1) {
    errors.push({
      code: "LOCATION_LOGIN_SLUG_RESERVED",
      message: "That loginSlug is reserved. Please choose another one."
    });
  }
}

function validateOptionalUrl(errors, fieldName, value) {
  var text = "";

  if (value === undefined || value === null || value === "") {
    return;
  }

  text = String(value).trim();

  if (!text) {
    return;
  }

  try {
    var parsedUrl = new URL(text);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Unsupported URL protocol.");
    }
  } catch (error) {
    errors.push({
      code: "INVALID_URL",
      message: fieldName + " must be a valid http or https URL."
    });
  }
}

function validateOptionalEmail(errors, value) {
  var text = "";

  if (value === undefined || value === null || value === "") {
    return;
  }

  text = String(value).trim();

  if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    errors.push({
      code: "INVALID_EMAIL",
      message: "email must look like a valid email address."
    });
  }
}

function validateOptionalNumber(errors, fieldName, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (!Number.isFinite(Number(value))) {
    errors.push({
      code: "INVALID_NUMBER",
      message: fieldName + " must be a number."
    });
  }
}

function validateOptionalIdList(errors, fieldName, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (typeof value === "string") {
    return;
  }

  if (!Array.isArray(value)) {
    errors.push({
      code: "INVALID_" + fieldName.toUpperCase(),
      message: fieldName + " must be a list of IDs."
    });
  }
}

function normalizeLoginSlugForValidation(value) {
  var text = "";

  if (typeof value === "string") {
    text = value.trim().toLowerCase();
  }

  text = text.replace(/[^a-z0-9]+/g, "-");
  text = text.replace(/^-+/, "");
  text = text.replace(/-+$/, "");

  return text;
}

function buildValidationResult(errors) {
  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

function isNonEmptyText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
