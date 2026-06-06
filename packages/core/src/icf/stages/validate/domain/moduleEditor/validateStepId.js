import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function validateStepId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.stepId, "stepId");
}
