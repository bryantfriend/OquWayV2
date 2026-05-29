import { db, collection, doc, setDoc } from "../../../../../infrastructure/firebase/firestore.js";

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogCourseArchiveProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = {
        id: payload.courseId,
        ...context.existingCourse,
        isArchived: true,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };
    return { valid: true };
}

