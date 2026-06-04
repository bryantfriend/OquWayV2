export function normalizeCourseId(executionState) {
    const { payload } = executionState;
    if (payload.courseId && typeof payload.courseId === "string") {
        return { valid: true, data: { courseId: payload.courseId.trim() } };
    }
    return { valid: true };
}

export function normalizeModuleOrder(executionState) {
    const { payload } = executionState;
    if (payload.modules && Array.isArray(payload.modules)) {
        const updatedModules = [];
        for (let i = 0; i < payload.modules.length; i++) {
            const mod = Object.assign({}, payload.modules[i]);
            mod.order = i;
            updatedModules.push(mod);
        }
        return { valid: true, data: { modules: updatedModules } };
    }
    return { valid: true };
}
