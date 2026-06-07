import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.114-student-profile-rules";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
