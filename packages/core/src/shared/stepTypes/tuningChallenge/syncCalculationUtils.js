export function calculateTuningSync(controls, targetValues, userValues) {
  var safeControls = Array.isArray(controls) ? controls : [];
  var totalPenalty = 0;
  var totalWeight = 0;

  safeControls.forEach(function (control) {
    var range = Math.max(1, Number(control.max) - Number(control.min));
    var target = readNumber(targetValues && targetValues[control.id], control.defaultValue);
    var user = readNumber(userValues && userValues[control.id], control.defaultValue);
    var normalizedDiff = Math.min(1, Math.abs(target - user) / range);

    totalPenalty = totalPenalty + Math.pow(normalizedDiff, 1.35);
    totalWeight = totalWeight + 1;
  });

  if (totalWeight <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((1 - (totalPenalty / totalWeight)) * 100)));
}

export function calculateTuningStars(finalSync) {
  var safeSync = readNumber(finalSync, 0);

  if (safeSync >= 95) {
    return 3;
  }

  if (safeSync >= 80) {
    return 2;
  }

  if (safeSync >= 60) {
    return 1;
  }

  return 0;
}

export function createControlValues(controls, sourceValues) {
  var values = {};

  (Array.isArray(controls) ? controls : []).forEach(function (control) {
    values[control.id] = clampValue(readNumber(sourceValues && sourceValues[control.id], control.defaultValue), control.min, control.max);
  });

  return values;
}

function clampValue(value, min, max) {
  var safeMin = readNumber(min, 0);
  var safeMax = readNumber(max, safeMin + 1);

  return Math.max(safeMin, Math.min(safeMax, value));
}

function readNumber(value, fallbackValue) {
  var number = Number(value);

  return Number.isFinite(number) ? Math.round(number * 100) / 100 : fallbackValue;
}
