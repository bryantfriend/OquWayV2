import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";

export function createDefenseChallengeState(config) {
  var state = {
    hp: config.targetHp,
    score: 0,
    timeLeft: config.timeLimitSeconds,
    activeObjects: [],
    nextObjectId: 1,
    defeatedThreats: 0,
    defeatedBosses: 0,
    missedThreats: 0,
    missedClicks: 0,
    healthPacksUsed: 0,
    feedback: "Defend the " + config.protectedTargetName + ".",
    completed: false,
    completionReason: "",
    startedAt: Date.now(),
    ticks: 0,
    modeNotice: readModeNotice(config.gameMode)
  };

  return spawnObjects(config, state);
}

export function tickDefenseChallenge(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  nextState.ticks = nextState.ticks + 1;
  nextState.timeLeft = Math.max(0, nextState.timeLeft - 1);
  nextState.activeObjects = advanceObjects(config, nextState);
  nextState = spawnObjects(config, nextState);

  return checkDefenseCompletion(config, nextState);
}

export function hitDefenseObject(config, state, objectId) {
  var nextState = cloneState(state);
  var objectIndex = findObjectIndex(nextState.activeObjects, objectId);
  var activeObject = objectIndex >= 0 ? nextState.activeObjects[objectIndex] : null;

  if (!activeObject || nextState.completed) {
    return nextState;
  }

  if (activeObject.kind === "power-up") {
    nextState.hp = Math.min(config.targetHp, nextState.hp + activeObject.healAmount);
    nextState.healthPacksUsed = nextState.healthPacksUsed + 1;
    nextState.feedback = activeObject.label + " restored +" + activeObject.healAmount + " HP.";
    nextState.activeObjects.splice(objectIndex, 1);
    return checkDefenseCompletion(config, nextState);
  }

  if (config.gameMode === "correct-defense" && activeObject.isCorrect === false) {
    nextState.hp = Math.max(0, nextState.hp - activeObject.damage);
    nextState.missedClicks = nextState.missedClicks + 1;
    nextState.feedback = activeObject.label + " was a decoy. Protect your HP.";
    nextState.activeObjects.splice(objectIndex, 1);
    return checkDefenseCompletion(config, nextState);
  }

  activeObject.hp = Math.max(0, activeObject.hp - 1);

  if (activeObject.hp > 0) {
    nextState.feedback = activeObject.label + " needs " + activeObject.hp + " more hit" + (activeObject.hp === 1 ? "" : "s") + ".";
    nextState.activeObjects[objectIndex] = activeObject;
    return checkDefenseCompletion(config, nextState);
  }

  nextState.score = nextState.score + activeObject.points;
  nextState.defeatedThreats = nextState.defeatedThreats + 1;
  if (activeObject.isBoss) {
    nextState.defeatedBosses = nextState.defeatedBosses + 1;
  }
  nextState.feedback = "+" + activeObject.points + " points. " + activeObject.label + " cleared.";
  nextState.activeObjects.splice(objectIndex, 1);

  return checkDefenseCompletion(config, nextState);
}

export function registerMissedDefenseClick(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed || !config.settings.penalizeMissedClicks) {
    return nextState;
  }

  nextState.hp = Math.max(0, nextState.hp - 10);
  nextState.missedClicks = nextState.missedClicks + 1;
  nextState.feedback = "Careful. Missed clicks cost 10 HP.";

  return checkDefenseCompletion(config, nextState);
}

export function checkDefenseCompletion(config, state) {
  var nextState = cloneState(state);
  var reachedTarget = nextState.score >= config.targetScore;
  var timeExpired = nextState.timeLeft <= 0;
  var bossGoalMet = config.completionRule === "defeat-bosses" && nextState.defeatedBosses >= 1;

  if (nextState.completed) {
    return nextState;
  }

  if (nextState.hp <= 0) {
    nextState.hp = 0;
    nextState.completed = true;
    nextState.completionReason = "target-destroyed";
  } else if (config.completionRule === "target-score" && reachedTarget) {
    nextState.completed = true;
    nextState.completionReason = "target-score";
  } else if (config.completionRule === "survive-time" && timeExpired) {
    nextState.completed = true;
    nextState.completionReason = "survive-time";
  } else if (config.completionRule === "target-score-or-time" && (reachedTarget || timeExpired)) {
    nextState.completed = true;
    nextState.completionReason = reachedTarget ? "target-score" : "survive-time";
  } else if (bossGoalMet) {
    nextState.completed = true;
    nextState.completionReason = "defeat-bosses";
  }

  if (nextState.completed) {
    nextState.activeObjects = [];
    nextState.score = Math.max(0, Math.round(nextState.score));
    nextState.feedback = readCompletionFeedback(nextState.completionReason, config.protectedTargetName);
  }

  return nextState;
}

export function createDefenseChallengeResults(config, state) {
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var hpPercent = calculateHpPercent(config, state);
  var scoreProgress = calculateScoreProgress(config, state);
  var stars = calculateDefenseStars(config, state);
  var totalActions = Math.max(1, state.defeatedThreats + state.missedThreats + state.missedClicks);
  var summary = createGamificationSummary({
    correctAnswers: state.defeatedThreats,
    totalAnswers: totalActions,
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Defense Challenge",
    message: readDefenseMessage(stars, state.completionReason)
  });

  summary.accuracy = state.completionReason === "target-score" ? 100 : Math.max(scoreProgress, hpPercent);
  summary.stars = stars;
  summary.perfect = stars === 3;

  return {
    summary: summary,
    stats: {
      score: state.score,
      targetScore: config.targetScore,
      hp: state.hp,
      targetHp: config.targetHp,
      hpPercent: hpPercent,
      defeatedThreats: state.defeatedThreats,
      defeatedBosses: state.defeatedBosses,
      missedThreats: state.missedThreats,
      missedClicks: state.missedClicks,
      healthPacksUsed: state.healthPacksUsed,
      completionTimeSeconds: completionTimeSeconds,
      completionReason: state.completionReason,
      gameMode: config.gameMode
    }
  };
}

