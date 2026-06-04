import { initApp } from "./js/app/initApp.js?v=1.1.55-class-ownership";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


