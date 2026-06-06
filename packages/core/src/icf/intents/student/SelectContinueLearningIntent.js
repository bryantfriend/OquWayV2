import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.81-class-command-center";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
