import { createIntent } from "../../../packages/core/src/icf/engine/createIntent.js";
import { runIntentPipeline } from "../../../packages/core/src/icf/engine/runIntentPipeline.js";
import { listIntents } from "../../../packages/core/src/icf/engine/intentRegistry.js";

const outputElement = document.getElementById("output");
const testButton = document.getElementById("testBtn");

if (testButton) {
    testButton.addEventListener("click", runIcfDemoVerification);
}

window.runIcfDemoVerification = runIcfDemoVerification;

export async function runIcfDemoVerification() {
    const report = {
        successCase: await runDemoSuccessCase(),
        emptyStageArrayCase: await runEmptyStageArrayCase(),
        failingValidationCase: await runFailingValidationCase(),
        failingAuthorizationCase: await runFailingAuthorizationCase(),
        existingIntentsLoad: runExistingIntentsLoadCheck()
    };

    console.info("[ICF Demo Verification] Result:", report);
    renderReport(report);
    return report;
}

async function runDemoSuccessCase() {
    const intentResult = createIntent({
        type: "DemoIntent",
        payload: {
            message: "  Hello ICF  "
        },
        actor: {
            id: "demo-user-1",
            role: "ROLE_COURSE_CREATOR"
        },
        meta: {
            createdAt: Date.now(),
            source: "dev-sandbox"
        }
    });

    if (!intentResult.ok) {
        return intentResult;
    }

    return runIntentPipeline(intentResult.definition, intentResult.executionInput);
}

async function runEmptyStageArrayCase() {
    return runIntentPipeline(createEmptyStageDemoDefinition(), {
        payload: {},
        actor: {
            id: "demo-user-1",
            role: "ROLE_COURSE_CREATOR"
        },
        meta: {
            createdAt: Date.now(),
            source: "dev-sandbox"
        }
    });
}

function createEmptyStageDemoDefinition() {
    return {
        type: "EmptyStageArrayDemoIntent",
        validate: [],
        normalize: [],
        addContext: [],
        authorize: [],
        process: [],
        emit: []
    };
}

async function runFailingValidationCase() {
    const intentResult = createIntent({
        type: "DemoIntent",
        payload: {},
        actor: {
            id: "demo-user-1",
            role: "ROLE_COURSE_CREATOR"
        },
        meta: {
            createdAt: Date.now(),
            source: "dev-sandbox"
        }
    });

    if (!intentResult.ok) {
        return intentResult;
    }

    return runIntentPipeline(intentResult.definition, intentResult.executionInput);
}

async function runFailingAuthorizationCase() {
    const intentResult = createIntent({
        type: "DemoIntent",
        payload: {
            message: "Needs authorization failure"
        },
        actor: {
            id: "demo-user-2",
            role: "ROLE_STUDENT"
        },
        meta: {
            createdAt: Date.now(),
            source: "dev-sandbox"
        }
    });

    if (!intentResult.ok) {
        return intentResult;
    }

    return runIntentPipeline(intentResult.definition, intentResult.executionInput);
}

function runExistingIntentsLoadCheck() {
    const intentNames = listIntents();

    return {
        success: intentNames.length > 0,
        count: intentNames.length,
        includesDemoIntent: intentNames.indexOf("DemoIntent") !== -1,
        intentNames: intentNames
    };
}

function renderReport(report) {
    if (!outputElement) {
        return;
    }

    outputElement.textContent = JSON.stringify(report, null, 2);
}
