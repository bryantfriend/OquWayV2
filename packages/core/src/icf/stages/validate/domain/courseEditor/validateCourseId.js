import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function validateCourseId(executionState) {
    const { payload } = executionState;
    return requireStringValidation(payload.courseId, "courseId");
}
