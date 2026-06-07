import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
