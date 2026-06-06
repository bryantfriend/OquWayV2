import { readPracticeModeProgress } from "./studentProgressHelpers.js?v=1.1.104-student-assignment-json-trace";

export function processStartPracticeMode(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModeKey = payload.practiceModeKey || "beforeClass";
  var practiceMode = session.practiceModes[practiceModeKey];

  executionState.result = {
    course: executionState.context.course,
    module: executionState.context.module,
    session: session,
    practiceModeKey: practiceModeKey,
    practiceMode: practiceMode,
    progress: executionState.context.progress,
    practiceModeProgress: readPracticeModeProgress(executionState.context.progress, practiceModeKey)
  };

  return { valid: true };
}
