import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
