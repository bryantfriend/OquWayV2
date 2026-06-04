import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
