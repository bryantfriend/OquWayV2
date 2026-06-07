import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.117-student-identity-binding";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
