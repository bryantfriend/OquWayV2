import { initApp } from "./js/app/initApp.js?v=1.1.59-teacher-login-errors";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


