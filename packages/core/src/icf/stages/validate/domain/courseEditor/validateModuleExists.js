import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
