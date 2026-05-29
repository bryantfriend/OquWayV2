import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js";

export async function processSaveModuleDraft(executionState) {
    const { payload, context } = executionState;
    if (!payload.courseId || !payload.moduleId) {
        return { valid: false, errors: [{ message: "Course or Module payload missing" }] };
    }

    const batch = writeBatch(db);

    // Update steps
    if (payload.steps) {
        for (let i = 0; i < payload.steps.length; i++) {
            const s = payload.steps[i];
            const stepRef = doc(db, "courses", payload.courseId, "modules", payload.moduleId, "steps", s.id || s.stepId);

            const cleanStep = Object.assign({}, s);
            delete cleanStep.isDirty;
            delete cleanStep.id;
            cleanStep.isDraft = true;

            batch.set(stepRef, cleanStep);
        }
    }

    try {
        await batch.commit();
        executionState.result = { success: true, timestamp: Date.now() };
        return { valid: true };
    } catch (e) {
        return { valid: false, errors: [{ message: "Failed to save module draft: " + e.message }] };
    }
}

