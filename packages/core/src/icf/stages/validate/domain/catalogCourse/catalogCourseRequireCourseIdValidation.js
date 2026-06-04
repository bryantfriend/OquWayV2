import { requireUUIDValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
