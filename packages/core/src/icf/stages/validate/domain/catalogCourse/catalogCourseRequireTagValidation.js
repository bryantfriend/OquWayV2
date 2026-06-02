import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
