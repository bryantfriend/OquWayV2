import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.119-student-dashboard-debug-safe";

export async function processLoadCourse(executionState) {
    const { context } = executionState;
    executionState.result = context.course;
    return { valid: true };
}

