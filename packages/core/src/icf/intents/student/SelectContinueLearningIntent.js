import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.109-student-assignment-status-fallback";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
