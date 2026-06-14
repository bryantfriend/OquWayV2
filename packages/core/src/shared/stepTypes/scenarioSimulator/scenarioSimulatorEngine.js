import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createScenarioActions, isCorrectScenarioAction } from "./scenarioValidationUtils.js?v=1.1.192-timed-sequence";

export function createScenarioSimulatorState(config) {
  return {
    phase: "start",
    currentIndex: 0,
    currentOptions: [],
    selectedAction: "",
    score: 0,
    correctDecisions: 0,
    incorrectDecisions: 0,
    expiredDecisions: 0,
    feedback: "",
    feedbackState: "",
    timerProgress: 1,
    timerRemainingSeconds: config.timerSeconds,
    completed: false,
    startedAt: Date.now(),
    completionReason: ""
  };
}

export function startScenarioSimulator(config, state) {
  var nextState = cloneState(state);

  nextState.phase = "intro";
  nextState.currentIndex = 0;
  nextState.currentOptions = createScenarioActions(config.scenarios[0]);
  nextState.feedback = "";
  nextState.feedbackState = "";
  nextState.startedAt = Date.now();

  return nextState;
}

export function enterDecisionPhase(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) {
    return nextState;
  }

  nextState.phase = "decision";
  nextState.selectedAction = "";
  nextState.timerProgress = 1;
  nextState.timerRemainingSeconds = config.timerSeconds;

  return nextState;
}

export function updateScenarioTimer(state, timerState) {
  var nextState = cloneState(state);
  var safeTimerState = timerState && typeof timerState === "object" ? timerState : {};

  nextState.timerProgress = Math.max(0, Math.min(1, Number(safeTimerState.progress) || 0));
  nextState.timerRemainingSeconds = Math.max(0, Number(safeTimerState.remainingSeconds) || 0);

  return nextState;
}

export function selectScenarioAction(config, state, action) {
  var nextState = cloneState(state);
  var scenario = readCurrentScenario(config, nextState);
  var correct = scenario ? isCorrectScenarioAction(action, scenario.correctAction) : false;

  if (!scenario || nextState.phase !== "decision" || nextState.completed) {
    return nextState;
  }

  nextState.selectedAction = action;
  nextState.phase = "feedback";

  if (correct) {
    nextState.score = nextState.score + 100 + readFastBonus(config, nextState);
    nextState.correctDecisions = nextState.correctDecisions + 1;
    nextState.feedback = scenario.successFeedback;
    nextState.feedbackState = "correct";
  } else {
    nextState.incorrectDecisions = nextState.incorrectDecisions + 1;
    nextState.feedback = scenario.failureFeedback;
    nextState.feedbackState = "incorrect";
  }

  return nextState;
}

export function expireScenario(config, state) {
  var nextState = cloneState(state);
  var scenario = readCurrentScenario(config, nextState);

  if (!scenario || nextState.phase !== "decision" || nextState.completed) {
    return nextState;
  }

  nextState.phase = "feedback";
  nextState.expiredDecisions = nextState.expiredDecisions + 1;
  nextState.timerProgress = 0;
  nextState.timerRemainingSeconds = 0;
  nextState.feedback = scenario.failureFeedback || "Time expired. Try the next scenario.";
  nextState.feedbackState = "timeout";

  return nextState;
}

export function continueScenario(config, state) {
  var nextState = cloneState(state);
  var nextIndex = nextState.currentIndex + 1;

  if (nextIndex >= config.scenarios.length) {
    nextState.completed = true;
    nextState.phase = "results";
    nextState.completionReason = "all-scenarios-complete";
    return nextState;
  }

  nextState.currentIndex = nextIndex;
  nextState.phase = "intro";
  nextState.currentOptions = createScenarioActions(config.scenarios[nextIndex]);
  nextState.selectedAction = "";
  nextState.feedback = "";
  nextState.feedbackState = "";
  nextState.timerProgress = 1;
  nextState.timerRemainingSeconds = config.timerSeconds;

  return nextState;
}

export function createScenarioSimulatorResults(config, state) {
  var totalScenarios = config.scenarios.length;
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var accuracy = totalScenarios > 0 ? Math.round((state.correctDecisions / totalScenarios) * 100) : 0;
  var summary = createGamificationSummary({
    correctAnswers: state.correctDecisions,
    totalAnswers: totalScenarios,
    completed: true,
    completionTimeSeconds: completionTimeSeconds
  }, {
    activityName: config.title || "Scenario Simulator",
    message: readResultMessage(accuracy)
  });

  summary.accuracy = accuracy;
  summary.stars = readStars(accuracy);
  summary.perfect = accuracy >= 90 && state.correctDecisions === totalScenarios;

  return {
    summary: summary,
    stats: {
      score: state.score,
      totalScenarios: totalScenarios,
      correctDecisions: state.correctDecisions,
      incorrectDecisions: state.incorrectDecisions,
      expiredDecisions: state.expiredDecisions,
      accuracy: accuracy,
      completionTimeSeconds: completionTimeSeconds,
      completionReason: state.completionReason || "all-scenarios-complete"
    }
  };
}

export function readCurrentScenario(config, state) {
  return config.scenarios[state.currentIndex] || null;
}

function readFastBonus(config, state) {
  if (!config || !state || !state.timerProgress) {
    return 0;
  }

  return Math.round(state.timerProgress * 25);
}

function readStars(accuracy) {
  if (accuracy >= 90) {
    return 3;
  }

  if (accuracy >= 70) {
    return 2;
  }

  if (accuracy >= 50) {
    return 1;
  }

  return 0;
}

function readResultMessage(accuracy) {
  if (accuracy >= 90) {
    return "Excellent decisions under pressure.";
  }

  if (accuracy >= 70) {
    return "Good judgment. Keep practicing realistic decisions.";
  }

  if (accuracy >= 50) {
    return "You made some solid decisions. Review the feedback and try again.";
  }

  return "Keep practicing. Slow down, read the situation, and choose carefully.";
}

function cloneState(state) {
  return Object.assign({}, state, {
    currentOptions: Array.isArray(state.currentOptions) ? state.currentOptions.slice() : []
  });
}
