import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
