import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js";

export async function processOpenCourseEditor(executionState) {
    const { context } = executionState;

    // The processor's job for this query intent is to format the final payload for the UI store
    const selectedModuleId = (context.modules && context.modules.length > 0)
        ? context.modules[0].id
        : null;

    executionState.result = {
        course: context.course,
        modules: context.modules || [],
        selectedModuleId: selectedModuleId,
        permissions: {
            role: context.actorRole,
            canEdit: true
        }
    };

    return { valid: true };
}

