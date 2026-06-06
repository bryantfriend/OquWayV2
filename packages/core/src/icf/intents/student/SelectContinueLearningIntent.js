import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.99-student-profile-gate";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
