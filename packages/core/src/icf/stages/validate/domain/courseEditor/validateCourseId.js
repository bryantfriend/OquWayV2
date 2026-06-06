import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
