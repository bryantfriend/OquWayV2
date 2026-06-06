import { getModuleById } from "../../../../../../../domain/modules/index.js";

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
        const lookupResult = await readModuleRecord(executionState, courseId, moduleId);

        if (!lookupResult.module) {
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
                module: lookupResult.module,
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

async function readModuleRecord(executionState, courseId, moduleId) {
    const collectionNames = readCandidateCourseCollections(executionState);
    const attemptedPaths = collectionNames.map(function (collectionName) {
        return collectionName + "/" + courseId + "/modules/" + moduleId;
    }).concat(["modules/" + moduleId]);
    const moduleRecord = await getModuleById(courseId, moduleId, {
        sources: collectionNames,
        includeStandaloneLegacy: true
    });

    return {
        courseCollectionName: moduleRecord && moduleRecord.source && moduleRecord.source !== "modules" ? moduleRecord.source : readCourseCollectionName(executionState),
        path: readModulePath(moduleRecord, courseId, moduleId),
        module: moduleRecord,
        attemptedPaths: attemptedPaths
    };
}

function readModulePath(moduleRecord, courseId, moduleId) {
    if (moduleRecord && moduleRecord.source === "modules") {
        return "modules/" + moduleId;
    }

    if (moduleRecord && moduleRecord.source) {
        return moduleRecord.source + "/" + courseId + "/modules/" + moduleId;
    }

    return canonicalModulePath(courseId, moduleId);
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

function isDevelopmentLoggingEnabled() {
    if (typeof window === "undefined" || !window.location) {
        return false;
    }

    return window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.search.indexOf("debug") !== -1;
}
