import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.116-student-token-ready";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
