import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
