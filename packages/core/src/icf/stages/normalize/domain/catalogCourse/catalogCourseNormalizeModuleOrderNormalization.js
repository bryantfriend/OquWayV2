export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseNormalizeModuleOrderNormalization(executionState) {
    if (executionState.payload.modules && Array.isArray(executionState.payload.modules)) {
        const updatedModules = [];
        for (let i = 0; i < executionState.payload.modules.length; i++) {
            const mod = Object.assign({}, executionState.payload.modules[i]);
            mod.order = i;
            updatedModules.push(mod);
        }
        return { valid: true, data: { modules: updatedModules } };
    }
    return { valid: true };
}
