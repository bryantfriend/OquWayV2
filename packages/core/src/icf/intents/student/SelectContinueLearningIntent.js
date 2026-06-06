import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.105-student-active-assignment-query";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
