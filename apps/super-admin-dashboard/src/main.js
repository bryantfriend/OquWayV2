import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.210-module-flow";
import { initApp } from "./js/app/initApp.js?v=1.1.162-modal-stack";

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

