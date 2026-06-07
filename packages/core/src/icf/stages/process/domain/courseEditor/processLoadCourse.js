import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.121-student-dashboard-open-clean";

export async function processLoadCourse(executionState) {
    const { context } = executionState;
    executionState.result = context.course;
    return { valid: true };
}

