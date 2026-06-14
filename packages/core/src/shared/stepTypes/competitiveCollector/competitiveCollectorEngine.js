import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";

export function createCompetitiveCollectorState(config) {
  return {
    score: 0,
    timeLeft: config.timeLimitSeconds,
    clicks: 0,
    correctClicks: 0,
    wrongClicks: 0,
    upgradeCounts: {},
    pointsPerSecond: 0,
    feedback: "Start collecting " + config.resourceName + ".",
    completed: false,
    completionReason: "",
    startedAt: Date.now(),
    modeNotice: readModeNotice(config.gameMode)
  };
}

export function collectCompetitiveItem(config, state, itemId) {
  var item = readCollectible(config.collectibles, itemId);
  var nextState = cloneState(state);
  var correct = item ? item.isCorrect !== false : false;
  var points = item ? item.points : 0;

  if (!item || nextState.completed) {
    return nextState;
  }

  nextState.clicks = nextState.clicks + 1;

  if (config.gameMode === "correct-collector" && !correct) {
    nextState.wrongClicks = nextState.wrongClicks + 1;
    nextState.feedback = item.label + " is not one to collect this round. Try another item.";
    if (config.settings.allowWrongItems) {
      nextState.score = Math.max(0, nextState.score - Math.max(10, Math.abs(points)));
    }
    return checkCompetitiveCollectorCompletion(config, nextState);
  }

  if (config.gameMode === "avoid-the-trap" && !correct) {
    nextState.wrongClicks = nextState.wrongClicks + 1;
    nextState.score = Math.max(0, nextState.score - Math.max(25, Math.abs(points)));
    nextState.feedback = item.label + " was a trap. Keep collecting carefully.";
    return checkCompetitiveCollectorCompletion(config, nextState);
  }

  nextState.correctClicks = nextState.correctClicks + 1;
  nextState.score = nextState.score + Math.max(0, points);
  nextState.feedback = "+" + Math.max(0, points) + " " + config.resourceName + " from " + item.label + ".";

  return checkCompetitiveCollectorCompletion(config, nextState);
}

export function buyCompetitiveUpgrade(config, state, upgradeId) {
  var upgrade = readUpgrade(config.upgrades, upgradeId);
  var nextState = cloneState(state);
  var count = upgrade ? readUpgradeCount(nextState, upgrade.id) : 0;
  var cost = upgrade ? calculateUpgradeCost(upgrade, count) : 0;

  if (!upgrade || nextState.completed || !config.settings.allowUpgrades || nextState.score < cost) {
    return nextState;
  }

  nextState.score = nextState.score - cost;
  nextState.upgradeCounts[upgrade.id] = count + 1;
  nextState.pointsPerSecond = calculatePointsPerSecond(config.upgrades, nextState.upgradeCounts);
  nextState.feedback = upgrade.name + " is producing +" + upgrade.pointsPerSecond + " " + config.resourceName + " per second.";

  return checkCompetitiveCollectorCompletion(config, nextState);
}

export function tickCompetitiveCollector(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  if (nextState.pointsPerSecond > 0) {
    nextState.score = nextState.score + nextState.pointsPerSecond;
  }

  if (hasTimer(config)) {
    nextState.timeLeft = Math.max(0, nextState.timeLeft - 1);
  }

  return checkCompetitiveCollectorCompletion(config, nextState);
}

export function checkCompetitiveCollectorCompletion(config, state) {
  var nextState = cloneState(state);
  var reachedTarget = nextState.score >= config.targetScore;
  var timeExpired = hasTimer(config) && nextState.timeLeft <= 0;

  if (nextState.completed) {
    return nextState;
  }

  if (config.completionRule === "target-score" && reachedTarget) {
    nextState.completed = true;
    nextState.completionReason = "target-score";
  } else if (config.completionRule === "time-limit" && timeExpired) {
    nextState.completed = true;
    nextState.completionReason = "time-limit";
  } else if (config.completionRule === "target-score-or-time" && (reachedTarget || timeExpired)) {
    nextState.completed = true;
    nextState.completionReason = reachedTarget ? "target-score" : "time-limit";
  }

  if (nextState.completed) {
    nextState.score = Math.max(0, Math.round(nextState.score));
    nextState.feedback = nextState.completionReason === "target-score"
      ? "Target reached. Great collecting."
      : "Time is up. Nice effort.";
  }

  return nextState;
}

