import { initApp } from "./js/app/initApp.js?v=1.1.61-assignment-ownership-read";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


