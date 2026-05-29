import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js";

export async function processUpdateStepField(executionState) {
    const { payload, context } = executionState;

    let targetStep = null;
    if (context.steps) {
        for (let i = 0; i < context.steps.length; i++) {
            if (context.steps[i].id === payload.stepId) {
                targetStep = context.steps[i];
                break;
            }
        }
    }

    if (!targetStep) {
        return { valid: false, errors: [{ message: "Step not found in context" }] };
    }

    const stepToUpdate = Object.assign({}, targetStep);
    if (!stepToUpdate.config) {
        stepToUpdate.config = {};
    }

    stepToUpdate.config[payload.fieldKey] = payload.value;
    stepToUpdate.isDirty = true;

    executionState.result = stepToUpdate;
    return { valid: true };
}

