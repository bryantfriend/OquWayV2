import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createTimedSequence, isCorrectTimedSequenceInput } from "./timedSequenceValidationUtils.js?v=1.1.192-timed-sequence";

export function createTimedSequenceState(config) {
  return {
    phase: "start",
    level: 1,
    score: 0,
    timeRemaining: config.startingTimeSeconds,
    timerProgress: 1,
    sequence: [],
    playerIndex: 0,
    mistakes: 0,
    levelsCompleted: 0,
    glitchesDismissed: 0,
    glitchActive: false,
    completed: false,
    gameOver: false,
    feedback: "",
    feedbackState: "",
    startedAt: Date.now()
  };
}

export function startTimedSequence(config, state) {
  var nextState = cloneState(state);

  nextState.phase = "playing";
  nextState.level = 1;
  nextState.score = 0;
  nextState.mistakes = 0;
  nextState.levelsCompleted = 0;
  nextState.glitchesDismissed = 0;
  nextState.completed = false;
  nextState.gameOver = false;
  nextState.startedAt = Date.now();

  return prepareLevel(config, nextState);
}

export function selectTimedSequenceItem(config, state, itemId) {
  var nextState = cloneState(state);
  var correct = isCorrectTimedSequenceInput(nextState.sequence, nextState.playerIndex, itemId);

  if (nextState.phase !== "playing" || nextState.completed || nextState.gameOver || nextState.glitchActive) {
    return nextState;
  }

  if (!correct) {
    nextState.mistakes = nextState.mistakes + 1;
    nextState.gameOver = true;
    nextState.phase = "failure";
    nextState.feedback = "Wrong item. Review the required order and try again.";
    nextState.feedbackState = "failure";
    return nextState;
  }

  nextState.playerIndex = nextState.playerIndex + 1;
  nextState.feedback = "Correct. Keep going.";
  nextState.feedbackState = "correct";

  if (nextState.playerIndex >= nextState.sequence.length) {
    return completeTimedSequenceLevel(config, nextState);
  }

  if (shouldTriggerGlitch(config, nextState)) {
    nextState.glitchActive = true;
    nextState.feedback = "Glitch detected. Dismiss it before continuing.";
    nextState.feedbackState = "glitch";
  }

  return nextState;
}

export function dismissTimedSequenceGlitch(state) {
  var nextState = cloneState(state);

  if (!nextState.glitchActive) {
    return nextState;
  }

  nextState.glitchActive = false;
  nextState.glitchesDismissed = nextState.glitchesDismissed + 1;
  nextState.feedback = "Glitch cleared. Continue the sequence.";
  nextState.feedbackState = "correct";

  return nextState;
}

export function updateTimedSequenceTimer(state, timerState) {
  var nextState = cloneState(state);
  var safeTimerState = timerState && typeof timerState === "object" ? timerState : {};

  nextState.timeRemaining = Math.max(0, Number(safeTimerState.remainingSeconds) || 0);
  nextState.timerProgress = Math.max(0, Math.min(1, Number(safeTimerState.progress) || 0));

  return nextState;
}

export function expireTimedSequence(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed || nextState.gameOver || nextState.phase !== "playing") {
    return nextState;
  }

  nextState.timeRemaining = 0;
  nextState.timerProgress = 0;
  nextState.gameOver = true;
  nextState.phase = "failure";
  nextState.feedback = "Time ran out. Retry this challenge.";
  nextState.feedbackState = "failure";
  nextState.mistakes = nextState.mistakes + 1;

  return nextState;
}

export function retryTimedSequence(config, state) {
  var nextState = cloneState(state);

  nextState.gameOver = false;
  nextState.glitchActive = false;
  nextState.feedback = "";
  nextState.feedbackState = "";

  return prepareLevel(config, nextState);
}

export function continueTimedSequence(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  nextState.level = nextState.level + 1;
  return prepareLevel(config, nextState);
}

