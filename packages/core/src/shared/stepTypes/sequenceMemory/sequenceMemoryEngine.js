import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createRandomSequence, isCorrectSequenceInput } from "./sequenceValidationUtils.js?v=1.1.192-timed-sequence";

export function createSequenceMemoryState(config) {
  return {
    phase: "start",
    sequence: [],
    playerIndex: 0,
    currentLength: config.startingSequenceLength,
    maxLength: config.maximumSequenceLength,
    score: 0,
    mistakes: 0,
    completedLevels: 0,
    elapsedSeconds: 0,
    activePadId: "",
    feedback: "",
    feedbackState: "",
    completed: false,
    startedAt: Date.now()
  };
}

export function startSequenceMemory(config, state) {
  var nextState = cloneState(state);

  nextState.phase = "showing";
  nextState.currentLength = config.startingSequenceLength;
  nextState.maxLength = config.maximumSequenceLength;
  nextState.sequence = createRandomSequence(config.pads, nextState.currentLength);
  nextState.playerIndex = 0;
  nextState.score = 0;
  nextState.mistakes = 0;
  nextState.completedLevels = 0;
  nextState.elapsedSeconds = 0;
  nextState.feedback = "";
  nextState.feedbackState = "";
  nextState.completed = false;
  nextState.startedAt = Date.now();

  return nextState;
}

export function beginSequencePlayback(state) {
  var nextState = cloneState(state);

  nextState.phase = "showing";
  nextState.playerIndex = 0;
  nextState.activePadId = "";
  nextState.feedback = "Watch the pattern.";
  nextState.feedbackState = "watching";

  return nextState;
}

export function endSequencePlayback(state) {
  var nextState = cloneState(state);

  nextState.phase = "input";
  nextState.activePadId = "";
  nextState.feedback = "Your turn. Repeat the pattern.";
  nextState.feedbackState = "input";

  return nextState;
}

export function selectSequencePad(config, state, padId) {
  var nextState = cloneState(state);

  if (nextState.phase !== "input" || nextState.completed) {
    return nextState;
  }

  if (!isCorrectSequenceInput(nextState.sequence, nextState.playerIndex, padId)) {
    nextState.phase = "feedback";
    nextState.playerIndex = 0;
    nextState.mistakes = nextState.mistakes + 1;
    nextState.feedback = "Not quite. Watch the pattern again and retry.";
    nextState.feedbackState = "incorrect";
    return nextState;
  }

  nextState.playerIndex = nextState.playerIndex + 1;

  if (nextState.playerIndex >= nextState.sequence.length) {
    nextState.score = nextState.score + 100;
    nextState.completedLevels = nextState.completedLevels + 1;

    if (nextState.currentLength >= config.maximumSequenceLength) {
      nextState.completed = true;
      nextState.phase = "results";
      nextState.feedback = "Sequence complete.";
      nextState.feedbackState = "complete";
      return nextState;
    }

    nextState.phase = "feedback";
    nextState.feedback = "Correct. The next pattern is one step longer.";
    nextState.feedbackState = "correct";
    return nextState;
  }

  nextState.feedback = "Good. Keep going.";
  nextState.feedbackState = "input";

  return nextState;
}

export function continueSequenceMemory(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  if (nextState.feedbackState === "correct") {
    nextState.currentLength = Math.min(config.maximumSequenceLength, nextState.currentLength + 1);
    nextState.sequence = createRandomSequence(config.pads, nextState.currentLength);
  }

  nextState.phase = "showing";
  nextState.playerIndex = 0;
  nextState.activePadId = "";
  nextState.feedback = "";
  nextState.feedbackState = "";

  return nextState;
}

export function createSequenceMemoryResults(config, state) {
  var completed = state.completed === true;
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var stars = readStars(completed, state.mistakes);
  var totalLevels = Math.max(1, config.maximumSequenceLength - config.startingSequenceLength + 1);
  var accuracy = completed ? 100 : Math.round((state.completedLevels / totalLevels) * 100);
  var summary = createGamificationSummary({
    correctAnswers: state.completedLevels,
    totalAnswers: totalLevels,
    completed: completed,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Sequence Memory",
    message: readResultMessage(completed, state.mistakes)
  });

  summary.accuracy = accuracy;
  summary.stars = stars;
  summary.perfect = completed && state.mistakes <= 1;

  return {
    summary: summary,
    stats: {
      score: state.score,
      completedLevels: state.completedLevels,
      totalLevels: totalLevels,
      mistakes: state.mistakes,
      longestSequence: state.currentLength,
      maximumSequenceLength: config.maximumSequenceLength,
      accuracy: accuracy,
      completionTimeSeconds: completionTimeSeconds
    }
  };
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
    return "Keep practicing. Watch carefully and repeat the pattern.";
  }

  if (mistakes <= 1) {
    return "Excellent focus. You completed the full sequence with very few mistakes.";
  }

  if (mistakes <= 3) {
    return "Great pattern work. Your memory and sequencing are getting stronger.";
  }

  return "You completed the sequence. Keep practicing for a cleaner run.";
}

function cloneState(state) {
  return Object.assign({}, state, {
    sequence: Array.isArray(state.sequence) ? state.sequence.slice() : []
  });
}
