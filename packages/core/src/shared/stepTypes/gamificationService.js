export var GAMIFICATION_XP = {
  correctAnswer: 5,
  activityComplete: 25,
  perfectBonus: 25
};

export var GAMIFICATION_ACHIEVEMENTS = [
  createAchievement("first-activity", "First Activity", "Complete your first activity."),
  createAchievement("first-perfect-score", "First Perfect Score", "Earn a perfect score on an activity."),
  createAchievement("5-activities-completed", "5 Activities Completed", "Complete 5 activities."),
  createAchievement("10-activities-completed", "10 Activities Completed", "Complete 10 activities.")
];

export function createGamificationSummary(performance, options) {
  var safePerformance = performance && typeof performance === "object" ? performance : {};
  var safeOptions = options && typeof options === "object" ? options : {};
  var correctAnswers = readNonNegativeNumber(safePerformance.correctAnswers, 0);
  var totalAnswers = readNonNegativeNumber(safePerformance.totalAnswers, 0);
  var completed = safePerformance.completed !== false;
  var accuracy = calculateAccuracy(correctAnswers, totalAnswers);
  var stars = calculateStars(accuracy);
  var perfect = totalAnswers > 0 && correctAnswers === totalAnswers;
  var xp = calculateXp({
    correctAnswers: correctAnswers,
    completed: completed,
    perfect: perfect
  });
  var hasAchievementContext = Array.isArray(safeOptions.previousAchievementIds)
    || Object.prototype.hasOwnProperty.call(safeOptions, "completedActivities");
  var completedActivities = readNonNegativeNumber(safeOptions.completedActivities, completed ? 1 : 0);

  return {
    activityName: readString(safeOptions.activityName, "Activity"),
    correctAnswers: correctAnswers,
    totalAnswers: totalAnswers,
    completionTimeSeconds: readNonNegativeNumber(safePerformance.completionTimeSeconds, 0),
    completed: completed,
    accuracy: accuracy,
    stars: stars,
    xpEarned: xp,
    perfect: perfect,
    achievements: hasAchievementContext ? checkAchievementUnlocks({
      completedActivities: completedActivities,
      hasPerfectScore: perfect,
      previousAchievementIds: safeOptions.previousAchievementIds
    }) : [],
    message: readString(safeOptions.message, readEncouragement(accuracy, perfect))
  };
}

export function calculateAccuracy(correctAnswers, totalAnswers) {
  var safeCorrect = readNonNegativeNumber(correctAnswers, 0);
  var safeTotal = readNonNegativeNumber(totalAnswers, 0);

  if (safeTotal <= 0) {
    return 0;
  }

  return Math.round((safeCorrect / safeTotal) * 100);
}

export function calculateStars(accuracy) {
  var safeAccuracy = readNonNegativeNumber(accuracy, 0);

  if (safeAccuracy >= 90) {
    return 3;
  }

  if (safeAccuracy >= 70) {
    return 2;
  }

  if (safeAccuracy >= 50) {
    return 1;
  }

  return 0;
}

export function calculateXp(rewardData) {
  var safeRewardData = rewardData && typeof rewardData === "object" ? rewardData : {};
  var correctAnswers = readNonNegativeNumber(safeRewardData.correctAnswers, 0);
  var total = correctAnswers * GAMIFICATION_XP.correctAnswer;

  if (safeRewardData.completed !== false) {
    total = total + GAMIFICATION_XP.activityComplete;
  }

  if (safeRewardData.perfect === true) {
    total = total + GAMIFICATION_XP.perfectBonus;
  }

  return total;
}

export function updateStreak(currentStreak, correct) {
  if (!correct) {
    return {
      streak: 0,
      milestone: null
    };
  }

  var nextStreak = readNonNegativeNumber(currentStreak, 0) + 1;

  return {
    streak: nextStreak,
    milestone: readStreakMilestone(nextStreak)
  };
}

export function readStreakMilestone(streak) {
  if (streak === 10) {
    return "Amazing!";
  }

  if (streak === 5) {
    return "Great Job!";
  }

  if (streak === 3) {
    return "Nice Streak!";
  }

  return null;
}

