import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.97-student-session-uid";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
