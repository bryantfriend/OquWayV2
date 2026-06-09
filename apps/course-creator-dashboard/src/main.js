import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.152-course-builder-loading-timeout";
import { auth } from "../../../packages/firebase/auth/index.js?v=1.1.152-course-builder-loading-timeout";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { verifyCourseCreatorAccess, normalizeRole } from "./auth/courseCreatorAuth.js?v=1.1.152-course-builder-loading-timeout";
import { CourseEditorPage } from "./ui/pages/CourseEditorPage.js?v=1.1.152-course-builder-loading-timeout";
import { StepPreviewPage } from "./ui/pages/StepPreviewPage.js?v=1.1.152-course-builder-loading-timeout";
import { CatalogCoursePage } from "./ui/pages/CatalogCoursePage.js?v=1.1.152-course-builder-loading-timeout";
import { CourseOverviewPage } from "./ui/pages/CourseOverviewPage.js?v=1.1.152-course-builder-loading-timeout";
import { LocationLoginSettingsPage } from "./ui/pages/LocationLoginSettingsPage.js?v=1.1.152-course-builder-loading-timeout";

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);
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

    showAppLoading("Checking staff access...", "Verifying your Course Builder workspace.");

    const access = await withTimeout(
        verifyCourseCreatorAccess(user, { source: "app-shell" }),
        20000,
        "Course Creator access check timed out. Refresh and try again."
    ).catch(function (error) {
        showAppError("Course Builder could not verify your access.", error.message);
        return { allowed: false, role: "", timedOut: true };
    });

    if (access.timedOut) {
        return;
    }

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

function showAppLoading(title, note) {
    const appContainer = document.getElementById("app");

    if (!appContainer) {
        return;
    }

    appContainer.innerHTML = '<section class="course-builder-boot" role="status" aria-live="polite">'
        + '<div class="course-builder-boot-card">'
        + '<div class="course-builder-boot-orbit" aria-hidden="true"><span><i class="fa-solid fa-wand-magic-sparkles"></i></span><i></i><b></b></div>'
        + '<p>Course Builder launch pad</p>'
        + '<h1>' + escapeHtml(title || "Loading Course Builder...") + '</h1>'
        + '<small>' + escapeHtml(note || "Gathering catalog, modules, and lesson tools.") + '</small>'
        + '<div class="course-builder-boot-steps" aria-hidden="true"><span></span><span></span><span></span></div>'
        + '</div>'
        + '</section>';
}

function showAppError(title, note) {
    const appContainer = document.getElementById("app");

    if (!appContainer) {
        return;
    }

    appContainer.innerHTML = '<section class="course-builder-boot course-builder-boot-error">'
        + '<div class="course-builder-boot-card">'
        + '<div class="course-builder-boot-orbit" aria-hidden="true"><span><i class="fa-solid fa-triangle-exclamation"></i></span></div>'
        + '<p>Course Builder needs attention</p>'
        + '<h1>' + escapeHtml(title || "Could not load Course Builder") + '</h1>'
        + '<small>' + escapeHtml(note || "Refresh and try again.") + '</small>'
        + '<button type="button" onclick="window.location.reload()">Refresh</button>'
        + '</div>'
        + '</section>';
}

function withTimeout(promise, timeoutMs, message) {
    return new Promise(function (resolve, reject) {
        const timerId = window.setTimeout(function () {
            reject(new Error(message || "Request timed out."));
        }, timeoutMs);

        promise.then(function (value) {
            window.clearTimeout(timerId);
            resolve(value);
        }).catch(function (error) {
            window.clearTimeout(timerId);
            reject(error);
        });
    });
}

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
