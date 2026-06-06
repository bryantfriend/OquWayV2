import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
