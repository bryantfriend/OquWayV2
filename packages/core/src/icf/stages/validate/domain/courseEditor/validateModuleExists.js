import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function validateModuleExists(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.moduleId, "moduleId");
}
