import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.112-student-assignment-error-debug";

export async function processLoadCourse(executionState) {
    const { context } = executionState;
    executionState.result = context.course;
    return { valid: true };
}

