import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.113-student-rules-read";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

