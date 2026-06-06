import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.91-student-auth-persistence";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
