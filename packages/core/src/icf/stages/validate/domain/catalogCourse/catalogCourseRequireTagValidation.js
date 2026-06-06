import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
