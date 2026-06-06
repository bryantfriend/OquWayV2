import { normalizePracticeModes } from "./practiceModeShells.js?v=1.1.109-student-assignment-status-fallback";

export function processListPracticeModeSteps(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var practiceMode = practiceModes[payload.practiceModeKey];

  executionState.result = practiceMode.steps;
  return { valid: true };
}
