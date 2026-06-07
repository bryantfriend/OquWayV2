import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.110-student-class-alias-query";

export async function catalogCourseFetchByIdProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = context.existingCourse || null;
    return { valid: true };
}

