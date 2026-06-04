export function requireUUIDValidation(value, fieldName) {
    if (typeof value !== "string") {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must be a valid UUID string" }]
        };
    }

    // Simple hex and hyphen check to keep validation explicit.
    // but a standard UUID regex is fine as long as we just string match
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
        return {
            valid: false,
            errors: [{ field: fieldName, message: fieldName + " must be a correctly formatted UUID" }]
        };
    }

    return { valid: true };
}
