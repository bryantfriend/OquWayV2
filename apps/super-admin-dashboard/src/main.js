import { initApp } from "./js/app/initApp.js?v=1.1.38-user-edit-modal";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
