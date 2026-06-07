import { db, doc, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.113-student-rules-read";

export async function catalogCourseArchiveProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = {
        id: payload.courseId,
        ...(context.course || context.existingCourse || {}),
        status: "archived",
        isArchived: true,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };

    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), {
        status: "archived",
        isArchived: true,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    }, { merge: true });

    return { valid: true };
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}
