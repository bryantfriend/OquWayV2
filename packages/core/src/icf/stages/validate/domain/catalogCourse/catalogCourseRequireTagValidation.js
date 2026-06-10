import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
