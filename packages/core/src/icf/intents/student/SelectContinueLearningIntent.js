import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.98-student-session-proof";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
