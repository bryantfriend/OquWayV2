import { requireStringValidation } from "../../validators.js?v=1.1.81-class-command-center";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
