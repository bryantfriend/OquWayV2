// createIntent.js

import { getIntentDefinition } from "./intentRegistry.js?v=1.1.119-student-dashboard-debug-safe";

export function createIntent(intentInput) {
  const intentType = readIntentType(intentInput);
  const intentPayload = readIntentPayload(intentInput);
  const actor = readActor(intentInput);
  const meta = readMeta(intentInput);

  const inputErrors = collectInputErrors(intentType, actor);

  if (inputErrors.length > 0) {
    return createFailedIntentResult(inputErrors);
  }

  const intentDefinition = resolveIntentDefinition(intentType);

  if (!intentDefinition) {
    return createFailedIntentResult([
      { code: "INTENT_NOT_REGISTERED", message: "Intent not registered: " + intentType }
    ]);
  }

  return {
    ok: true,
    definition: intentDefinition,
    executionInput: {
      payload: intentPayload,
      actor: actor,
      meta: meta
    },
    errors: []
  };
}


/* -------------------------------
   INPUT READERS
-------------------------------- */

function readIntentType(intentInput) {
  if (!intentInput) {
    return null;
  }

  if (!intentInput.type) {
    return null;
  }

  return intentInput.type;
}

function readIntentPayload(intentInput) {
  if (!intentInput || !intentInput.payload) {
    return {};
  }

  return intentInput.payload;
}

function readActor(intentInput) {
  if (!intentInput) {
    return null;
  }

  if (!intentInput.actor) {
    return null;
  }

  return intentInput.actor;
}

function readMeta(intentInput) {
  if (!intentInput || !intentInput.meta) {
    return {
      createdAt: Date.now(),
      source: "system"
    };
  }

  return {
    createdAt: intentInput.meta.createdAt || Date.now(),
    source: intentInput.meta.source || "system"
  };
}


/* -------------------------------
   VALIDATION
-------------------------------- */

function collectInputErrors(intentType, actor) {
  const errors = [];

  if (!intentType) {
    errors.push({
      code: "MISSING_INTENT_TYPE",
      message: "Intent type is required."
    });
  }

  if (!actor || !actor.id) {
    errors.push({
      code: "MISSING_ACTOR",
      message: "Actor with id is required."
    });
  }

  return errors;
}


/* -------------------------------
   RESOLUTION
-------------------------------- */

function resolveIntentDefinition(intentType) {
  try {
    return getIntentDefinition(intentType);
  } catch (error) {
    return null;
  }
}


/* -------------------------------
   RESULT BUILDERS
-------------------------------- */

function createFailedIntentResult(errors) {
  return {
    ok: false,
    definition: null,
    executionInput: null,
    errors: errors
  };
}
