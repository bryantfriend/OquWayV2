import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
