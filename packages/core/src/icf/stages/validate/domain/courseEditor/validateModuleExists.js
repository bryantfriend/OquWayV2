import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
