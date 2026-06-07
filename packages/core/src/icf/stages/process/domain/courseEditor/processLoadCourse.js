import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.120-student-course-debug-summary";

export async function processLoadCourse(executionState) {
    const { context } = executionState;
    executionState.result = context.course;
    return { valid: true };
}