export function createCompetitiveCollectorResults(config, state) {
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var progressPercent = calculateTargetProgress(config, state);
  var stars = calculateCollectorStars(progressPercent);
  var summary = createGamificationSummary({
    correctAnswers: state.correctClicks,
    totalAnswers: Math.max(state.clicks, state.correctClicks),
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Competitive Collector",
    message: readCollectorMessage(stars, state.completionReason)
  });

  summary.accuracy = progressPercent;
  summary.stars = stars;
  summary.perfect = stars === 3;

  return {
    summary: summary,
    stats: {
      score: state.score,
      targetScore: config.targetScore,
      resourceName: config.resourceName,
      progressPercent: progressPercent,
      correctClicks: state.correctClicks,
      wrongClicks: state.wrongClicks,
      totalClicks: state.clicks,
      completionTimeSeconds: completionTimeSeconds,
      completionReason: state.completionReason,
      gameMode: config.gameMode,
      pointsPerSecond: state.pointsPerSecond
    }
  };
}

export function calculateUpgradeCost(upgrade, count) {
  var safeCount = Number.isFinite(Number(count)) ? Number(count) : 0;
  var baseCost = Number.isFinite(Number(upgrade.baseCost)) ? Number(upgrade.baseCost) : 50;
  var multiplier = Number.isFinite(Number(upgrade.costMultiplier)) ? Number(upgrade.costMultiplier) : 1.5;

  return Math.max(1, Math.round(baseCost * Math.pow(multiplier, safeCount)));
}

export function calculateTargetProgress(config, state) {
  if (!config.targetScore || config.targetScore <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((state.score / config.targetScore) * 100)));
}

export function createLeaderboardRows(config, state) {
  var rows = [{
    name: "You",
    score: Math.round(state.score),
    current: true
  }];

  config.rivals.forEach(function (rival, index) {
    var rivalScore = Math.max(0, Math.round(config.targetScore * (0.36 + (index * 0.12)) + (state.score * (0.1 + (index * 0.04)))));
    rows.push({
      name: rival,
      score: rivalScore,
      current: false
    });
  });

  rows.sort(function (first, second) {
    return second.score - first.score;
  });

  return rows;
}

function calculateCollectorStars(progressPercent) {
  if (progressPercent >= 100) {
    return 3;
  }

  if (progressPercent >= 75) {
    return 2;
  }

  if (progressPercent >= 50) {
    return 1;
  }

  return 0;
}

function hasTimer(config) {
  return config.timeLimitSeconds > 0 && (config.completionRule === "time-limit" || config.completionRule === "target-score-or-time");
}

function readCollectible(items, itemId) {
  return items.find(function (item) {
    return item.id === itemId;
  }) || null;
}

function readUpgrade(upgrades, upgradeId) {
  return upgrades.find(function (upgrade) {
    return upgrade.id === upgradeId;
  }) || null;
}

function readUpgradeCount(state, upgradeId) {
  return Number(state.upgradeCounts[upgradeId] || 0);
}

function calculatePointsPerSecond(upgrades, upgradeCounts) {
  var total = 0;

  upgrades.forEach(function (upgrade) {
    total = total + (Number(upgrade.pointsPerSecond || 0) * Number(upgradeCounts[upgrade.id] || 0));
  });

  return Math.round(total * 100) / 100;
}

function cloneState(state) {
  return Object.assign({}, state, {
    upgradeCounts: Object.assign({}, state.upgradeCounts)
  });
}

function readCollectorMessage(stars, reason) {
  if (stars === 3 && reason === "target-score") {
    return "Excellent work. You reached the collector target.";
  }

  if (stars >= 2) {
    return "Strong collecting. You built real momentum.";
  }

  if (stars === 1) {
    return "Good effort. Keep collecting to improve your score.";
  }

  return "Keep practicing. Try upgrades and high-value items next time.";
}

function readModeNotice(gameMode) {
  if (gameMode === "avoid-the-trap") {
    return "Avoid the Trap uses the collector engine with incorrect items as traps.";
  }

  if (gameMode === "boss-challenge") {
    return "Boss Challenge is using the collector engine foundation with target score progression.";
  }

  return "";
}
