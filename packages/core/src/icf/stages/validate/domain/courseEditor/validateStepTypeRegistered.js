import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
