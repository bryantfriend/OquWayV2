import { requireStringValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
