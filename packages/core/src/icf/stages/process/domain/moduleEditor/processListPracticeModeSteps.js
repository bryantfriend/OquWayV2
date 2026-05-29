import { normalizePracticeModes } from "./practiceModeShells.js";

export function processListPracticeModeSteps(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var practiceMode = practiceModes[payload.practiceModeKey];

  executionState.result = practiceMode.steps;
  return { valid: true };
}
