import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.79-user-command-center";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
