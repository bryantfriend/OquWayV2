import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.143-assignment-course-picker-scroll";
import { initApp } from "./js/app/initApp.js?v=1.1.143-assignment-course-picker-scroll";

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

