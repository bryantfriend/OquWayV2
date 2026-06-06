import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.90-student-profile-handoff";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
