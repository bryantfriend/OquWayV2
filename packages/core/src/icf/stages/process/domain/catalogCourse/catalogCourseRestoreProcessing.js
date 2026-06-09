import { db, doc, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";

export async function catalogCourseRestoreProcessing(executionState) {
    const { payload, context } = executionState;
    const restoreFields = {
        status: "draft",
        isArchived: false,
        isDeleted: false,
        restoredAt: context.systemTimestamp,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };

    executionState.result = {
        id: payload.courseId,
        ...(context.course || context.existingCourse || {}),
        ...restoreFields
    };

    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), restoreFields, { merge: true });

    return { valid: true };
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}
