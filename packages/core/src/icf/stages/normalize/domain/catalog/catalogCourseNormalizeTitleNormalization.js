export function catalogCourseNormalizeTitleNormalization(executionState) {
    const payload = readPayload(executionState);
    const trimmedTitle = readTitleText(payload.title);
    const slug = createSlug(trimmedTitle);

    return {
        valid: true,
        data: {
            title: trimmedTitle,
            slug: slug
        }
    };
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

function readTitleText(titleValue) {
    if (typeof titleValue === "string") {
        return titleValue.trim();
    }

    if (titleValue && typeof titleValue === "object" && typeof titleValue.en === "string") {
        return titleValue.en.trim();
    }

    return "";
}

function createSlug(titleText) {
    return titleText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
