export function catalogCourseAddTagProcessing(executionState) {
    const payload = executionState.payload;
    const context = executionState.context;
    const existingTags = readExistingTags(context);

    if (existingTags.indexOf(payload.tag) === -1) {
        payload.tags = createTagsWithAddedTag(existingTags, payload.tag);
        return { valid: true };
    }

    payload.tags = existingTags;
    return { valid: true };
}

function readExistingTags(context) {
    if (!context.existingCourse) {
        return [];
    }

    if (!Array.isArray(context.existingCourse.tags)) {
        return [];
    }

    return context.existingCourse.tags;
}

function createTagsWithAddedTag(existingTags, tag) {
    const nextTags = existingTags.slice();
    nextTags.push(tag);
    return nextTags;
}

