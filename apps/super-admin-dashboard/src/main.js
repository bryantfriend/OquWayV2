import { initApp } from "./js/app/initApp.js?v=1.1.49-admin-users-fix";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


