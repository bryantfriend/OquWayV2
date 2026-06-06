import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.81-class-command-center";

export async function processAddStep(executionState) {
    const { payload, context } = executionState;

    const order = (context.steps && context.steps.length > 0)
        ? context.steps.length
        : 0;

    const newStep = {
        id: generateId(),
        type: payload.stepType,
        order: order,
        config: Object.assign({}, context.stepDefinition ? context.stepDefinition.defaultConfig : {}),
        isDraft: true
    };

    executionState.result = newStep;
    return { valid: true };
}

