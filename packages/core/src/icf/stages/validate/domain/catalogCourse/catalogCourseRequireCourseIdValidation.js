import { requireUUIDValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
