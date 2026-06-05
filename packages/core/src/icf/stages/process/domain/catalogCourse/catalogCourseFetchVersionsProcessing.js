import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.62-external-task-review-loop";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

