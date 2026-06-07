import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
