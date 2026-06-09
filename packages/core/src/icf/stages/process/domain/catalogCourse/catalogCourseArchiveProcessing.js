import { collection, db, doc, getDocs, query, setDoc, where, writeBatch } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.124-location-icon-upload";

export async function catalogCourseArchiveProcessing(executionState) {
    const { payload, context } = executionState;
    const archiveFields = {
        status: "archived",
        isArchived: true,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };
    const archivedAssignmentCount = await archiveCourseAssignments(payload.courseId, context);

    executionState.result = {
        id: payload.courseId,
        ...(context.course || context.existingCourse || {}),
        ...archiveFields,
        archivedAssignmentCount
    };

    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId), archiveFields, { merge: true });

    return { valid: true };
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

async function archiveCourseAssignments(courseId, context) {
    if (!courseId) {
        return 0;
    }

    const assignmentsSnap = await getDocs(query(
        collection(db, "courseAssignments"),
        where("courseId", "==", courseId)
    ));
    const updateFields = {
        status: "archived",
        visibility: "hidden",
        archivedAt: context.systemTimestamp,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };
    let batch = writeBatch(db);
    let pendingWrites = 0;
    let archivedCount = 0;

    for (const assignmentSnap of assignmentsSnap.docs) {
        batch.set(assignmentSnap.ref, updateFields, { merge: true });
        pendingWrites += 1;
        archivedCount += 1;

        if (pendingWrites >= 450) {
            await batch.commit();
            batch = writeBatch(db);
            pendingWrites = 0;
        }
    }

    if (pendingWrites > 0) {
        await batch.commit();
    }

    return archivedCount;
}
