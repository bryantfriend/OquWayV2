import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
