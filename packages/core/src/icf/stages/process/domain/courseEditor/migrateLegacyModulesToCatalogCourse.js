import { db, collection, doc, getDoc, getDocs, serverTimestamp, writeBatch } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.109-student-assignment-status-fallback";

export async function migrateLegacyModulesToCatalogCourse(courseId) {
    const legacyModulesSnapshot = await getDocs(collection(db, "courses", courseId, "modules"));
    const catalogModulesSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules"));
    const catalogCourseRef = doc(db, "catalogCourses", courseId);
    const catalogCourseSnapshot = await getDoc(catalogCourseRef);
    const catalogCourse = catalogCourseSnapshot.exists() ? catalogCourseSnapshot.data() : {};
    const existingCatalogIds = {};
    const legacyModuleIds = [];
    const copiedModuleIds = [];
    const skippedModuleIds = [];
    const batch = writeBatch(db);

    catalogModulesSnapshot.forEach(function (moduleDoc) {
        existingCatalogIds[moduleDoc.id] = true;
    });

    legacyModulesSnapshot.forEach(function (moduleDoc) {
        const moduleId = moduleDoc.id;
        legacyModuleIds.push(moduleId);

        if (existingCatalogIds[moduleId]) {
            skippedModuleIds.push(moduleId);
            return;
        }

        batch.set(
            doc(db, "catalogCourses", courseId, "modules", moduleId),
            normalizeModuleDocument(moduleDoc.data()),
            { merge: true }
        );
        copiedModuleIds.push(moduleId);
        existingCatalogIds[moduleId] = true;
    });

    await copyKnownModuleSubcollections(courseId, legacyModuleIds, copiedModuleIds, batch);

    const finalModuleIds = Object.keys(existingCatalogIds);
    const moduleOrder = mergeModuleOrder(catalogCourse.moduleOrder, legacyModuleIds, finalModuleIds);

    batch.set(catalogCourseRef, {
        moduleCount: finalModuleIds.length,
        moduleOrder: moduleOrder,
        updatedAt: serverTimestamp()
    }, { merge: true });

    await batch.commit();

    console.info("[course-modules:migrate-legacy]", {
        courseId: courseId,
        legacyPath: "courses/" + courseId + "/modules",
        canonicalPath: "catalogCourses/" + courseId + "/modules",
        legacyModuleCount: legacyModuleIds.length,
        copiedModuleCount: copiedModuleIds.length,
        skippedExistingCount: skippedModuleIds.length,
        moduleOrder: moduleOrder
    });

    return {
        courseId: courseId,
        legacyPath: "courses/" + courseId + "/modules",
        canonicalPath: "catalogCourses/" + courseId + "/modules",
        legacyModuleCount: legacyModuleIds.length,
        copiedModuleCount: copiedModuleIds.length,
        skippedExistingCount: skippedModuleIds.length,
        moduleCount: finalModuleIds.length,
        moduleOrder: moduleOrder,
        copiedModuleIds: copiedModuleIds,
        skippedModuleIds: skippedModuleIds
    };
}

export async function processMigrateLegacyModulesToCatalogCourse(executionState) {
    const courseId = executionState.payload ? executionState.payload.courseId : "";
    const result = await migrateLegacyModulesToCatalogCourse(courseId);

    executionState.result = result;
    return { valid: true };
}

async function copyKnownModuleSubcollections(courseId, legacyModuleIds, copiedModuleIds, batch) {
    for (let i = 0; i < copiedModuleIds.length; i += 1) {
        const moduleId = copiedModuleIds[i];
        await copyLearningContentSubcollection(courseId, moduleId, batch);
        await copyLearningModesSubcollection(courseId, moduleId, batch);
    }
}

async function copyLearningContentSubcollection(courseId, moduleId, batch) {
    const snapshot = await getDocs(collection(db, "courses", courseId, "modules", moduleId, "learningContent"));

    snapshot.forEach(function (contentDoc) {
        batch.set(
            doc(db, "catalogCourses", courseId, "modules", moduleId, "learningContent", contentDoc.id),
            contentDoc.data(),
            { merge: true }
        );
    });
}

async function copyLearningModesSubcollection(courseId, moduleId, batch) {
    const modesSnapshot = await getDocs(collection(db, "courses", courseId, "modules", moduleId, "learningModes"));

    for (const modeDoc of modesSnapshot.docs) {
        batch.set(
            doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", modeDoc.id),
            modeDoc.data(),
            { merge: true }
        );

        const stepsSnapshot = await getDocs(collection(db, "courses", courseId, "modules", moduleId, "learningModes", modeDoc.id, "steps"));
        stepsSnapshot.forEach(function (stepDoc) {
            batch.set(
                doc(db, "catalogCourses", courseId, "modules", moduleId, "learningModes", modeDoc.id, "steps", stepDoc.id),
                stepDoc.data(),
                { merge: true }
            );
        });
    }
}

function normalizeModuleDocument(moduleData) {
    const data = Object.assign({}, moduleData || {});

    if (!data.status) {
        data.status = "draft";
    }

    return data;
}

function mergeModuleOrder(existingOrder, legacyModuleIds, finalModuleIds) {
    const seen = {};
    const order = [];

    appendIds(order, seen, Array.isArray(existingOrder) ? existingOrder : []);
    appendIds(order, seen, legacyModuleIds);
    appendIds(order, seen, finalModuleIds);

    return order.filter(function (moduleId) {
        return finalModuleIds.indexOf(moduleId) !== -1;
    });
}

function appendIds(order, seen, ids) {
    ids.forEach(function (id) {
        if (typeof id === "string" && id.length > 0 && !seen[id]) {
            seen[id] = true;
            order.push(id);
        }
    });
}
