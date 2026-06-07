import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
