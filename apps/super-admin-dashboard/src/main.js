import { initApp } from "./js/app/initApp.js?v=1.1.66-super-admin-cleanup";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


