import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
