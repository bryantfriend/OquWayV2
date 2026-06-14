import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";
import {
  calculateTuningStars,
  calculateTuningSync,
  createControlValues
} from "./syncCalculationUtils.js?v=1.1.192-timed-sequence";

export function createTuningChallengeState(config) {
  var userValues = createControlValues(config.controls, {});
  var sync = calculateTuningSync(config.controls, config.targetValues, userValues);

  return {
    userValues: userValues,
    sync: sync,
    bestSync: sync,
    score: Math.round(sync * 10),
    timeLeft: config.timeLimitSeconds,
    holdProgress: 0,
    feedback: "Adjust the controls to match the target.",
    completed: false,
    completionReason: "",
    startedAt: Date.now()
  };
}

export function updateTuningControl(config, state, controlId, value) {
  var nextState = cloneState(state);
  var control = readControl(config.controls, controlId);

  if (!control || nextState.completed) {
    return nextState;
  }

  nextState.userValues[control.id] = clamp(Number(value), control.min, control.max);
  nextState.sync = calculateTuningSync(config.controls, config.targetValues, nextState.userValues);
  nextState.bestSync = Math.max(nextState.bestSync, nextState.sync);
  nextState.score = Math.max(nextState.score, Math.round(nextState.bestSync * 10));
  nextState.feedback = readSyncFeedback(config, nextState.sync);

  if (config.completionRule === "sync-threshold" && nextState.sync >= config.syncThreshold) {
    nextState.completed = true;
    nextState.completionReason = "sync-threshold";
  }

  return nextState;
}

export function tickTuningChallenge(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  nextState.timeLeft = Math.max(0, nextState.timeLeft - 1);

  if (nextState.sync >= config.syncThreshold) {
    nextState.holdProgress = Math.min(config.holdSeconds, nextState.holdProgress + 1);
  } else {
    nextState.holdProgress = 0;
  }

  if (config.completionRule === "sync-hold" && nextState.holdProgress >= config.holdSeconds) {
    nextState.completed = true;
    nextState.completionReason = "sync-hold";
  } else if (config.completionRule === "time-limit" && nextState.timeLeft <= 0) {
    nextState.completed = true;
    nextState.completionReason = "time-limit";
  } else if (nextState.timeLeft <= 0 && config.completionRule !== "sync-threshold") {
    nextState.completed = true;
    nextState.completionReason = "time-limit";
  }

  if (nextState.completed) {
    nextState.feedback = nextState.sync >= config.syncThreshold ? "Signal matched. Great tuning." : "Time is up. Review the target and try again.";
  }

  return nextState;
}

export function createTuningChallengeResults(config, state) {
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var stars = calculateTuningStars(state.bestSync);
  var summary = createGamificationSummary({
    correctAnswers: Math.round(state.bestSync),
    totalAnswers: 100,
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Tuning Challenge",
    message: readTuningMessage(stars)
  });

  summary.accuracy = Math.round(state.bestSync);
  summary.stars = stars;
  summary.perfect = stars === 3 && state.bestSync >= 98;

  return {
    summary: summary,
    stats: {
      finalSync: Math.round(state.sync),
      bestSync: Math.round(state.bestSync),
      score: state.score,
      completionTimeSeconds: completionTimeSeconds,
      completionReason: state.completionReason,
      targetType: config.targetType
    }
  };
}

function readControl(controls, controlId) {
  return controls.find(function (control) {
    return control.id === controlId;
  }) || null;
}

function readSyncFeedback(config, sync) {
  if (sync >= config.syncThreshold) {
    return "Matched. Hold steady.";
  }

  if (sync >= 75) {
    return "Very close. Make small adjustments.";
  }

  if (sync >= 50) {
    return "Getting there. Compare the shapes carefully.";
  }

  return "Keep tuning. Move one control at a time.";
}

function readTuningMessage(stars) {
  if (stars === 3) {
    return "Excellent tuning. Your pattern lined up beautifully.";
  }

  if (stars === 2) {
    return "Strong tuning. You were close to the target.";
  }

  if (stars === 1) {
    return "Good effort. Keep adjusting carefully.";
  }

  return "Try again and focus on one control at a time.";
}

function cloneState(state) {
  return Object.assign({}, state, {
    userValues: Object.assign({}, state.userValues)
  });
}

function clamp(value, min, max) {
  var safeValue = Number.isFinite(value) ? value : min;

  return Math.max(Number(min), Math.min(Number(max), Math.round(safeValue * 100) / 100));
}
