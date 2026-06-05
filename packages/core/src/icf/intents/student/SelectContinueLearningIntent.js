import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.62-external-task-review-loop";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
