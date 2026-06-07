import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.119-student-dashboard-debug-safe";

export async function processDeleteModule(executionState) {
    const { payload, context } = executionState;
    if (!context.modules || context.modules.length === 0) {
        executionState.result = [];
        return { valid: true };
    }

    const modules = context.modules.filter(function (m) {
        return m.id !== payload.moduleId;
    });

    for (let i = 0; i < modules.length; i++) {
        modules[i].order = i;
        modules[i].isDirty = true;
    }

    executionState.result = modules;
    return { valid: true };
}

