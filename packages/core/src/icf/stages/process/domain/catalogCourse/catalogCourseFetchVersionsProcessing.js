import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

