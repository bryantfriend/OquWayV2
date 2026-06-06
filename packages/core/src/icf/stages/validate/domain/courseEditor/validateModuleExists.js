import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
