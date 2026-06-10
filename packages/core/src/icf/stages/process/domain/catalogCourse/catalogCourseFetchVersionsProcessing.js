import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

