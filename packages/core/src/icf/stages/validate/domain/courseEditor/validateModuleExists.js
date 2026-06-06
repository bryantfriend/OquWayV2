import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
