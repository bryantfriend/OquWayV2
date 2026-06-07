import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
