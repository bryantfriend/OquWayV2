import { initApp } from "./js/app/initApp.js?v=1.1.58-shared-phase1";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


