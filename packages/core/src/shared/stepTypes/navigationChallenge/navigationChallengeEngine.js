import { createGamificationSummary } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { hasCollision } from "./collisionUtils.js?v=1.1.192-timed-sequence";
import { updateAvatarMovement } from "./movementUtils.js?v=1.1.192-timed-sequence";

export function createNavigationState(config) {
  return spawnNavigationEntities(config, { avatar: { x: 18, y: 50, vx: 0, vy: 0 }, input: {}, score: 0, timeLeft: config.timeLimitSeconds, entities: [], nextEntityId: 1, collected: 0, destroyed: 0, crashed: false, completed: false, completionReason: "", feedback: "Use arrows, WASD, or touch controls to move.", ticks: 0, startedAt: Date.now() });
}

export function setNavigationInput(state, input) {
  var nextState = cloneState(state);
  nextState.input = Object.assign({}, nextState.input, input);
  return nextState;
}

export function tickNavigation(config, state) {
  var nextState = cloneState(state);

  if (nextState.completed) { return nextState; }

  nextState.ticks = nextState.ticks + 1;
  nextState.timeLeft = Math.max(0, nextState.timeLeft - 1);
  nextState.avatar = updateAvatarMovement(nextState.avatar, nextState.input, config.settings.useInertia);
  nextState.entities = moveEntities(config, nextState);
  nextState = resolveCollisions(config, nextState);
  nextState = spawnNavigationEntities(config, nextState);
  return checkNavigationCompletion(config, nextState);
}

export function fireNavigationAction(config, state) {
  var nextState = cloneState(state);
  var hitIndex = -1;

  if (!config.settings.allowShooting || nextState.completed) { return nextState; }

  hitIndex = nextState.entities.findIndex(function (entity) {
    return entity.kind === "obstacle" && entity.canBeDestroyed && entity.x > nextState.avatar.x && Math.abs(entity.y - nextState.avatar.y) < 14;
  });

  if (hitIndex >= 0) {
    nextState.score = nextState.score + nextState.entities[hitIndex].points;
    nextState.destroyed = nextState.destroyed + 1;
    nextState.feedback = config.actionName + " cleared " + nextState.entities[hitIndex].label + ".";
    nextState.entities.splice(hitIndex, 1);
  } else {
    nextState.feedback = config.actionName + " fired.";
  }

  return checkNavigationCompletion(config, nextState);
}

export function createNavigationResults(config, state) {
  var completionTimeSeconds = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
  var progress = Math.max(0, Math.min(100, Math.round((state.score / config.targetScore) * 100)));
  var stars = state.crashed ? 0 : progress >= 100 || state.completionReason === "survive-time" ? 3 : progress >= 75 ? 2 : progress >= 50 ? 1 : 0;
  var summary = createGamificationSummary({ correctAnswers: state.collected + state.destroyed, totalAnswers: Math.max(1, state.collected + state.destroyed + (state.crashed ? 1 : 0)), completed: true, completionTimeSeconds: completionTimeSeconds }, { activityName: config.title || "Navigation Challenge", message: stars === 3 ? "Excellent navigation. You stayed in control." : "Good effort. Keep practicing your route." });
  summary.accuracy = progress;
  summary.stars = stars;
  summary.perfect = stars === 3;
  return { summary: summary, stats: { score: state.score, targetScore: config.targetScore, collected: state.collected, destroyed: state.destroyed, crashed: state.crashed, completionReason: state.completionReason, completionTimeSeconds: completionTimeSeconds } };
}

function moveEntities(config, state) {
  var speed = config.settings.increaseDifficulty ? Math.min(8, 4 + Math.floor(state.ticks / 20)) : 4;
  return state.entities.map(function (entity) {
    return Object.assign({}, entity, { x: entity.x - speed });
  }).filter(function (entity) {
    return entity.x > -8;
  });
}

function resolveCollisions(config, state) {
  var nextState = cloneState(state);
  nextState.entities = nextState.entities.filter(function (entity) {
    if (!hasCollision(nextState.avatar, entity, entity.kind === "collectible" ? 9 : 10)) { return true; }
    if (entity.kind === "collectible") {
      nextState.score = nextState.score + entity.points;
      nextState.collected = nextState.collected + 1;
      nextState.feedback = "Collected " + entity.label + ".";
      return false;
    }
    nextState.crashed = true;
    nextState.completed = true;
    nextState.completionReason = "crash";
    nextState.feedback = "Collision. Try again with smaller movements.";
    return false;
  });
  return nextState;
}

function spawnNavigationEntities(config, state) {
  var nextState = cloneState(state);
  var interval = config.settings.increaseDifficulty ? Math.max(2, 5 - Math.floor(nextState.ticks / 30)) : 4;
  var source = null;
  var useCollectible = config.settings.allowCollectibles && nextState.nextEntityId % 3 === 0;

  if (nextState.entities.length === 0 || nextState.ticks % interval === 0) {
    source = useCollectible ? config.collectibles[nextState.nextEntityId % config.collectibles.length] : config.obstacles[nextState.nextEntityId % config.obstacles.length];
    nextState.entities.push(Object.assign({}, source, { objectId: String(nextState.nextEntityId), kind: useCollectible ? "collectible" : "obstacle", x: 96, y: 12 + ((nextState.nextEntityId * 29) % 76) }));
    nextState.nextEntityId = nextState.nextEntityId + 1;
  }
  return nextState;
}

function checkNavigationCompletion(config, state) {
  var nextState = cloneState(state);
  if (nextState.completed) { return nextState; }
  if (config.completionRule === "target-score" && nextState.score >= config.targetScore) { nextState.completed = true; nextState.completionReason = "target-score"; }
  else if (config.completionRule === "survive-time" && nextState.timeLeft <= 0) { nextState.completed = true; nextState.completionReason = "survive-time"; }
  else if (config.completionRule === "target-score-or-time" && (nextState.score >= config.targetScore || nextState.timeLeft <= 0)) { nextState.completed = true; nextState.completionReason = nextState.score >= config.targetScore ? "target-score" : "survive-time"; }
  if (nextState.completed) { nextState.entities = []; }
  return nextState;
}

function cloneState(state) {
  return Object.assign({}, state, { avatar: Object.assign({}, state.avatar), input: Object.assign({}, state.input), entities: state.entities.map(function (entity) { return Object.assign({}, entity); }) });
}
