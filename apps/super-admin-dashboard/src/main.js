import { initApp } from "./js/app/initApp.js?v=1.1.48-admin-callable-sdk";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


