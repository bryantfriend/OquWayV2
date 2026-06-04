import { db, doc, getDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";

export async function attachModuleDocument(executionState) {
    const { payload } = executionState;
    const courseId = payload && payload.courseId ? String(payload.courseId) : "";
    const moduleId = payload && payload.moduleId ? String(payload.moduleId) : "";
    const canonicalPath = "catalogCourses/" + courseId + "/modules/" + moduleId;

    if (isDevelopmentLoggingEnabled()) {
        console.info("[module-editor:open]", {
            courseId: courseId,
            moduleId: moduleId,
            canonicalPath: canonicalPath,
            hasCourseId: Boolean(courseId),
            hasModuleId: Boolean(moduleId)
        });
    }

    if (!courseId) {
        return {
            valid: false,
            errors: [{ message: "Cannot open module editor because courseId is missing." }]
        };
    }

    if (!moduleId) {
        return {
            valid: false,
            errors: [{ message: "Cannot open module editor because moduleId is missing." }]
        };
    }

    try {
        const lookupResult = await readModuleSnap(executionState, courseId, moduleId);

        if (!lookupResult.snap.exists()) {
            if (isDevelopmentLoggingEnabled()) {
                console.warn("[module-editor:open] module lookup failed", {
                    courseId: courseId,
                    moduleId: moduleId,
                    attemptedPaths: lookupResult.attemptedPaths
                });
            }

            return {
                valid: false,
                errors: [{ message: "Module not found: " + moduleId }]
            };
        }

        return {
            valid: true,
            data: {
                module: { id: lookupResult.snap.id, ...lookupResult.snap.data() },
                modulePath: lookupResult.path,
                courseCollectionName: lookupResult.courseCollectionName
            }
        };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach module document: " + err.message }]
        };
    }
}

async function readModuleSnap(executionState, courseId, moduleId) {
    const attemptedPaths = [];
    const collectionNames = readCandidateCourseCollections(executionState);
    let index = 0;

    while (index < collectionNames.length) {
        const collectionName = collectionNames[index];
        const path = collectionName + "/" + courseId + "/modules/" + moduleId;
        const docSnap = await getDoc(doc(db, collectionName, courseId, "modules", moduleId));
        attemptedPaths.push(path);

        if (docSnap.exists()) {
            return {
                courseCollectionName: collectionName,
                path: path,
                snap: docSnap,
                attemptedPaths: attemptedPaths
            };
        }

        index = index + 1;
    }

    const legacyPath = "modules/" + moduleId;
    const legacySnap = await getDoc(doc(db, "modules", moduleId));
    attemptedPaths.push(legacyPath);

    if (legacySnap.exists()) {
        return {
            courseCollectionName: readCourseCollectionName(executionState),
            path: legacyPath,
            snap: legacySnap,
            attemptedPaths: attemptedPaths
        };
    }

    return {
        courseCollectionName: readCourseCollectionName(executionState),
        path: canonicalModulePath(courseId, moduleId),
        snap: emptyDocumentSnapshot(),
        attemptedPaths: attemptedPaths
    };
}

function readCandidateCourseCollections(executionState) {
    const collectionNames = ["catalogCourses"];
    const contextCollectionName = readCourseCollectionName(executionState);

    if (contextCollectionName && collectionNames.indexOf(contextCollectionName) === -1) {
        collectionNames.push(contextCollectionName);
    }

    if (collectionNames.indexOf("courses") === -1) {
        collectionNames.push("courses");
    }

    return collectionNames;
}

function readCourseCollectionName(executionState) {
    if (executionState.context && executionState.context.courseCollectionName) {
        return executionState.context.courseCollectionName;
    }

    return "catalogCourses";
}

function canonicalModulePath(courseId, moduleId) {
    return "catalogCourses/" + courseId + "/modules/" + moduleId;
}

function emptyDocumentSnapshot() {
    return {
        exists: function () {
            return false;
        }
    };
}

function isDevelopmentLoggingEnabled() {
    if (typeof window === "undefined" || !window.location) {
        return false;
    }

    return window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.search.indexOf("debug") !== -1;
}
