import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.116-student-token-ready";

export async function catalogCourseFetchByIdProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = context.existingCourse || null;
    return { valid: true };
}