export function createTimedSequenceResults(config, state) {
  var completed = state.completed === true;
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var accuracy = state.levelsCompleted + state.mistakes > 0
    ? Math.round((state.levelsCompleted / (state.levelsCompleted + state.mistakes)) * 100)
    : 0;
  var stars = readStars(completed, state.mistakes);
  var summary = createGamificationSummary({
    correctAnswers: state.levelsCompleted,
    totalAnswers: Math.max(config.requiredLevels, state.levelsCompleted + state.mistakes),
    completed: completed,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Timed Sequence Challenge",
    message: readResultMessage(completed, state.mistakes)
  });

  summary.accuracy = accuracy;
  summary.stars = stars;
  summary.perfect = completed && state.mistakes <= 1;

  return {
    summary: summary,
    stats: {
      score: state.score,
      levelsCompleted: state.levelsCompleted,
      requiredLevels: config.requiredLevels,
      mistakes: state.mistakes,
      glitchesDismissed: state.glitchesDismissed,
      accuracy: accuracy,
      completionTimeSeconds: completionTimeSeconds
    }
  };
}

function prepareLevel(config, state) {
  var nextState = cloneState(state);
  var sequenceLength = readLevelSequenceLength(config, nextState.level);

  nextState.phase = "playing";
  nextState.sequence = createTimedSequence(config.sequenceItems, sequenceLength, nextState.level);
  nextState.playerIndex = 0;
  nextState.glitchActive = false;
  nextState.timeRemaining = readLevelTime(config, nextState.level);
  nextState.timerProgress = 1;
  nextState.feedback = "Follow the guide in order.";
  nextState.feedbackState = "playing";

  return nextState;
}

function completeTimedSequenceLevel(config, state) {
  var nextState = cloneState(state);
  var timeBonus = Math.max(0, nextState.timeRemaining) * 10;

  nextState.levelsCompleted = nextState.levelsCompleted + 1;
  nextState.score = nextState.score + (100 * nextState.level) + timeBonus;
  nextState.feedback = "Level complete. Score increased.";
  nextState.feedbackState = "complete";

  if (isCompletionMet(config, nextState)) {
    nextState.completed = true;
    nextState.phase = "results";
    return nextState;
  }

  nextState.phase = "level-complete";
  return nextState;
}

function isCompletionMet(config, state) {
  if (config.completionRule === "reach-score") {
    return state.score >= config.targetScore;
  }

  if (config.completionRule === "survive-time") {
    return state.levelsCompleted >= config.requiredLevels;
  }

  return state.levelsCompleted >= config.requiredLevels;
}

function readLevelTime(config, level) {
  if (!config.difficultyIncrease) {
    return config.startingTimeSeconds;
  }

  return Math.max(config.minimumTimeSeconds, config.startingTimeSeconds - Math.max(0, level - 1));
}

function readLevelSequenceLength(config, level) {
  if (!config.difficultyIncrease) {
    return config.startingSequenceLength;
  }

  return Math.min(config.maximumSequenceLength, config.startingSequenceLength + Math.floor((level - 1) / 2));
}

function shouldTriggerGlitch(config, state) {
  var chance = Math.min(0.8, 0.12 + (state.level - 1) * 0.06);

  return config.glitchesEnabled && state.playerIndex > 0 && state.playerIndex < state.sequence.length && Math.random() < chance;
}

function readStars(completed, mistakes) {
  if (!completed) {
    return 0;
  }

  if (mistakes <= 1) {
    return 3;
  }

  if (mistakes <= 3) {
    return 2;
  }

  return 1;
}

function readResultMessage(completed, mistakes) {
  if (!completed) {
    return "Keep practicing the order. Accuracy matters under pressure.";
  }

  if (mistakes <= 1) {
    return "Excellent sequence control under pressure.";
  }

  if (mistakes <= 3) {
    return "Strong work. Your process accuracy is improving.";
  }

  return "You completed the challenge. Keep practicing for a cleaner run.";
}

function cloneState(state) {
  return Object.assign({}, state, {
    sequence: Array.isArray(state.sequence) ? state.sequence.slice() : []
  });
}
