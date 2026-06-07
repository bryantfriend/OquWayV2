import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
