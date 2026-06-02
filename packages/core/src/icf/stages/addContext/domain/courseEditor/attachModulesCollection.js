import { db, doc, getDoc, collection, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.29-module-render-fix";

export async function attachModulesCollection(executionState) {
    const { payload } = executionState;
    if (!payload.courseId) return { valid: true };

    try {
        const sourceCheck = await readModuleSourceCheck(executionState, payload.courseId);
        const courseContext = sourceCheck.courseContext;
        const modules = sourceCheck.catalogModules.length > 0
            ? sourceCheck.catalogModules.slice()
            : sourceCheck.legacyModules.slice();
        const moduleSource = sourceCheck.catalogModules.length > 0
            ? "catalogCourses"
            : (sourceCheck.legacyModules.length > 0 ? "courses" : "catalogCourses");

        sortModulesByCourseOrder(modules, courseContext.course.moduleOrder);
        logModuleSourceCheck(sourceCheck, sourceCheck.catalogModules.length);
        logModuleLoad(payload.courseId, courseContext, sourceCheck.catalogModules.length, modules, moduleSource);

        return {
            valid: true,
            data: {
                modules: modules,
                moduleSourceCheck: {
                    catalogModulesCount: sourceCheck.catalogModulesCount,
                    legacyCoursesModulesCount: sourceCheck.legacyCoursesModulesCount,
                    moduleOrder: sourceCheck.moduleOrder,
                    embeddedModulesCount: sourceCheck.embeddedModulesCount,
                    moduleSource: moduleSource,
                    needsModuleMigration: sourceCheck.catalogModulesCount === 0 && sourceCheck.legacyCoursesModulesCount > 0
                }
            }
        };
    } catch (err) {
        return {
            valid: false,
            errors: [{ message: "Failed to attach modules collection: " + err.message }]
        };
    }
}

async function readModuleSourceCheck(executionState, courseId) {
    const catalogSnap = await getDoc(doc(db, "catalogCourses", courseId));
    const legacyCourseSnap = await getDoc(doc(db, "courses", courseId));
    const catalogModulesSnapshot = await getDocs(collection(db, "catalogCourses", courseId, "modules"));
    const legacyCoursesModulesSnapshot = await getDocs(collection(db, "courses", courseId, "modules"));
    const catalogCourse = catalogSnap.exists() ? { id: catalogSnap.id, ...catalogSnap.data() } : null;
    const legacyCourse = legacyCourseSnap.exists() ? { id: legacyCourseSnap.id, ...legacyCourseSnap.data() } : null;
    const contextCourse = executionState.context && executionState.context.course ? executionState.context.course : null;
    const course = catalogCourse || contextCourse || legacyCourse || {};
    const moduleOrder = Array.isArray(course.moduleOrder) ? course.moduleOrder : [];
    const embeddedModules = Array.isArray(course.modules) ? course.modules : [];
    const catalogModules = readModulesFromSnapshot(catalogModulesSnapshot);
    const legacyModules = readModulesFromSnapshot(legacyCoursesModulesSnapshot);

    return {
        catalogModulesCount: catalogModulesSnapshot.size,
        legacyCoursesModulesCount: legacyCoursesModulesSnapshot.size,
        catalogModules: catalogModules,
        legacyModules: legacyModules,
        moduleOrder: moduleOrder,
        embeddedModulesCount: embeddedModules.length,
        courseContext: {
            collectionName: "catalogCourses",
            course: course
        }
    };
}

function readModulesFromSnapshot(snapshot) {
    const modules = [];

    snapshot.forEach(function (moduleDoc) {
        modules.push({ id: moduleDoc.id, ...moduleDoc.data() });
    });

    return modules;
}

function sortModulesByCourseOrder(modules, moduleOrder) {
    const order = Array.isArray(moduleOrder) ? moduleOrder : [];
    const orderIndexById = {};

    order.forEach(function (moduleId, index) {
        orderIndexById[moduleId] = index;
    });

    modules.sort(function (a, b) {
        const aId = a.id || a.moduleId;
        const bId = b.id || b.moduleId;
        const aHasOrder = Object.prototype.hasOwnProperty.call(orderIndexById, aId);
        const bHasOrder = Object.prototype.hasOwnProperty.call(orderIndexById, bId);

        if (aHasOrder && bHasOrder) {
            return orderIndexById[aId] - orderIndexById[bId];
        }

        if (aHasOrder) {
            return -1;
        }

        if (bHasOrder) {
            return 1;
        }

        return (a.order || 0) - (b.order || 0);
    });
}

function logModuleSourceCheck(sourceCheck, catalogLoadedCount) {
    console.warn("[course-editor:module-source-check]", {
        catalogModulesCount: sourceCheck.catalogModulesCount,
        legacyCoursesModulesCount: sourceCheck.legacyCoursesModulesCount,
        moduleOrder: sourceCheck.moduleOrder,
        embeddedModulesCount: sourceCheck.embeddedModulesCount
    });

    if (sourceCheck.legacyCoursesModulesCount > 0 && catalogLoadedCount === 0) {
        console.warn("[course-editor:module-source-mismatch]", {
            message: "Modules exist under courses/{courseId}/modules but not catalogCourses/{courseId}/modules.",
            canonicalPath: "catalogCourses/{courseId}/modules",
            fallbackPath: "courses/{courseId}/modules"
        });
    }
}

function logModuleLoad(courseId, courseContext, loadedModuleDocCount, modules, moduleSource) {
    const course = courseContext.course || {};
    const moduleCount = typeof course.moduleCount === "number" ? course.moduleCount : 0;
    const moduleOrder = Array.isArray(course.moduleOrder) ? course.moduleOrder : [];
    const path = moduleSource === "courses"
        ? "courses/" + courseId + "/modules"
        : "catalogCourses/" + courseId + "/modules";

    console.info("[course-modules:load]", {
        courseId: courseId,
        moduleCount: moduleCount,
        moduleOrderLength: moduleOrder.length,
        loadedModuleDocCount: loadedModuleDocCount,
        renderedFallbackModuleCount: Array.isArray(modules) ? modules.length : 0,
        moduleSource: moduleSource,
        moduleIds: Array.isArray(modules) ? modules.map(readModuleId) : [],
        path: path
    });

    if ((moduleCount > 0 || moduleOrder.length > 0) && loadedModuleDocCount === 0) {
        console.warn("[course-modules:mismatch]", {
            courseId: courseId,
            moduleCount: moduleCount,
            loadedModuleDocCount: loadedModuleDocCount,
            moduleOrder: moduleOrder
        });
        console.warn("Course moduleCount says modules exist, but no module documents were found.");
        console.warn("moduleCount mismatch: course says modules exist but no module docs were found");
    }
}

function readModuleId(module) {
    if (!module) {
        return "";
    }

    return module.id || module.moduleId || "";
}
