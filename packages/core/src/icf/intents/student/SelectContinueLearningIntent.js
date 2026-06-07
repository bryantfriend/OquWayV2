import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.111-student-assignment-debug-panel";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
