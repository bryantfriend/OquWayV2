import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
