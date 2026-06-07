import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
