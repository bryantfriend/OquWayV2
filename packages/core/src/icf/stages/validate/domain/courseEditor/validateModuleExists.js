import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
