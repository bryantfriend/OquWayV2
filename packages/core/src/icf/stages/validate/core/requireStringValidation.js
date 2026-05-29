export function requireStringValidation(value, fieldName) {
    if (value === undefined || value === null) {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " is required" }]
        };
    }

    if (typeof value !== "string") {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must be a string" }]
        };
    }

    if (value.trim() === "") {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " cannot be empty" }]
        };
    }

    return { valid: true };
}
