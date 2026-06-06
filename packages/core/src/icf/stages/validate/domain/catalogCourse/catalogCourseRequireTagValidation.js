import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
