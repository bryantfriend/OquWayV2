export function validateCoursePublishReady(executionState) {
    const payload = executionState.payload || {};
    const context = executionState.context || {};
    const course = payload.course || context.course || null;
    const errors = [];

    if (!course && !payload.courseId) {
        errors.push({ field: "course", message: "Course payload missing" });
    }

    if (course && !hasCourseTitle(course)) {
        errors.push({ field: "course.title", message: "Course title is required." });
    }

    if (errors.length > 0) {
        return { valid: false, errors: errors };
    }

    return { valid: true };
}

function hasCourseTitle(course) {
    return hasLocalizedText(course && (course.title || course.name || course.displayName));
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
