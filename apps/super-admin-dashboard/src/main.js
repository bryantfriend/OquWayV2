import { initApp } from "./js/app/initApp.js?v=1.1.54-multi-role-assistant";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


