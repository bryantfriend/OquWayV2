import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.113-student-rules-read";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
