import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
