export function requireBooleanValidation(value, fieldName) {
    if (typeof value !== "boolean") {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must be a boolean" }]
        };
    }

    return { valid: true };
}
