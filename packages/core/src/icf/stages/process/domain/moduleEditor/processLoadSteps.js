export async function processLoadSteps(executionState) {
  var session = executionState.context.session || {};
  var practiceModeKey = executionState.payload.practiceModeKey || "beforeClass";
  var practiceModes = session.practiceModes || {};
  var mode = practiceModes[practiceModeKey] || practiceModes.beforeClass || {};
  var steps = Array.isArray(mode.steps) ? mode.steps.slice() : [];

  steps.sort(function (first, second) {
    return readOrder(first) - readOrder(second);
  });

  executionState.result = {
    course: executionState.context.course,
    module: executionState.context.module,
    session: session,
    practiceModeKey: practiceModeKey,
    steps: steps
  };

  return { valid: true };
}

function readOrder(step) {
  if (step && typeof step.order === "number") {
    return step.order;
  }

  return 0;
}
