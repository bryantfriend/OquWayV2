import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
