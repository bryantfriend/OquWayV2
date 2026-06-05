import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.63-external-task-student-feedback";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
