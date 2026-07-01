// verifyEngine.js
//
// ICF Engine Verification Runner
//
// Usage from browser console:
//   import("./packages/core/src/icf/dev/verifyEngine.js?v=1.1.82-shared-command-center-shell").then(function (m) { m.verifyEngine(); });
//
// Or call verifyEngine() after importing this module in your app entry point.

import { createIntent } from "../engine/createIntent.js?v=1.1.82-shared-command-center-shell";
import { runIntentPipeline } from "../engine/runIntentPipeline.js?v=1.1.82-shared-command-center-shell";

export async function verifyEngine() {
  console.info("");
  console.info("========================================");
  console.info("  ICF Engine Verification");
  console.info("========================================");
  console.info("");

  const results = [];

  results.push(await runSuccessTest());
  results.push(await runEmptyStagesTest());
  results.push(await runFailedValidationTest());
  results.push(await runFailedAuthorizationTest());
  results.push(runCreateIntentMissingActorTest());
  results.push(runCreateIntentUnregisteredTypeTest());

  console.info("");
  console.info("========================================");
  console.info("  Summary");
  console.info("========================================");

  let passCount = 0;
  let failCount = 0;
  let testIndex = 0;

  while (testIndex < results.length) {
    const entry = results[testIndex];

    if (entry.passed) {
      passCount = passCount + 1;
      console.info("  PASS:", entry.name);
    } else {
      failCount = failCount + 1;
      console.error("  FAIL:", entry.name);
    }

    testIndex = testIndex + 1;
  }

  console.info("");
  console.info("  Passed:", passCount, "/", results.length);

  if (failCount > 0) {
    console.error("  Failed:", failCount);
  }

  console.info("========================================");
  console.info("");

  return results;
}


/* -------------------------------
   TEST 1: Full Pipeline Success
-------------------------------- */

async function runSuccessTest() {
  const testName = "Full Pipeline Success";
  logTestHeader(1, testName);

  const intentResult = createIntent({
    type: "DemoIntent",
    payload: { message: "  Hello ICF  " },
    actor: { id: "test_user_1", role: "ROLE_COURSE_CREATOR" }
  });

  if (!intentResult.ok) {
    logTestResult(testName, false, "createIntent failed", intentResult.errors);
    return { name: testName, passed: false };
  }

  const pipelineResult = await runIntentPipeline(
    intentResult.definition,
    intentResult.executionInput
  );

  const emitted = pipelineResult.emitted;
  logEmitted(emitted);

  const passed = emitted.ok === true
    && emitted.success === true
    && emitted.data !== null
    && emitted.data.resultData
    && emitted.data.resultData.echo === "Hello ICF"
    && emitted.errors.length === 0;

  logTestResult(testName, passed);
  return { name: testName, passed: passed };
}


/* -------------------------------
   TEST 2: Empty Stage Arrays
-------------------------------- */

async function runEmptyStagesTest() {
  const testName = "Empty Stage Arrays";
  logTestHeader(2, testName);

  const emptyDefinition = {
    type: "EmptyDemoIntent",
    validate: [],
    normalize: [],
    addContext: [],
    authorize: [],
    process: [],
    emit: []
  };

  const executionInput = {
    payload: {},
    actor: { id: "test_user_2", role: "ROLE_ADMIN" }
  };

  const pipelineResult = await runIntentPipeline(emptyDefinition, executionInput);
  const emitted = pipelineResult.emitted;
  logEmitted(emitted);

  const passed = emitted.ok === true
    && emitted.success === true
    && emitted.errors.length === 0;

  logTestResult(testName, passed);
  return { name: testName, passed: passed };
}


/* -------------------------------
   TEST 3: Failed Validation
-------------------------------- */

