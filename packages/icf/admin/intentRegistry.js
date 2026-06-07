import { runIntentPipeline } from "./runIntentPipeline.js?v=1.1.111-student-assignment-debug-panel";

var intents = {};

export function registerIntent(intent) {
  intents[intent.type] = intent;
}

export function registerIntentDefinitions(registrars) {
  var index = 0;

  while (index < registrars.length) {
    registrars[index](registerIntent);
    index = index + 1;
  }
}

export function getIntent(type) {
  return intents[type] || null;
}

export function listIntents() {
  return Object.keys(intents);
}

export function runAdminIntent(type, payload, context) {
  var intent = getIntent(type);

  if (!intent) {
    return Promise.resolve({
      valid: false,
      emitted: null,
      state: {
        errors: [{ code: "INTENT_NOT_FOUND", message: "Unknown admin intent: " + type }]
      }
    });
  }

  return runIntentPipeline(intent, {
    payload: payload || {},
    context: context || {}
  });
}
