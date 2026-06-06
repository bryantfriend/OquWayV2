import { ContinueLearningIntent } from "./ContinueLearningIntent.js?v=1.1.107-student-firebase-auth-chain";

export function SelectContinueLearningIntent() {
  return Object.assign({}, ContinueLearningIntent(), {
    type: "SelectContinueLearningIntent"
  });
}
