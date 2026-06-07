import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.111-student-assignment-debug-panel";

export async function processReorderModules(executionState) {
    const { payload, context } = executionState;
    if (!context.modules || context.modules.length === 0) {
        executionState.result = [];
        return { valid: true };
    }

    const modules = context.modules.slice();
    const item = modules.splice(payload.fromIndex, 1)[0];
    modules.splice(payload.toIndex, 0, item);

    for (let i = 0; i < modules.length; i++) {
        modules[i].order = i;
        modules[i].isDirty = true;
    }

    executionState.result = modules;
    return { valid: true };
}

