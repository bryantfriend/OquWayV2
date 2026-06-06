import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.93-student-class-alias";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
