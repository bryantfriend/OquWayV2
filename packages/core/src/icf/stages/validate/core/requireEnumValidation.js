export function requireEnumValidation(value, allowedValues, fieldName) {
    if (allowedValues.indexOf(value) === -1) {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must be one of: " + allowedValues.join(", ") }]
        };
    }

    return { valid: true };
}
