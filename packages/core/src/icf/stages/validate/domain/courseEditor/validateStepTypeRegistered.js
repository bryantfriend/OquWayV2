import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
