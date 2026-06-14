export function normalizeAction(value) {
  return String(value || "").trim().toLowerCase();
}

export function isCorrectScenarioAction(selectedAction, correctAction) {
  return normalizeAction(selectedAction) === normalizeAction(correctAction);
}

export function createScenarioActions(scenario) {
  var correctAction = readString(scenario.correctAction, "CONTINUE");
  var actions = [correctAction];

  (Array.isArray(scenario.incorrectActions) ? scenario.incorrectActions : []).forEach(function (action) {
    var label = readString(action, "");

    if (label && normalizeAction(label) !== normalizeAction(correctAction) && actions.map(normalizeAction).indexOf(normalizeAction(label)) === -1) {
      actions.push(label);
    }
  });

  while (actions.length < 3) {
    actions.push("OPTION " + actions.length);
  }

  return stableShuffle(actions, scenario.id || scenario.title || correctAction);
}

function stableShuffle(actions, seedText) {
  var result = actions.slice();
  var seed = 0;
  var index = 0;

  while (index < seedText.length) {
    seed = seed + seedText.charCodeAt(index);
    index = index + 1;
  }

  result.sort(function (first, second) {
    return scoreAction(first, seed) - scoreAction(second, seed);
  });

  return result;
}

function scoreAction(action, seed) {
  var text = String(action || "");
  var score = seed;
  var index = 0;

  while (index < text.length) {
    score = (score * 31 + text.charCodeAt(index)) % 997;
    index = index + 1;
  }

  return score;
}

function readString(value, fallbackValue) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue;
}
