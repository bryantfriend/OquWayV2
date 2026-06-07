import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
