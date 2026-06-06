import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
