import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