export function calculateHpPercent(config, state) {
  if (!config.targetHp || config.targetHp <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((state.hp / config.targetHp) * 100)));
}

export function calculateScoreProgress(config, state) {
  if (!config.targetScore || config.targetScore <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((state.score / config.targetScore) * 100)));
}

function advanceObjects(config, state) {
  var nextObjects = [];

  state.activeObjects.forEach(function (object) {
    var nextObject = Object.assign({}, object, {
      age: object.age + 1
    });

    if (nextObject.age >= nextObject.ttl) {
      if (nextObject.kind === "threat" && config.settings.penalizeMissedThreats) {
        state.hp = Math.max(0, state.hp - nextObject.damage);
        state.missedThreats = state.missedThreats + 1;
        state.feedback = nextObject.label + " got through. -" + nextObject.damage + " HP.";
      }
      return;
    }

    nextObjects.push(nextObject);
  });

  return nextObjects;
}

function spawnObjects(config, state) {
  var nextState = cloneState(state);
  var spawnCount = readSpawnCount(config, nextState);
  var index = 0;

  while (index < spawnCount && nextState.activeObjects.length < config.maxActiveObjects) {
    nextState.activeObjects.push(createActiveObject(config, nextState));
    nextState.nextObjectId = nextState.nextObjectId + 1;
    index = index + 1;
  }

  return nextState;
}

function readSpawnCount(config, state) {
  var baseEvery = config.gameMode === "survival-mode"
    ? Math.max(2, 5 - Math.floor((config.timeLimitSeconds - state.timeLeft) / 35))
    : 4;

  if (state.activeObjects.length === 0) {
    return 2;
  }

  return state.ticks % baseEvery === 0 ? 1 : 0;
}

function createActiveObject(config, state) {
  var includePowerUp = config.powerUps.length > 0
    && state.hp < config.targetHp
    && state.nextObjectId % 5 === 0;
  var source = includePowerUp
    ? config.powerUps[state.nextObjectId % config.powerUps.length]
    : chooseThreat(config, state);
  var ttl = source.isBoss ? 8 : 6;

  if (config.gameMode === "survival-mode") {
    ttl = Math.max(4, ttl - Math.floor((config.timeLimitSeconds - state.timeLeft) / 45));
  }

  return Object.assign({}, source, {
    objectId: String(state.nextObjectId),
    kind: includePowerUp ? "power-up" : "threat",
    x: 8 + ((state.nextObjectId * 29) % 78),
    y: 12 + ((state.nextObjectId * 47) % 70),
    ttl: ttl,
    age: 0,
    hp: readObjectHp(source)
  });
}

function chooseThreat(config, state) {
  var bossThreats = config.threats.filter(function (threat) {
    return threat.isBoss === true;
  });
  var regularThreats = config.threats.filter(function (threat) {
    return threat.isBoss !== true;
  });
  var useBoss = config.settings.allowBossThreats
    && bossThreats.length > 0
    && (state.nextObjectId % 7 === 0 || config.gameMode === "boss-defense");
  var list = useBoss ? bossThreats : regularThreats;

  if (list.length === 0) {
    list = config.threats;
  }

  return list[state.nextObjectId % list.length];
}

function calculateDefenseStars(config, state) {
  var hpPercent = calculateHpPercent(config, state);

  if (state.hp <= 0 || state.completionReason === "target-destroyed") {
    return 0;
  }

  if (state.score >= config.targetScore || hpPercent >= 75) {
    return 3;
  }

  if (hpPercent >= 40) {
    return 2;
  }

  if (hpPercent >= 1) {
    return 1;
  }

  return 0;
}

function findObjectIndex(objects, objectId) {
  var index = 0;

  while (index < objects.length) {
    if (objects[index].objectId === objectId) {
      return index;
    }
    index = index + 1;
  }

  return -1;
}

function readObjectHp(object) {
  var hp = Number(object.hp);

  return Number.isFinite(hp) && hp > 0 ? Math.round(hp) : 1;
}

function cloneState(state) {
  return Object.assign({}, state, {
    activeObjects: Array.isArray(state.activeObjects)
      ? state.activeObjects.map(function (object) {
        return Object.assign({}, object);
      })
      : []
  });
}

function readCompletionFeedback(reason, protectedTargetName) {
  if (reason === "target-destroyed") {
    return protectedTargetName + " was overwhelmed. Try again with faster taps.";
  }

  if (reason === "target-score") {
    return "Target score reached. Strong defense.";
  }

  if (reason === "defeat-bosses") {
    return "Boss threat defeated. Excellent focus.";
  }

  return "Time is up. The defense round is complete.";
}

function readDefenseMessage(stars, reason) {
  if (reason === "target-destroyed") {
    return "Keep practicing. Protect your HP and clear threats quickly.";
  }

  if (stars === 3) {
    return "Excellent defense. You protected the target with confidence.";
  }

  if (stars === 2) {
    return "Good defense. A little more speed will make it even stronger.";
  }

  if (stars === 1) {
    return "You survived. Keep practicing to protect more HP.";
  }

  return "Try again and focus on threats before they disappear.";
}

function readModeNotice(gameMode) {
  if (gameMode === "correct-defense") {
    return "Correct Defense is using the defense engine foundation. Decoy support is ready for future custom threat sets.";
  }

  if (gameMode === "boss-defense") {
    return "Boss Defense uses multi-hit threats and completes when a boss is defeated.";
  }

  return "";
}
