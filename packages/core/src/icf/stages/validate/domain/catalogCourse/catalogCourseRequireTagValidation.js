import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
