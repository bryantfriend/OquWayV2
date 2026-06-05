import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
