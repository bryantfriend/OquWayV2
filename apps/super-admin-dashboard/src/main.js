import { initApp } from "./js/app/initApp.js?v=1.1.71-course-assignment-cleanup";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


