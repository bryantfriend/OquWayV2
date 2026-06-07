import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.86-dev-workflow";
import { initApp } from "./js/app/initApp.js?v=1.1.120-student-course-debug-summary";

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


