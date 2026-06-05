import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function validateFieldExistsInSchema(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.fieldKey, "fieldKey");
}