export function checkAchievementUnlocks(options) {
  var safeOptions = options && typeof options === "object" ? options : {};
  var previousIds = Array.isArray(safeOptions.previousAchievementIds) ? safeOptions.previousAchievementIds : [];
  var completedActivities = readNonNegativeNumber(safeOptions.completedActivities, 0);
  var hasPerfectScore = safeOptions.hasPerfectScore === true;
  var unlocked = [];

  maybeAddAchievement(unlocked, previousIds, "first-activity", completedActivities >= 1);
  maybeAddAchievement(unlocked, previousIds, "first-perfect-score", hasPerfectScore);
  maybeAddAchievement(unlocked, previousIds, "5-activities-completed", completedActivities >= 5);
  maybeAddAchievement(unlocked, previousIds, "10-activities-completed", completedActivities >= 10);

  return unlocked;
}

export function renderActivityResults(summary) {
  var safeSummary = summary && typeof summary === "object" ? summary : createGamificationSummary({});
  var html = "";

  html += '<div class="activity-results-card">';
  html += '<div class="activity-results-celebration">' + renderCelebration(safeSummary.perfect ? "perfect" : "complete") + '</div>';
  html += '<div class="activity-results-heading">';
  html += '<strong>' + escapeHtml(safeSummary.activityName) + '</strong>';
  html += '<span>' + escapeHtml(safeSummary.message) + '</span>';
  html += '</div>';
  html += '<div class="activity-results-score">' + safeSummary.accuracy + '%</div>';
  html += '<div class="activity-results-stars" aria-label="' + safeSummary.stars + ' stars">' + renderStars(safeSummary.stars) + '</div>';
  html += '<div class="activity-results-grid">';
  html += renderResultMetric("Correct", safeSummary.correctAnswers + " / " + safeSummary.totalAnswers);
  html += renderResultMetric("XP Earned", "+" + safeSummary.xpEarned);
  html += renderResultMetric("Accuracy", safeSummary.accuracy + "%");
  html += '</div>';
  if (safeSummary.achievements.length > 0) {
    html += '<div class="activity-results-achievements">';
    html += '<span>Achievements</span>';
    safeSummary.achievements.forEach(function (achievement) {
      html += '<strong>' + escapeHtml(achievement.name) + '</strong>';
    });
    html += '</div>';
  }
  html += '</div>';

  return html;
}

export function renderCelebration(kind) {
  var safeKind = readString(kind, "complete");
  var label = "Activity Complete";

  if (safeKind === "correct") {
    label = "Correct Answer";
  } else if (safeKind === "incorrect") {
    label = "Keep Going";
  } else if (safeKind === "perfect") {
    label = "Perfect Score";
  } else if (safeKind === "checkpoint") {
    label = "Checkpoint Reached";
  }

  return '<span class="activity-celebration activity-celebration-' + escapeHtml(safeKind) + '">' + escapeHtml(label) + '</span>';
}

export function renderStars(stars) {
  var safeStars = Math.max(0, Math.min(readNonNegativeNumber(stars, 0), 3));
  var html = "";
  var index = 0;

  while (index < 3) {
    html += '<span class="' + (index < safeStars ? "is-earned" : "is-empty") + '">' + (index < safeStars ? "&#9733;" : "&#9734;") + '</span>';
    index = index + 1;
  }

  return html;
}

function renderResultMetric(label, value) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}

function maybeAddAchievement(unlocked, previousIds, id, shouldUnlock) {
  var achievement = null;

  if (!shouldUnlock || previousIds.indexOf(id) !== -1) {
    return;
  }

  achievement = readAchievement(id);
  if (achievement) {
    unlocked.push(achievement);
  }
}

function readAchievement(id) {
  var index = 0;

  while (index < GAMIFICATION_ACHIEVEMENTS.length) {
    if (GAMIFICATION_ACHIEVEMENTS[index].id === id) {
      return Object.assign({}, GAMIFICATION_ACHIEVEMENTS[index]);
    }
    index = index + 1;
  }

  return null;
}

function createAchievement(id, name, description) {
  return {
    id: id,
    name: name,
    description: description
  };
}

function readEncouragement(accuracy, perfect) {
  if (perfect) {
    return "Perfect work. Every answer landed.";
  }

  if (accuracy >= 90) {
    return "Excellent work. You are very close to perfect.";
  }

  if (accuracy >= 70) {
    return "Nice job. Your understanding is growing.";
  }

  if (accuracy >= 50) {
    return "Good effort. Keep practicing and it will click.";
  }

  return "Keep going. Review the feedback and try again.";
}

function readNonNegativeNumber(value, fallbackValue) {
  var number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return fallbackValue;
  }

  return Math.round(number);
}

function readString(value, fallbackValue) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return fallbackValue;
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
