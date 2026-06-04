import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.54-multi-role-assistant";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
