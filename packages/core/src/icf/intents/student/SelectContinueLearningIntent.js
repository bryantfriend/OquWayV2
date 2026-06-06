import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.100-student-profile-actor";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
