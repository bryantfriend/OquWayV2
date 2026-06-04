export function normalizeCourseId(executionState) {
    const { payload } = executionState;
    if (payload.courseId && typeof payload.courseId === "string") {
        return { valid: true, data: { courseId: payload.courseId.trim() } };
    }
    return { valid: true };
}

export function normalizeLanguagesArray(executionState) {
    const { payload } = executionState;
    if (payload.languages && Array.isArray(payload.languages)) {
        return {
            valid: true,
            data: {
                languages: payload.languages.map(function (lang) {
                    return typeof lang === "string" ? lang.trim() : lang;
                })
            }
        };
    }
    return { valid: true };
}
