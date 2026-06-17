import { countModuleSteps as countSharedModuleSteps } from "../../../../../../../domain/progress/index.js";

export function validateCoursePublishReady(executionState) {
    const payload = executionState.payload || {};
    const context = executionState.context || {};
    const course = payload.course || context.course || null;
    const hasModulePayload = Array.isArray(payload.modules) || Array.isArray(context.modules);
    const modules = Array.isArray(payload.modules) && payload.modules.length > 0
        ? payload.modules
        : (Array.isArray(context.modules) ? context.modules : []);
    const errors = [];

    if (!course && !payload.courseId) {
        errors.push({ field: "course", message: "Course payload missing" });
    } else if (!hasCourseTitle(course)) {
        errors.push({ field: "course.title", message: "Course title is required." });
    }

    if (hasModulePayload && modules.length === 0) {
        errors.push({ field: "modules", message: "Course must have at least one module." });
    }

    if (hasModulePayload) {
        modules.forEach(function (moduleRecord, index) {
            if (!moduleRecord || !(moduleRecord.id || moduleRecord.moduleId)) {
                errors.push({ field: "modules[" + index + "].id", message: "Module id is required." });
                return;
            }

            if (!hasModuleTitle(moduleRecord)) {
                errors.push({ field: "modules[" + index + "].title", message: "Module title is required." });
            }

            if (countSharedModuleSteps(moduleRecord) === 0) {
                errors.push({ field: "modules[" + index + "].steps", message: "Module must have at least one student step." });
            }
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors: errors };
    }

    return { valid: true };
}

function hasCourseTitle(course) {
    if (!course && course !== "") {
        return true;
    }

    return hasLocalizedText(course && (course.title || course.name || course.displayName));
}

function hasModuleTitle(moduleRecord) {
    return hasLocalizedText(moduleRecord && (moduleRecord.title || moduleRecord.name || moduleRecord.displayName))
        || hasLocalizedText(moduleRecord && moduleRecord.config && moduleRecord.config.title);
}

function hasLocalizedText(value) {
    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    return Boolean(value.en || value.ru || value.ky);
}

