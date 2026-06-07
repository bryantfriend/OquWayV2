import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.117-student-identity-binding";

export async function processUpdateModuleField(executionState) {
    const { payload, context } = executionState;

    // We expect the frontend to pass moduleId, fieldKey, and value
    const moduleToUpdate = Object.assign({}, context.module);

    // Ensure config exists
    if (!moduleToUpdate.config) {
        moduleToUpdate.config = {};
    }

    // Apply nested field update to config
    moduleToUpdate.config[payload.fieldKey] = payload.value;
    moduleToUpdate.isDirty = true; // Flag for UI to show unsaved changes

    executionState.result = moduleToUpdate;
    return { valid: true };
}

