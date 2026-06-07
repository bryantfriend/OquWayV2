import { normalizePracticeModes } from "./practiceModeShells.js?v=1.1.112-student-assignment-error-debug";

export function processListPracticeModeSteps(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var practiceMode = practiceModes[payload.practiceModeKey];

  executionState.result = practiceMode.steps;
  return { valid: true };
}
