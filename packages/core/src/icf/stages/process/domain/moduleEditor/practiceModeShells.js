export function createDefaultPracticeModes() {
  return {
    beforeClass: createPracticeMode(
      "beforeClass",
      "Before Class",
      "Prepare students before the live lesson.",
      1
    ),
    classroomLesson: createPracticeMode(
      "classroomLesson",
      "Classroom Lesson",
      "Reserve space for teacher-led lesson notes and in-person activities.",
      2
    ),
    afterClass: createPracticeMode(
      "afterClass",
      "After Class",
      "Reinforce what students practiced during class.",
      3
    ),
    dailyPractice: createPracticeMode(
      "dailyPractice",
      "Five Minute Daily Practice",
      "Give students short daily review practice between lessons.",
      4
    )
  };
}

export function normalizePracticeModes(practiceModes) {
  var defaultModes = createDefaultPracticeModes();
  var normalizedModes = {};

  normalizedModes.beforeClass = normalizePracticeMode(defaultModes.beforeClass, readPracticeMode(practiceModes, "beforeClass"));
  normalizedModes.classroomLesson = normalizePracticeMode(defaultModes.classroomLesson, readPracticeMode(practiceModes, "classroomLesson"));
  normalizedModes.afterClass = normalizePracticeMode(defaultModes.afterClass, readPracticeMode(practiceModes, "afterClass"));
  normalizedModes.dailyPractice = normalizePracticeMode(defaultModes.dailyPractice, readPracticeMode(practiceModes, "dailyPractice"));

  return normalizedModes;
}

export function isValidPracticeModeKey(practiceModeKey) {
  return practiceModeKey === "beforeClass"
    || practiceModeKey === "classroomLesson"
    || practiceModeKey === "afterClass"
    || practiceModeKey === "dailyPractice";
}

export function createUpdatedPracticeModes(existingPracticeModes, practiceModeKey, practiceModePatch) {
  var practiceModes = normalizePracticeModes(existingPracticeModes);
  var currentMode = practiceModes[practiceModeKey];
  var updatedMode = Object.assign({}, currentMode);

  updatedMode.title = normalizeLocalizedTitle(practiceModePatch.title, currentMode.title);
  updatedMode.purpose = readText(practiceModePatch.purpose, currentMode.purpose);
  updatedMode.enabled = readBoolean(practiceModePatch.enabled, currentMode.enabled);
  updatedMode.status = readStatus(practiceModePatch.status, currentMode.status);
  updatedMode.steps = readSteps(currentMode.steps);

  practiceModes[practiceModeKey] = updatedMode;
  return practiceModes;
}

export function addStepToPracticeMode(existingPracticeModes, practiceModeKey, step) {
  var practiceModes = normalizePracticeModes(existingPracticeModes);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readSteps(practiceMode.steps);
  var stepToAdd = Object.assign({}, step);

  stepToAdd.order = steps.length + 1;
  steps.push(stepToAdd);
  practiceMode.steps = steps;
  practiceModes[practiceModeKey] = practiceMode;

  return practiceModes;
}

export function updatePracticeModeStep(existingPracticeModes, practiceModeKey, stepId, stepPatch) {
  var practiceModes = normalizePracticeModes(existingPracticeModes);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readSteps(practiceMode.steps);
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    if (steps[stepIndex].id === stepId) {
      steps[stepIndex] = Object.assign({}, steps[stepIndex], stepPatch, {
        id: stepId,
        updatedAt: Date.now()
      });
      practiceMode.steps = normalizeStepOrder(steps);
      practiceModes[practiceModeKey] = practiceMode;
      return practiceModes;
    }

    stepIndex = stepIndex + 1;
  }

  practiceMode.steps = normalizeStepOrder(steps);
  practiceModes[practiceModeKey] = practiceMode;
  return practiceModes;
}

export function deletePracticeModeStep(existingPracticeModes, practiceModeKey, stepId) {
  var practiceModes = normalizePracticeModes(existingPracticeModes);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readSteps(practiceMode.steps);
  var remainingSteps = [];
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    if (steps[stepIndex].id !== stepId) {
      remainingSteps.push(steps[stepIndex]);
    }

    stepIndex = stepIndex + 1;
  }

  practiceMode.steps = normalizeStepOrder(remainingSteps);
  practiceModes[practiceModeKey] = practiceMode;
  return practiceModes;
}

