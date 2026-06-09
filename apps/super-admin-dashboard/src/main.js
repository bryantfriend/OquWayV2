import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.142-admin-modal-pickers";
import { initApp } from "./js/app/initApp.js?v=1.1.142-admin-modal-pickers";

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

