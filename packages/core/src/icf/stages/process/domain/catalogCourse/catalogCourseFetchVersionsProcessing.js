import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.121-student-dashboard-open-clean";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

