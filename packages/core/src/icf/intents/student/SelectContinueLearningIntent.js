import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.96-student-session-profile";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
