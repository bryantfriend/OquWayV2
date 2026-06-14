export function applyResourceEffect(status, resource) {
  return clampStatus(Number(status) + Number(resource.statusEffect || 0));
}

export function readMoodState(status) {
  var safeStatus = Number(status);
  if (safeStatus <= 0) { return "inactive"; }
  if (safeStatus <= 20) { return "critical"; }
  if (safeStatus <= 60) { return "worried"; }
  return "happy";
}

export function clampStatus(status) {
  var number = Number(status);
  if (!Number.isFinite(number)) { number = 0; }
  return Math.max(0, Math.min(100, Math.round(number * 100) / 100));
}
