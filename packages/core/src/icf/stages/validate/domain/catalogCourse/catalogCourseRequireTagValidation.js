import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
