export function normalizeClassLocationPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId)
  };
}

export function normalizeStudentsForClassPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    classId: normalizeText(payload.classId)
  };
}

export function normalizeStudentFruitLoginPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    classId: normalizeText(payload.classId),
    studentId: normalizeText(payload.studentId),
    fruits: normalizeFruits(payload.fruits)
  };
}

export function normalizeStudentStandardLoginPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    identifier: normalizeText(payload.identifier),
    password: typeof payload.password === "string" ? payload.password : ""
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeFruits(values) {
  var fruits = [];
  var fruitIndex = 0;

  if (!Array.isArray(values)) {
    return fruits;
  }

  while (fruitIndex < values.length && fruitIndex < 4) {
    if (typeof values[fruitIndex] === "string") {
      fruits.push(values[fruitIndex]);
    }

    fruitIndex = fruitIndex + 1;
  }

  return fruits;
}
