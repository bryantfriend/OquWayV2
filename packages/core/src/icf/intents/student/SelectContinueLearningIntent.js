import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.73-student-course-polish";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
