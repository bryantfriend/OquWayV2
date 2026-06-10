import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.162-modal-stack";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
