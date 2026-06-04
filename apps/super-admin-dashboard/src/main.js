import { initApp } from "./js/app/initApp.js?v=1.1.41-teacher-auth-mirror";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


