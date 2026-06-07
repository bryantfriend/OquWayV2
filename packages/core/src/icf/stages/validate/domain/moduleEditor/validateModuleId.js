import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
