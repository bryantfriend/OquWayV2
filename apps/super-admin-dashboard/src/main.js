import { initApp } from "./js/app/initApp.js?v=1.1.51-teacher-dedupe";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


