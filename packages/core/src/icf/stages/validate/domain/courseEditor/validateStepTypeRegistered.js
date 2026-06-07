import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateStepTypeRegistered(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.stepType, "stepType");
}
