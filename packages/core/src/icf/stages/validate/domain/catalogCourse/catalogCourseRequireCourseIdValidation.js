import { requireUUIDValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
