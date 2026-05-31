import { ContinueLearningIntent } from "./ContinueLearningIntent.js";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
