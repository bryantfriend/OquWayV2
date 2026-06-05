import { auth } from "../../../packages/firebase/auth/index.js?v=1.1.78-location-command-center";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { verifyCourseCreatorAccess, normalizeRole } from "./auth/courseCreatorAuth.js?v=1.1.78-location-command-center";
import { CourseEditorPage } from "./ui/pages/CourseEditorPage.js?v=1.1.78-location-command-center";
import { StepPreviewPage } from "./ui/pages/StepPreviewPage.js?v=1.1.78-location-command-center";
import { CatalogCoursePage } from "./ui/pages/CatalogCoursePage.js?v=1.1.78-location-command-center";
import { CourseOverviewPage } from "./ui/pages/CourseOverviewPage.js?v=1.1.78-location-command-center";
import { LocationLoginSettingsPage } from "./ui/pages/LocationLoginSettingsPage.js?v=1.1.78-location-command-center";

console.warn("[course-creator-build-check] latest build active");

let appInitialized = false;
let currentPage = null;

function initApp() {
    const appContainer = document.getElementById("app");
    if (!appContainer) return;

    if (currentPage && typeof currentPage.destroy === "function") {
        currentPage.destroy();
    } else if (currentPage && currentPage.unsubscribe) {
        currentPage.unsubscribe();
    }

    const hash = window.location.hash;

    if (hash.startsWith("#overview")) {
        const params = new URLSearchParams(hash.replace("#overview?", ""));
        const courseId = params.get("courseId");
        currentPage = new CourseOverviewPage(courseId, {
            openPreview: params.get("preview") === "1",
            focusAssignment: params.get("assign") === "1",
            publishOnOpen: params.get("publish") === "1"
        });
    } else if (hash.startsWith("#location-login-settings")) {
        currentPage = new LocationLoginSettingsPage();
    } else if (hash.startsWith("#module-editor")) {
        const params = new URLSearchParams(hash.replace("#module-editor?", ""));
        const courseId = params.get("courseId");
        const moduleId = params.get("moduleId");
        currentPage = new CourseEditorPage(courseId, moduleId);
    } else if (hash.startsWith("#step-preview")) {
        const params = new URLSearchParams(hash.replace("#step-preview?", ""));
        const courseId = params.get("courseId");
        const moduleId = params.get("moduleId");
        const modeId = params.get("modeId");
        const stepId = params.get("stepId");
        currentPage = new StepPreviewPage(courseId, moduleId, modeId, stepId);
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

onAuthStateChanged(auth, async function (user) {
    if (!user) {
        window.location.href = "./login.html?returnTo=" + encodeURIComponent(window.location.href);
        return;
    }

    const access = await verifyCourseCreatorAccess(user, { source: "app-shell" });
    if (!access.allowed) {
        await routeUnauthorizedUser(access.role);
        return;
    }

    if (!appInitialized) {
        appInitialized = true;
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initApp);
        } else {
            initApp();
        }
    }
});

async function routeUnauthorizedUser(role) {
    const normalizedRole = normalizeRole(role);
    const message = normalizedRole === "student"
        ? "Please log in with a Course Creator or Admin account."
        : "Course Creator access requires an admin or course creator account.";

    if (window.sessionStorage) {
        window.sessionStorage.setItem("oquwayCourseCreatorLoginMessage", message);
        window.sessionStorage.removeItem("oquwayAdminReturnTo");
    }

    try {
        await signOut(auth);
    } catch (error) {
        console.warn("[course-builder-auth] Could not sign out unauthorized user.", {
            role: normalizedRole,
            errorCode: error && error.code ? error.code : "",
            message: error && error.message ? error.message : String(error)
        });
    }

    window.location.href = "./login.html";
}
