import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.110-student-class-alias-query";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
