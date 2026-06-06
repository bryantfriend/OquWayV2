export async function processOpenCourseEditor(executionState) {
    const { context } = executionState;
    const modules = Array.isArray(context.modules) ? context.modules : [];
    const moduleSourceCheck = context.moduleSourceCheck || {};

    // The processor's job for this query intent is to format the final payload for the UI store
    const selectedModuleId = modules.length > 0
        ? modules[0].id || modules[0].moduleId
        : null;
    const courseId = executionState.payload ? executionState.payload.courseId : "";

    console.info("[course-editor:open-process]", {
        courseId: courseId,
        hasCourse: Boolean(context.course),
        moduleCount: context.course ? context.course.moduleCount : undefined,
        moduleOrderLength: context.course && Array.isArray(context.course.moduleOrder) ? context.course.moduleOrder.length : undefined,
        returnedModulesLength: modules.length,
        moduleIds: modules.map(readModuleId)
    });

    console.info("[course-editor:modules-read]", {
        courseId: courseId,
        path: moduleSourceCheck.moduleSource === "courses" ? "courses/" + courseId + "/modules" : "catalogCourses/" + courseId + "/modules",
        canonicalPath: "catalogCourses/" + courseId + "/modules",
        loadedCount: modules.length,
        moduleSource: moduleSourceCheck.moduleSource || "catalogCourses",
        moduleIds: modules.map(readModuleId)
    });

    console.info("[course:open:module-read-proof]", {
        courseId: courseId,
        readPath: "catalogCourses/" + courseId + "/modules",
        fallbackReadPath: moduleSourceCheck.moduleSource === "courses" ? "courses/" + courseId + "/modules" : null,
        moduleSource: moduleSourceCheck.moduleSource || "catalogCourses",
        needsModuleMigration: Boolean(moduleSourceCheck.needsModuleMigration),
        loadedModuleCount: modules.length,
        loadedModuleIds: modules.map(readModuleId),
        loadedModuleTitles: modules.map(readModuleTitle)
    });

    executionState.result = {
        course: context.course,
        modules: modules,
        moduleSourceCheck: moduleSourceCheck,
        selectedModuleId: selectedModuleId,
        permissions: {
            role: context.actorRole,
            canEdit: true
        }
    };

    return { valid: true };
}

function readModuleId(module) {
    if (!module) {
        return "";
    }

    return module.id || module.moduleId || "";
}

function readModuleTitle(module) {
    const title = module ? module.title : "";

    if (typeof title === "string") {
        return title;
    }

    if (title && typeof title === "object") {
        return title.en || title.ru || title.ky || "";
    }

    return "";
}
