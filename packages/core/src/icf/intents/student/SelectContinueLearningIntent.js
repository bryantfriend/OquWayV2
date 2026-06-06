import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.101-student-profile-fallback";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
