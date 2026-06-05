import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
