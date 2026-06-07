import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
