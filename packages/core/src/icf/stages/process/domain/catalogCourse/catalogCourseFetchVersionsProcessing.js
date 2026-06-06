import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.107-student-firebase-auth-chain";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

