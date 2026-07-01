import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";
import { requireEnumValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";
import { requireUUIDValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function catalogCourseRequireLanguagesValidation(executionState) {
    const { payload } = executionState;
    const result = requireNonEmptyArrayValidation(payload.languages, "languages");

    if (!result.valid) {
        return result;
    }

    for (let i = 0; i < payload.languages.length; i++) {
        const langResult = requireStringValidation(payload.languages[i], "languages[" + i + "]");
        if (!langResult.valid) {
            return langResult;
        }
    }

    if (!payload.defaultLanguage) {
        return {
            valid: false,
            errors: [{ field: "defaultLanguage", message: "Default language is required" }]
        };
    }

    if (payload.languages.indexOf(payload.defaultLanguage) === -1) {
        return {
            valid: false,
            errors: [{ field: "defaultLanguage", message: "Default language must be in languages array" }]
        };
    }

    return { valid: true };
}
