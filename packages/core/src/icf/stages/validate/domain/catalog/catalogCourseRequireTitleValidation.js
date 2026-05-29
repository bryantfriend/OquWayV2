export function catalogCourseRequireTitleValidation(executionState) {
    const payload = readPayload(executionState);

    if (!hasUsableTitle(payload.title)) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_TITLE_REQUIRED",
                    field: "title",
                    message: "Catalog Course requires a valid title."
                }
            ]
        };
    }

    if (getTitleLength(payload.title) > 200) {
        return {
            valid: false,
            errors: [
                {
                    code: "COURSE_TITLE_TOO_LONG",
                    field: "title",
                    message: "Catalog Course title must be 200 characters or fewer."
                }
            ]
        };
    }

    return { valid: true };
}

function readPayload(executionState) {
    if (!executionState) {
        return {};
    }

    if (!executionState.payload) {
        return {};
    }

    return executionState.payload;
}

function hasUsableTitle(titleValue) {
    if (typeof titleValue === "string") {
        return titleValue.trim().length > 0;
    }

    if (!titleValue || typeof titleValue !== "object" || Array.isArray(titleValue)) {
        return false;
    }

    return hasLanguageTitle(titleValue, "en")
        || hasLanguageTitle(titleValue, "ru")
        || hasLanguageTitle(titleValue, "ky");
}

function hasLanguageTitle(titleValue, languageCode) {
    if (typeof titleValue[languageCode] !== "string") {
        return false;
    }

    return titleValue[languageCode].trim().length > 0;
}

function getTitleLength(titleValue) {
    if (typeof titleValue === "string") {
        return titleValue.trim().length;
    }

    if (!titleValue || typeof titleValue !== "object" || Array.isArray(titleValue)) {
        return 0;
    }

    return getLanguageTitleLength(titleValue, "en")
        + getLanguageTitleLength(titleValue, "ru")
        + getLanguageTitleLength(titleValue, "ky");
}

function getLanguageTitleLength(titleValue, languageCode) {
    if (typeof titleValue[languageCode] !== "string") {
        return 0;
    }

    return titleValue[languageCode].trim().length;
}
