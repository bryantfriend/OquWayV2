import { auth } from "../../../packages/core/src/infrastructure/firebase/auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { CourseEditorPage } from './ui/pages/CourseEditorPage.js';
import { CatalogCoursePage } from './ui/pages/CatalogCoursePage.js';
import { CourseOverviewPage } from './ui/pages/CourseOverviewPage.js';
import { LocationLoginSettingsPage } from './ui/pages/LocationLoginSettingsPage.js';

let appInitialized = false;
let currentPage = null;

function initApp() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    if (currentPage && currentPage.unsubscribe) {
        currentPage.unsubscribe();
    }

    const hash = window.location.hash;

    if (hash.startsWith("#overview")) {
        const params = new URLSearchParams(hash.replace("#overview?", ""));
        const courseId = params.get("courseId");
        currentPage = new CourseOverviewPage(courseId);
    } else if (hash.startsWith("#location-login-settings")) {
        currentPage = new LocationLoginSettingsPage();
    } else if (hash.startsWith("#module-editor")) {
        const params = new URLSearchParams(hash.replace("#module-editor?", ""));
        const courseId = params.get("courseId");
        const moduleId = params.get("moduleId");
        currentPage = new CourseEditorPage(courseId, moduleId);
    } else {
        currentPage = new CatalogCoursePage();
    }

    appContainer.innerHTML = currentPage.render();
    if (currentPage.attachEvents) {
        currentPage.attachEvents();
    }
}

window.addEventListener("hashchange", function () {
    if (appInitialized) {
        initApp();
    }
});

onAuthStateChanged(auth, function (user) {
    if (!user) {
        window.location.href = "./login.html";
        return;
    }

    if (!appInitialized) {
        appInitialized = true;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            initApp();
        }
    }
});
