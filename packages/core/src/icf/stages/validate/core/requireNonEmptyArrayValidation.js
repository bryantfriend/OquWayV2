export function requireNonEmptyArrayValidation(value, fieldName) {
    if (!Array.isArray(value)) {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must be an array" }]
        };
    }

    if (value.length === 0) {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must not be empty" }]
        };
    }

    return { valid: true };
}
