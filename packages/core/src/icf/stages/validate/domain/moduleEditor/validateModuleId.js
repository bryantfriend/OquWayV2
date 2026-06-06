import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
