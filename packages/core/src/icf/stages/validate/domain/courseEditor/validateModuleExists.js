import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
