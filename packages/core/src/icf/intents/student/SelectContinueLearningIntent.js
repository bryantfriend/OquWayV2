import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.82-shared-command-center-shell";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
