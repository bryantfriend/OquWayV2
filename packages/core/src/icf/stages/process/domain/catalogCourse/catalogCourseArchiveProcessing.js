import { collection, db, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";

export async function catalogCourseArchiveProcessing(executionState) {
    const { payload, context } = executionState;
    const archiveFields = {
        status: "archived",
        isArchived: true,
        isDeleted: false,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy,
        updatedByName: context.updatedByName
    };
    const archivedAssignmentCount = await archiveCourseAssignments(payload.courseId, context);
    const archivedCollections = await archiveCourseRecords(payload.courseId, executionState, archiveFields);

    executionState.result = {
        id: payload.courseId,
        ...(context.course || context.existingCourse || {}),
        ...archiveFields,
        archivedAssignmentCount,
        archivedCollections
    };

    return { valid: true };
}

function readCourseCollectionName(executionState) {
    return executionState.context && executionState.context.courseCollectionName
        ? executionState.context.courseCollectionName
        : "catalogCourses";
}

async function archiveCourseRecords(courseId, executionState, archiveFields) {
    const collectionNames = readArchiveCollectionNames(executionState);
    const archivedCollections = [];

    for (const collectionName of collectionNames) {
        const courseRef = doc(db, collectionName, courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
            await setDoc(courseRef, archiveFields, { merge: true });
            archivedCollections.push(collectionName);
        }
    }

    if (archivedCollections.length === 0) {
        const fallbackCollectionName = readCourseCollectionName(executionState);
        await setDoc(doc(db, fallbackCollectionName, courseId), archiveFields, { merge: true });
        archivedCollections.push(fallbackCollectionName);
    }

    return archivedCollections;
}

function readArchiveCollectionNames(executionState) {
    const preferredCollectionName = readCourseCollectionName(executionState);
    const collectionNames = [];

    appendCollectionName(collectionNames, preferredCollectionName);
    appendCollectionName(collectionNames, "catalogCourses");
    appendCollectionName(collectionNames, "courses");

    return collectionNames;
}

function appendCollectionName(collectionNames, collectionName) {
    if (!collectionName || collectionNames.indexOf(collectionName) !== -1) {
        return;
    }

    collectionNames.push(collectionName);
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
