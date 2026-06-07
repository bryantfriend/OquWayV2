import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
