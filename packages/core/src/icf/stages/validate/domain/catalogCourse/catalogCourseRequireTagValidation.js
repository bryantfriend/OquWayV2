import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
