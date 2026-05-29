export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseNormalizeStepOrderNormalization(executionState) {
    if (executionState.payload.steps && Array.isArray(executionState.payload.steps)) {
        const updatedSteps = [];
        for (let i = 0; i < executionState.payload.steps.length; i++) {
            const step = Object.assign({}, executionState.payload.steps[i]);
            step.order = i;
            updatedSteps.push(step);
        }
        return { valid: true, data: { steps: updatedSteps } };
    }
    return { valid: true };
}
