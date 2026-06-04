import { initApp } from "./js/app/initApp.js?v=1.1.50-teacher-profile-merge";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


