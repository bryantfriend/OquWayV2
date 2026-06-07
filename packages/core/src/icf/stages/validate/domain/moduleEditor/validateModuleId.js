import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
