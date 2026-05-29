import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

