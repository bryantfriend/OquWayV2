import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
