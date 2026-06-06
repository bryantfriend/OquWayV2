import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
