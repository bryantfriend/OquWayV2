import { initApp } from "./js/app/initApp.js?v=1.1.52-teacher-resolve";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


