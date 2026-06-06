import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.95-student-icf-root";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
