import { db, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.80-course-module-command-center";

export async function catalogCourseFetchVersionsProcessing(executionState) {
    executionState.result = [];
    return { valid: true };
}