async function runFailedValidationTest() {
  const testName = "Failed Validation";
  logTestHeader(3, testName);

  const intentResult = createIntent({
    type: "DemoIntent",
    payload: {},
    actor: { id: "test_user_3", role: "ROLE_COURSE_CREATOR" }
  });

  if (!intentResult.ok) {
    logTestResult(testName, false, "createIntent failed", intentResult.errors);
    return { name: testName, passed: false };
  }

  const pipelineResult = await runIntentPipeline(
    intentResult.definition,
    intentResult.executionInput
  );

  const emitted = pipelineResult.emitted;
  logEmitted(emitted);

  const hasValidationError = emitted.errors.length > 0
    && emitted.errors[0].stage === "validate";

  const passed = emitted.ok === false
    && emitted.success === false
    && emitted.data === null
    && hasValidationError;

  logTestResult(testName, passed);
  return { name: testName, passed: passed };
}


/* -------------------------------
   TEST 4: Failed Authorization
-------------------------------- */

async function runFailedAuthorizationTest() {
  const testName = "Failed Authorization";
  logTestHeader(4, testName);

  const intentResult = createIntent({
    type: "DemoIntent",
    payload: { message: "Test auth failure" },
    actor: { id: "test_user_4", role: "ROLE_STUDENT" }
  });

  if (!intentResult.ok) {
    logTestResult(testName, false, "createIntent failed", intentResult.errors);
    return { name: testName, passed: false };
  }

  const pipelineResult = await runIntentPipeline(
    intentResult.definition,
    intentResult.executionInput
  );

  const emitted = pipelineResult.emitted;
  logEmitted(emitted);

  const hasAuthError = emitted.errors.length > 0
    && emitted.errors[0].stage === "authorize";

  const passed = emitted.ok === false
    && emitted.success === false
    && emitted.data === null
    && hasAuthError;

  logTestResult(testName, passed);
  return { name: testName, passed: passed };
}


/* -------------------------------
   TEST 5: createIntent Missing Actor
-------------------------------- */

function runCreateIntentMissingActorTest() {
  const testName = "createIntent Missing Actor";
  logTestHeader(5, testName);

  const intentResult = createIntent({
    type: "DemoIntent",
    payload: { message: "Test" }
  });

  console.info("  createIntent result:", JSON.stringify(intentResult, null, 2));

  const hasMissingActorError = intentResult.errors.length > 0
    && intentResult.errors[0].code === "MISSING_ACTOR";

  const passed = intentResult.ok === false
    && intentResult.definition === null
    && hasMissingActorError;

  logTestResult(testName, passed);
  return { name: testName, passed: passed };
}


/* -------------------------------
   TEST 6: Unregistered Intent Type
-------------------------------- */

function runCreateIntentUnregisteredTypeTest() {
  const testName = "Unregistered Intent Type";
  logTestHeader(6, testName);

  const intentResult = createIntent({
    type: "NonExistentIntent",
    payload: {},
    actor: { id: "test_user_6", role: "ROLE_ADMIN" }
  });

  console.info("  createIntent result:", JSON.stringify(intentResult, null, 2));

  const hasRegistrationError = intentResult.errors.length > 0
    && intentResult.errors[0].code === "INTENT_NOT_REGISTERED";

  const passed = intentResult.ok === false
    && intentResult.definition === null
    && hasRegistrationError;

  logTestResult(testName, passed);
  return { name: testName, passed: passed };
}


/* -------------------------------
   LOGGING HELPERS
-------------------------------- */

function logTestHeader(testNumber, testName) {
  console.info("--- Test " + testNumber + ": " + testName + " ---");
}

function logEmitted(emitted) {
  console.info("  Emitted:", JSON.stringify(emitted, null, 2));
}

function logTestResult(testName, passed, reason, details) {
  if (passed) {
    console.info("  PASS:", testName);
  } else {
    console.error("  FAIL:", testName);

    if (reason) {
      console.error("  Reason:", reason);
    }

    if (details) {
      console.error("  Details:", JSON.stringify(details, null, 2));
    }
  }

  console.info("");
}
