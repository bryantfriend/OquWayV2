import { initApp } from "./js/app/initApp.js?v=1.1.65-architecture-phase1";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


