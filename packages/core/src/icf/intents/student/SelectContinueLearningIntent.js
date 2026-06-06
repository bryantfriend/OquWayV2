import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.102-student-profile-payload";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
