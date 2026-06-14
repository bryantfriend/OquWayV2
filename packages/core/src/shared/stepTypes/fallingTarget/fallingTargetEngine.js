import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";

export function createFallingTargetState(config) {
  return spawnFallingTargets(config, {
    lives: config.startingLives,
    score: 0,
    timeLeft: config.timeLimitSeconds,
    activeTargets: [],
    nextTargetId: 1,
    destroyedTargets: 0,
    missedTargets: 0,
    powerUpsUsed: 0,
    activePowerUp: "",
    powerUpTimeLeft: 0,
    feedback: "Tap falling targets before they reach " + config.dangerZoneName + ".",
    completed: false,
    completionReason: "",
    ticks: 0,
    startedAt: Date.now()
  });
}

export function tickFallingTarget(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  nextState.ticks = nextState.ticks + 1;
  nextState.timeLeft = Math.max(0, nextState.timeLeft - 1);
  nextState.powerUpTimeLeft = Math.max(0, nextState.powerUpTimeLeft - 1);
  if (nextState.powerUpTimeLeft <= 0) {
    nextState.activePowerUp = "";
  }
  nextState.activeTargets = advanceTargets(config, nextState);
  nextState = spawnFallingTargets(config, nextState);

  return checkFallingCompletion(config, nextState);
}

export function hitFallingTarget(config, state, targetId) {
  var nextState = cloneState(state);
  var index = findTargetIndex(nextState.activeTargets, targetId);
  var target = index >= 0 ? nextState.activeTargets[index] : null;

  if (!target || nextState.completed) {
    return nextState;
  }

  if (target.type === "powerup") {
    nextState.powerUpsUsed = nextState.powerUpsUsed + 1;
    nextState.activePowerUp = target.effect || "rapid-fire";
    nextState.powerUpTimeLeft = target.durationSeconds || 3;
    nextState.feedback = target.label + " activated.";
    nextState.activeTargets.splice(index, 1);
    return checkFallingCompletion(config, nextState);
  }

  nextState.score = nextState.score + target.points;
  nextState.destroyedTargets = nextState.destroyedTargets + 1;
  nextState.feedback = "+" + target.points + " points. " + target.label + " cleared.";
  nextState.activeTargets.splice(index, 1);

  return checkFallingCompletion(config, nextState);
}

export function activateRapidFire(config, state) {
  var nextState = cloneState(state);
  var cleared = 0;

  if (nextState.activePowerUp !== "rapid-fire" || nextState.completed) {
    return nextState;
  }

  nextState.activeTargets = nextState.activeTargets.filter(function (target) {
    if (target.type === "enemy") {
      nextState.score = nextState.score + target.points;
      cleared = cleared + 1;
      return false;
    }
    return true;
  });
  nextState.destroyedTargets = nextState.destroyedTargets + cleared;
  nextState.feedback = cleared > 0 ? "Rapid Fire cleared " + cleared + " targets." : "Rapid Fire is active.";

  return checkFallingCompletion(config, nextState);
}

export function createFallingTargetResults(config, state) {
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var stars = calculateStars(config, state);
  var summary = createGamificationSummary({
    correctAnswers: state.destroyedTargets,
    totalAnswers: Math.max(1, state.destroyedTargets + state.missedTargets),
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Falling Target Challenge",
    message: stars === 3 ? "Excellent focus. You protected the danger zone." : "Good effort. Keep watching the falling targets."
  });

  summary.accuracy = Math.max(0, Math.min(100, Math.round((state.score / config.targetScore) * 100)));
  summary.stars = stars;
  summary.perfect = stars === 3;

  return { summary: summary, stats: { score: state.score, targetScore: config.targetScore, lives: state.lives, startingLives: config.startingLives, destroyedTargets: state.destroyedTargets, missedTargets: state.missedTargets, powerUpsUsed: state.powerUpsUsed, completionReason: state.completionReason, completionTimeSeconds: completionTimeSeconds } };
}

function advanceTargets(config, state) {
  var speed = readSpeed(config, state);
  var kept = [];

  state.activeTargets.forEach(function (target) {
    var nextTarget = Object.assign({}, target, { y: target.y + speed });
    if (nextTarget.y >= 90) {
      if (nextTarget.type === "enemy" && config.settings.penalizeMissedTargets) {
        state.lives = Math.max(0, state.lives - nextTarget.damage);
        state.missedTargets = state.missedTargets + 1;
        state.feedback = nextTarget.label + " reached the danger zone.";
      }
      return;
    }
    kept.push(nextTarget);
  });

  return kept;
}

function spawnFallingTargets(config, state) {
  var nextState = cloneState(state);
  var interval = config.settings.increaseDifficulty ? Math.max(2, 5 - Math.floor(nextState.ticks / 20)) : 4;

  if (nextState.activeTargets.length === 0 || nextState.ticks % interval === 0) {
    nextState.activeTargets.push(createActiveTarget(config, nextState));
    nextState.nextTargetId = nextState.nextTargetId + 1;
  }

  return nextState;
}

function createActiveTarget(config, state) {
  var enemies = config.fallingTargets.filter(function (target) { return target.type !== "powerup"; });
  var powerUps = config.fallingTargets.filter(function (target) { return target.type === "powerup"; });
  var usePowerUp = config.settings.allowPowerUps && powerUps.length > 0 && state.nextTargetId % 6 === 0;
  var list = usePowerUp ? powerUps : enemies;
  var source = list[state.nextTargetId % list.length] || config.fallingTargets[0];

  return Object.assign({}, source, { objectId: String(state.nextTargetId), x: 10 + ((state.nextTargetId * 31) % 78), y: 6 });
}

function checkFallingCompletion(config, state) {
  var nextState = cloneState(state);
  var reachedTarget = nextState.score >= config.targetScore;
  var timeExpired = nextState.timeLeft <= 0;

  if (nextState.completed) {
    return nextState;
  }

  if (nextState.lives <= 0) {
    nextState.completed = true;
    nextState.completionReason = "lives-depleted";
  } else if (config.completionRule === "target-score" && reachedTarget) {
    nextState.completed = true;
    nextState.completionReason = "target-score";
  } else if (config.completionRule === "survive-time" && timeExpired) {
    nextState.completed = true;
    nextState.completionReason = "survive-time";
  } else if (config.completionRule === "target-score-or-time" && (reachedTarget || timeExpired)) {
    nextState.completed = true;
    nextState.completionReason = reachedTarget ? "target-score" : "survive-time";
  }

  if (nextState.completed) {
    nextState.activeTargets = [];
  }

  return nextState;
}

function calculateStars(config, state) {
  if (state.lives <= 0) { return 0; }
  if (state.score >= config.targetScore || state.lives >= Math.max(4, config.startingLives - 1)) { return 3; }
  if (state.lives >= 2) { return 2; }
  if (state.lives >= 1) { return 1; }
  return 0;
}

function readSpeed(config, state) {
  var bonus = config.settings.increaseDifficulty ? Math.min(4, Math.floor(state.ticks / 15)) : 0;
  return config.gameMode === "survival-rush" ? 9 + bonus : 7 + bonus;
}

function findTargetIndex(targets, id) {
  return targets.findIndex(function (target) { return target.objectId === id; });
}

function cloneState(state) {
  return Object.assign({}, state, { activeTargets: state.activeTargets.map(function (target) { return Object.assign({}, target); }) });
}
