import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
