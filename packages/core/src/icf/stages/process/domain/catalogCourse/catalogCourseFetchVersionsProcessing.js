import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

