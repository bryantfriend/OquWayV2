export async function processUpdateCourseField(executionState) {
    const { payload, context } = executionState;

    // Optimistic local update processor. The main save handles DB writes.
    const courseToUpdate = Object.assign({}, context.course);

    // payload should have { fieldKey: "languages", value: ["en", "ru"] }
    courseToUpdate[payload.fieldKey] = payload.value;
    courseToUpdate.isDirty = true;

    executionState.result = courseToUpdate;
    return { valid: true };
}

