import { requireStringValidation } from "../../validators.js?v=1.1.81-class-command-center";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
