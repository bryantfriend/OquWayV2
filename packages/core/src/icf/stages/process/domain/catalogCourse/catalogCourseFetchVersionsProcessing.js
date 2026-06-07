import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.114-student-profile-rules";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

