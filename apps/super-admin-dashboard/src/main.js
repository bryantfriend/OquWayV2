import { initApp } from "./js/app/initApp.js?v=1.1.45-repair-callable";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


