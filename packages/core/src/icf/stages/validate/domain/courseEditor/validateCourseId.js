import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
