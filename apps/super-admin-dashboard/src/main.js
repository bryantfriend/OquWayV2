import { initApp } from "./js/app/initApp.js?v=1.1.44-classes-filter";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}


