import { requireStringValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
