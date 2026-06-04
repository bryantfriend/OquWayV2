import { initApp } from "./js/app/initApp.js?v=1.1.43-users-filter-cards";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


