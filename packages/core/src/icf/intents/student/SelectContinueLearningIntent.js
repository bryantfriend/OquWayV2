import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.103-student-profile-actor-fallback";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
