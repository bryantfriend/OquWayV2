import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
