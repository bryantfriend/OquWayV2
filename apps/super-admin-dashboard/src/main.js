import { initApp } from "./js/app/initApp.js?v=1.1.217-super-admin-modules-users-modal-stack";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


