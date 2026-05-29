export function normalizeLocationPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    name: normalizeText(payload.name),
    status: normalizeStatus(payload.status),
    loginMode: normalizeLoginMode(payload.loginMode),
    loginSlug: normalizeLoginSlug(payload.loginSlug),
    imageUrl: normalizeText(payload.imageUrl)
  };
}

export function normalizeClassPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    classId: normalizeText(payload.classId),
    name: normalizeText(payload.name),
    locationId: normalizeText(payload.locationId),
    status: normalizeStatus(payload.status),
    isVisible: payload.isVisible === false ? false : true,
    photoDataUrl: normalizeText(payload.photoDataUrl)
  };
}

export function normalizeStudentPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    studentId: normalizeText(payload.studentId),
    name: normalizeText(payload.name),
    photoUrl: normalizeText(payload.photoUrl),
    classId: normalizeText(payload.classId),
    locationId: normalizeText(payload.locationId),
    status: normalizeStatus(payload.status),
    email: normalizeText(payload.email),
    username: normalizeText(payload.username),
    fruitPassword: normalizeFruitPassword(payload.fruitPassword)
  };
}

export function normalizeFruitPasswordResetPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    studentId: normalizeText(payload.studentId),
    fruitPassword: normalizeFruitPassword(payload.fruitPassword)
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStatus(value) {
  if (value === "inactive" || value === "archived" || value === "approved") {
    return value;
  }

  return "active";
}

function normalizeLoginMode(value) {
  if (value === "standard" || value === "hybrid") {
    return value;
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

function normalizeFruitPassword(value) {
  var result = [];
  var index = 0;

  if (!Array.isArray(value)) {
    return result;
  }

  while (index < value.length && index < 4) {
    if (typeof value[index] === "string") {
      result.push(value[index]);
    }

    index = index + 1;
  }

  return result;
}
