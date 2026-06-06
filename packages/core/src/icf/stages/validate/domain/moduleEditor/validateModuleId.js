import { requireStringValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
