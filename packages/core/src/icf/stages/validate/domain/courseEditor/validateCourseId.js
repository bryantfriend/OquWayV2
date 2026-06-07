import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
