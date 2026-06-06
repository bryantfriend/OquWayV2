import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.79-user-command-center";

export async function catalogCourseFetchByIdProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = context.existingCourse || null;
    return { valid: true };
}

