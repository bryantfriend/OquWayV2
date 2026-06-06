import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.108-student-class-alias-merge";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

