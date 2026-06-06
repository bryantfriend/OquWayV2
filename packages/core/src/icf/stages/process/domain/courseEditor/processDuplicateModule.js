import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.109-student-assignment-status-fallback";

export async function processDuplicateModule(executionState) {
    const { payload, context } = executionState;
    if (!context.modules || context.modules.length === 0) {
        executionState.result = [];
        return { valid: true };
    }

    const index = context.modules.findIndex(function (m) { return m.id === payload.moduleId; });
    if (index === -1) {
        executionState.result = context.modules;
        return { valid: true };
    }

    const original = context.modules[index];
    const duplicate = Object.assign({}, original, {
        id: generateId(),
        config: Object.assign({}, original.config, {
            title: original.config.title ? (original.config.title + " (Copy)") : "Copy"
        }),
        isDraft: true
    });

    const modules = context.modules.slice();
    modules.splice(index + 1, 0, duplicate);

    for (let i = 0; i < modules.length; i++) {
        modules[i].order = i;
        modules[i].isDirty = true;
    }

    executionState.result = modules;
    return { valid: true };
}

