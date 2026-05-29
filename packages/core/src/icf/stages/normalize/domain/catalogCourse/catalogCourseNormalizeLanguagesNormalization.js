export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseNormalizeLanguagesNormalization(executionState) {
    let dataToUpdate = {};
    if (!executionState.payload.languages || !Array.isArray(executionState.payload.languages)) {
        dataToUpdate.languages = ["en"];
    }

    if (!executionState.payload.defaultLanguage) {
        dataToUpdate.defaultLanguage = "en";
    }

    if (Object.keys(dataToUpdate).length > 0) {
        return { valid: true, data: dataToUpdate };
    }
    return { valid: true };
}
