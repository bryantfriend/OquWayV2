import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
