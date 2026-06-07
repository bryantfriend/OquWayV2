import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
