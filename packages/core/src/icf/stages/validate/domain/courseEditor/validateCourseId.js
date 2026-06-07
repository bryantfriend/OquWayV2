import { requireStringValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
