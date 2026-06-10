import { db, deleteDoc, doc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function catalogCoursePermanentDeleteProcessing(executionState) {
    const { payload, context } = executionState;
    const collectionName = readCourseCollectionName(executionState);

    executionState.result = {
        id: payload.courseId,
        ...(context.course || context.existingCourse || {}),
        permanentlyDeleted: true,
        deletedFrom: collectionName,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };

    await deleteDoc(doc(db, collectionName, payload.courseId));

    return { valid: true };
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}
