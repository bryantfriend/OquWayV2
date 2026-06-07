import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.112-student-assignment-error-debug";

export async function catalogCourseFetchByIdProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = context.existingCourse || null;
    return { valid: true };
}

