import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
