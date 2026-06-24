import { getModuleSourceCheck } from "../../../../../../../domain/modules/index.js";

export async function attachModulesCollection(executionState) {
    const { payload } = executionState;
    if (!payload.courseId) return { valid: true };

    try {
        const sourceCheck = await getModuleSourceCheck(payload.courseId, {
            course: executionState.context && executionState.context.course ? executionState.context.course : null
        });
        const courseContext = sourceCheck.courseContext;
        const modules = sourceCheck.catalogModules.length > 0
            ? sourceCheck.catalogModules.slice()
            : sourceCheck.legacyModules.slice();
        const moduleSource = sourceCheck.catalogModules.length > 0
            ? "catalogCourses"
            : (sourceCheck.legacyModules.length > 0 ? "courses" : "catalogCourses");

        sortModulesByCourseOrder(modules, courseContext.course.moduleOrder);
        warnOnModuleSourceMismatch(payload.courseId, courseContext, sourceCheck, modules, moduleSource);

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

function warnOnModuleSourceMismatch(courseId, courseContext, sourceCheck, modules, moduleSource) {
    const course = courseContext.course || {};
    const moduleCount = typeof course.moduleCount === "number" ? course.moduleCount : 0;
    const moduleOrder = Array.isArray(course.moduleOrder) ? course.moduleOrder : [];
    const catalogLoadedCount = sourceCheck.catalogModules.length;

    if (sourceCheck.legacyCoursesModulesCount > 0 && catalogLoadedCount === 0) {
        console.warn("[course-editor:module-source-mismatch]", {
            courseId: courseId,
            canonicalPath: "catalogCourses/{courseId}/modules",
            fallbackPath: "courses/{courseId}/modules",
            catalogModulesCount: sourceCheck.catalogModulesCount,
            legacyCoursesModulesCount: sourceCheck.legacyCoursesModulesCount,
            moduleIds: modules.map(readModuleId),
            moduleTitles: modules.map(readModuleTitle),
            moduleStatus: modules.map(readModuleStatus),
            moduleSource: moduleSource
        });
    }

    if ((moduleCount > 0 || moduleOrder.length > 0) && catalogLoadedCount === 0 && modules.length === 0) {
        console.warn("[course-modules:mismatch]", {
            courseId: courseId,
            moduleCount: moduleCount,
            moduleOrder: moduleOrder,
            discoveredModulesLength: modules.length,
            moduleSource: moduleSource
        });
    }
}

function readModuleId(module) {
    if (!module) {
        return "";
    }

    return module.id || module.moduleId || "";
}

function readModuleTitle(module) {
    if (!module) {
        return "";
    }

    const title = module.title || module.name || module.displayName;
    if (typeof title === "string") {
        return title;
    }

    if (title && typeof title === "object") {
        return title.en || title.ru || title.ky || "";
    }

    return "";
}

function readModuleStatus(module) {
    if (!module) {
        return "";
    }

    return module.status || (module.isDraft ? "draft" : "");
}