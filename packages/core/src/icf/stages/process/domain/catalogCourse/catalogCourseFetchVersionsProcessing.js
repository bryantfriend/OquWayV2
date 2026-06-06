import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.81-class-command-center";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

