import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js";

export async function processValidateCourseStructure(executionState) {
    const { context } = executionState;
    const errors = [];

    if (!context.modules || context.modules.length === 0) {
        errors.push({ field: "modules", message: "Course must have at least one module." });
    }

    if (context.modules) {
        for (let i = 0; i < context.modules.length; i++) {
            const m = context.modules[i];
            if (!m.config || !m.config.title) {
                errors.push({ field: "module[" + i + "].title", message: "Module title is required." });
            }
        }
    }

    if (errors.length > 0) {
        executionState.result = { isValid: false, errors: errors };
    } else {
        executionState.result = { isValid: true, errors: [] };
    }

    return { valid: true };
}

