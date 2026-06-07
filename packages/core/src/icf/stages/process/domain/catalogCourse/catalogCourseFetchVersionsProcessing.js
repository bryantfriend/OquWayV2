import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.117-student-identity-binding";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

