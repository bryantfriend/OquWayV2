import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
