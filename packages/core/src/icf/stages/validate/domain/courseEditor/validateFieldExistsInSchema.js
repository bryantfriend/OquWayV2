import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
