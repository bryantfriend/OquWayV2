import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.110-student-class-alias-query";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

