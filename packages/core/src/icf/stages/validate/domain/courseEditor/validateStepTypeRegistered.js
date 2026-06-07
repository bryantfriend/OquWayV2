import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
