import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.117-student-identity-binding";

export async function processAddModule(executionState) {
    const { payload, context } = executionState;

    // Determine new order index
    const order = (context.modules && context.modules.length > 0)
        ? context.modules.length
        : 0;

    const newModule = {
        id: generateId(),
        type: payload.stepType,
        order: order,
        config: Object.assign({}, context.stepDefinition ? context.stepDefinition.defaultConfig : {}),
        isDraft: true // Marked as draft locally until saved
    };

    executionState.result = newModule;
    return { valid: true };
}

