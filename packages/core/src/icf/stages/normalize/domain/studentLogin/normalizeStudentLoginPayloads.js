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
    classId: normalizeText(payload.classId),
    className: normalizeText(payload.className)
  };
}

export function normalizeStudentFruitLoginPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    locationId: normalizeText(payload.locationId),
    classId: normalizeText(payload.classId),
    className: normalizeText(payload.className),
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

var fruitAliases = {
  apple: "apple",
  "\uD83C\uDF4E": "apple",
  watermelon: "watermelon",
  "\uD83C\uDF49": "watermelon",
  banana: "banana",
  "\uD83C\uDF4C": "banana",
  strawberry: "strawberry",
  "\uD83C\uDF53": "strawberry",
  pineapple: "pineapple",
  "\uD83C\uDF4D": "pineapple",
  mango: "mango",
  "\uD83E\uDD6D": "mango",
  kiwi: "kiwi",
  "\uD83E\uDD5D": "kiwi",
  orange: "orange",
  "\uD83C\uDF4A": "orange",
  cherry: "cherry",
  cherries: "cherry",
  "\uD83C\uDF52": "cherry"
};

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
    var normalizedFruit = normalizeFruitKey(values[fruitIndex]);

    if (normalizedFruit) {
      fruits.push(normalizedFruit);
    }

    fruitIndex = fruitIndex + 1;
  }

  return fruits;
}

function normalizeFruitKey(value) {
  var rawValue = normalizeText(value);
  var textValue = rawValue.toLowerCase();
  var compactValue = textValue.replace(/[^a-z0-9]/g, "");

  return fruitAliases[rawValue] || fruitAliases[textValue] || fruitAliases[compactValue] || "";
}
