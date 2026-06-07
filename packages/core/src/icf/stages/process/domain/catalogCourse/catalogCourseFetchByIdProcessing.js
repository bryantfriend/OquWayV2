import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.113-student-rules-read";

export async function catalogCourseFetchByIdProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = context.existingCourse || null;
    return { valid: true };
}

