import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.116-student-token-ready";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

