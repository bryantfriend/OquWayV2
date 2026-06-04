import { initApp } from "./js/app/initApp.js?v=1.1.46-admin-motion";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


