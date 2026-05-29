export function validateClassLocationPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({
      code: "LOGIN_LOCATION_REQUIRED",
      message: "Choose a location first."
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

export function validateStudentsForClassPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({
      code: "LOGIN_LOCATION_REQUIRED",
      message: "Choose a location first."
    });
  }

  if (!isNonEmptyText(payload.classId)) {
    errors.push({
      code: "LOGIN_CLASS_REQUIRED",
      message: "Choose a class first."
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

export function validateStudentFruitLoginPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "LOGIN_LOCATION_REQUIRED", message: "Choose a location first." });
  }

  if (!isNonEmptyText(payload.classId)) {
    errors.push({ code: "LOGIN_CLASS_REQUIRED", message: "Choose a class first." });
  }

  if (!isNonEmptyText(payload.studentId)) {
    errors.push({ code: "LOGIN_STUDENT_REQUIRED", message: "Choose your profile first." });
  }

  if (!Array.isArray(payload.fruits) || payload.fruits.length !== 4) {
    errors.push({
      code: "FRUIT_PASSWORD_LENGTH_INVALID",
      message: "Choose exactly four fruits."
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors
    };
  }

  return { valid: true };
}

export function validateStudentStandardLoginPayload(executionState) {
  var payload = executionState.payload || {};
  var errors = [];

  if (!isNonEmptyText(payload.locationId)) {
    errors.push({ code: "LOGIN_LOCATION_REQUIRED", message: "Choose a location first." });
  }

  if (!isNonEmptyText(payload.identifier)) {
    errors.push({ code: "LOGIN_IDENTIFIER_REQUIRED", message: "Enter your email." });
  }

  if (!isNonEmptyText(payload.password)) {
    errors.push({ code: "LOGIN_PASSWORD_REQUIRED", message: "Enter your password." });
  }

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
