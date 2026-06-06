import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
