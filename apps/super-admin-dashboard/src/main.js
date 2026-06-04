import { initApp } from "./js/app/initApp.js?v=1.1.56-assignment-ownership";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


