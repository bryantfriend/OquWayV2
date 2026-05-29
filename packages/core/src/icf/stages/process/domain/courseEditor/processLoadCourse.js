import { db, writeBatch, doc } from "../../../../../infrastructure/firebase/firestore.js";

export async function processLoadCourse(executionState) {
    const { context } = executionState;
    executionState.result = context.course;
    return { valid: true };
}

