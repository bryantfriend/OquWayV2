export async function runIntentPipeline(intent, input) {
  var executionState = {
    type: intent.type,
    payload: input && input.payload ? input.payload : {},
    context: input && input.context ? input.context : {},
    result: null,
    errors: [],
    warnings: []
  };

  var stages = [
    ["validate", intent.validate],
    ["normalize", intent.normalize],
    ["addContext", intent.addContext],
    ["authorize", intent.authorize],
    ["process", intent.process],
    ["emit", intent.emit]
  ];
  var index = 0;

  while (index < stages.length) {
    var handlers = Array.isArray(stages[index][1]) ? stages[index][1] : [];
    var handlerIndex = 0;

    while (handlerIndex < handlers.length) {
      var response = await handlers[handlerIndex](executionState);

      if (response && response.valid === false) {
        executionState.errors = executionState.errors.concat(response.errors || []);
        return {
          valid: false,
          stage: stages[index][0],
          state: executionState,
          emitted: executionState.result
        };
      }

      if (response && response.data) {
        executionState.payload = Object.assign({}, executionState.payload, response.data);
      }

      handlerIndex = handlerIndex + 1;
    }

    index = index + 1;
  }

  return {
    valid: executionState.errors.length === 0,
    state: executionState,
    emitted: executionState.result
  };
}
