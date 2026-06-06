import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.94-student-profile-context";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
