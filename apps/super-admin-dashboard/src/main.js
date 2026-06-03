import { initApp } from "./js/app/initApp.js?v=1.1.37-teacher-login-auth";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
