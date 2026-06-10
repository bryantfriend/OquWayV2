import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