export function reorderPracticeModeSteps(existingPracticeModes, practiceModeKey, orderedStepIds) {
  var practiceModes = normalizePracticeModes(existingPracticeModes);
  var practiceMode = practiceModes[practiceModeKey];
  var steps = readSteps(practiceMode.steps);
  var reorderedSteps = [];
  var usedStepIds = [];
  var orderIndex = 0;

  if (!Array.isArray(orderedStepIds)) {
    return practiceModes;
  }

  while (orderIndex < orderedStepIds.length) {
    appendStepById(reorderedSteps, usedStepIds, steps, orderedStepIds[orderIndex]);
    orderIndex = orderIndex + 1;
  }

  appendRemainingSteps(reorderedSteps, usedStepIds, steps);

  practiceMode.steps = normalizeStepOrder(reorderedSteps);
  practiceModes[practiceModeKey] = practiceMode;
  return practiceModes;
}

function createPracticeMode(key, englishTitle, purpose, order) {
  return {
    key: key,
    title: {
      en: englishTitle,
      ru: "",
      ky: ""
    },
    purpose: purpose,
    status: "shell",
    enabled: true,
    steps: [],
    order: order
  };
}

function readPracticeMode(practiceModes, practiceModeKey) {
  if (!practiceModes || typeof practiceModes !== "object" || Array.isArray(practiceModes)) {
    return null;
  }

  if (!practiceModes[practiceModeKey] || typeof practiceModes[practiceModeKey] !== "object") {
    return null;
  }

  return practiceModes[practiceModeKey];
}

function normalizePracticeMode(defaultMode, existingMode) {
  if (!existingMode) {
    return defaultMode;
  }

  return {
    key: defaultMode.key,
    title: normalizeLocalizedTitle(existingMode.title, defaultMode.title),
    purpose: readText(existingMode.purpose, defaultMode.purpose),
    status: readStatus(existingMode.status, defaultMode.status),
    enabled: readBoolean(existingMode.enabled, defaultMode.enabled),
    steps: readSteps(existingMode.steps),
    order: defaultMode.order
  };
}

function normalizeLocalizedTitle(title, fallbackTitle) {
  var normalizedTitle = {
    en: fallbackTitle.en,
    ru: fallbackTitle.ru,
    ky: fallbackTitle.ky
  };

  if (typeof title === "string") {
    normalizedTitle.en = title.trim() || fallbackTitle.en;
    return normalizedTitle;
  }

  if (!title || typeof title !== "object" || Array.isArray(title)) {
    return normalizedTitle;
  }

  normalizedTitle.en = readText(title.en, fallbackTitle.en);
  normalizedTitle.ru = readText(title.ru, fallbackTitle.ru);
  normalizedTitle.ky = readText(title.ky, fallbackTitle.ky);

  return normalizedTitle;
}

function readText(value, fallbackText) {
  if (typeof value !== "string") {
    return fallbackText;
  }

  return value.trim();
}

function readStatus(status, fallbackStatus) {
  if (status === "shell" || status === "draft" || status === "ready" || status === "disabled") {
    return status;
  }

  return fallbackStatus;
}

function readBoolean(value, fallbackValue) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallbackValue;
}

function readSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.slice();
}

function normalizeStepOrder(steps) {
  var orderedSteps = [];
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    orderedSteps.push(Object.assign({}, steps[stepIndex], {
      order: stepIndex + 1
    }));
    stepIndex = stepIndex + 1;
  }

  return orderedSteps;
}

function appendStepById(reorderedSteps, usedStepIds, steps, stepId) {
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    if (steps[stepIndex].id === stepId && usedStepIds.indexOf(stepId) === -1) {
      reorderedSteps.push(steps[stepIndex]);
      usedStepIds.push(stepId);
      return;
    }

    stepIndex = stepIndex + 1;
  }
}

function appendRemainingSteps(reorderedSteps, usedStepIds, steps) {
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    if (usedStepIds.indexOf(steps[stepIndex].id) === -1) {
      reorderedSteps.push(steps[stepIndex]);
    }

    stepIndex = stepIndex + 1;
  }
}
