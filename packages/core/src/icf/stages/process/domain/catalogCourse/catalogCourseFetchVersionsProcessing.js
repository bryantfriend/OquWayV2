import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

