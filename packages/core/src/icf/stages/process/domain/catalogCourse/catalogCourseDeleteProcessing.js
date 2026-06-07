import { db, doc, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";

export async function catalogCourseDeleteProcessing(executionState) {
    const { payload, context } = executionState;
    executionState.result = {
        id: payload.courseId,
        ...(context.course || context.existingCourse || {}),
        isDeleted: true,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy
    };

    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), {
        isDeleted: true,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy
    }, { merge: true });

    return { valid: true };
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}
