import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.78-location-command-center";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
