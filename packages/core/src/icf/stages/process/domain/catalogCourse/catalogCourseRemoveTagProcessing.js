export function catalogCourseRemoveTagProcessing(executionState) {
    const payload = executionState.payload;
    const context = executionState.context;
    const existingTags = readExistingTags(context);

    payload.tags = createTagsWithoutRemovedTag(existingTags, payload.tag);
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

function createTagsWithoutRemovedTag(existingTags, tagToRemove) {
    const nextTags = [];
    let tagIndex = 0;

    while (tagIndex < existingTags.length) {
        if (existingTags[tagIndex] !== tagToRemove) {
            nextTags.push(existingTags[tagIndex]);
        }

        tagIndex = tagIndex + 1;
    }

    return nextTags;
}

