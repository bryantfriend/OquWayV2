import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.121-student-dashboard-open-clean";

export async function catalogCourseFetchByIdProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = context.existingCourse || null;
    return { valid: true };
}

