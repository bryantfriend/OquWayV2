import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.89-student-fruit-session";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
