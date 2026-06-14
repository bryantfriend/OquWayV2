import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { applyResourceEffect, clampStatus, readMoodState } from "./resourceEffectUtils.js?v=1.1.192-timed-sequence";

export function createCareSimulatorState(config) {
  return {
    status: clampStatus(config.startingStatus),
    timeLeft: config.timeLimitSeconds,
    consumed: 0,
    correctResources: 0,
    wrongResources: 0,
    selectedResourceId: "",
    mood: readMoodState(config.startingStatus),
    feedback: "Choose a helpful resource for " + config.characterName + ".",
    completed: false,
    completionReason: "",
    startedAt: Date.now()
  };
}

export function selectCareResource(state, resourceId) {
  return Object.assign({}, state, { selectedResourceId: resourceId });
}

export function applyCareResource(config, state, resourceId) {
  var nextState = Object.assign({}, state);
  var resource = readResource(config.resources, resourceId || state.selectedResourceId);

  if (!resource || nextState.completed) { return nextState; }

  if (config.gameMode === "resource-matching" && resource.type !== "helpful") {
    nextState.status = clampStatus(nextState.status - Math.abs(resource.statusEffect || 15));
    nextState.wrongResources = nextState.wrongResources + 1;
    nextState.feedback = resource.label + " did not help. Try a better match.";
  } else {
    nextState.status = applyResourceEffect(nextState.status, resource);
    if (resource.type === "helpful") {
      nextState.correctResources = nextState.correctResources + 1;
      nextState.feedback = resource.label + " helped " + config.characterName + ".";
    } else {
      nextState.wrongResources = nextState.wrongResources + 1;
      nextState.feedback = "That resource made things harder. Try a helpful one.";
    }
  }

  nextState.consumed = nextState.consumed + 1;
  nextState.selectedResourceId = "";
  nextState.mood = readMoodState(nextState.status);
  return checkCareCompletion(config, nextState);
}

export function tickCareSimulator(config, state) {
  var nextState = Object.assign({}, state);

  if (nextState.completed) { return nextState; }

  nextState.timeLeft = Math.max(0, nextState.timeLeft - 1);
  nextState.status = clampStatus(nextState.status - config.settings.statusDecayRate);
  nextState.mood = readMoodState(nextState.status);
  if (nextState.status <= 0) {
    nextState.completed = true;
    nextState.completionReason = "inactive";
    nextState.feedback = config.characterName + " needs help. Try again with helpful resources.";
    return nextState;
  }

  return checkCareCompletion(config, nextState);
}

export function createCareSimulatorResults(config, state) {
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var stars = state.status >= 80 ? 3 : state.status >= 60 ? 2 : state.status >= 30 ? 1 : 0;
  var summary = createGamificationSummary({ correctAnswers: state.correctResources, totalAnswers: Math.max(1, state.consumed), completed: true, completionTimeSeconds: completionTimeSeconds }, { activityName: config.title || "Care Simulator", message: stars >= 2 ? "Great care. You kept the status healthy." : "Keep practicing. Choose resources that help the status." });
  summary.accuracy = Math.round(state.status);
  summary.stars = stars;
  summary.perfect = stars === 3;
  return { summary: summary, stats: { status: Math.round(state.status), consumed: state.consumed, correctResources: state.correctResources, wrongResources: state.wrongResources, mood: state.mood, completionReason: state.completionReason, completionTimeSeconds: completionTimeSeconds } };
}

function checkCareCompletion(config, state) {
  var nextState = Object.assign({}, state);
  if (nextState.completed) { return nextState; }
  if (config.completionRule === "reach-status" && nextState.status >= config.targetStatus) { nextState.completed = true; nextState.completionReason = "reach-status"; }
  else if (config.completionRule === "resource-count" && nextState.correctResources >= 5) { nextState.completed = true; nextState.completionReason = "resource-count"; }
  else if ((config.completionRule === "maintain-status" || config.completionRule === "time-played") && nextState.timeLeft <= 0) { nextState.completed = true; nextState.completionReason = config.completionRule; }
  return nextState;
}

function readResource(resources, id) {
  return resources.find(function (resource) { return resource.id === id; }) || null;
}
