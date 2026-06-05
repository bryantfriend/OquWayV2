import { initApp } from "./js/app/initApp.js?v=1.1.78-location-command-center";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


