import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateModuleId(executionState) {
    const payload = executionState.payload;
    return requireStringValidation(payload.moduleId, "moduleId");
}
