import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.80-course-module-command-center";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
