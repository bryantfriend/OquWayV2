import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
