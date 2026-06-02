import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateOrderBounds(executionState) {
    const { payload } = executionState;
    if (typeof payload.fromIndex !== "number" || typeof payload.toIndex !== "number") {
        return {
            valid: false,
            errors: [{ field: "index", message: "fromIndex and toIndex must be numbers" }]
        };
    }
    return { valid: true };
}
