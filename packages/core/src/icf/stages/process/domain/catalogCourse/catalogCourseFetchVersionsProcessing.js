import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.63-external-task-student-feedback";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

