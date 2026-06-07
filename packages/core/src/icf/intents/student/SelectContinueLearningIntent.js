import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.121-student-dashboard-open-clean";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
