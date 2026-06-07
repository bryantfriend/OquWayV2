import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
