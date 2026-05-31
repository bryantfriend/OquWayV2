import { auth } from "../../../packages/core/src/infrastructure/firebase/auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { db, doc, getDoc } from "../../../packages/core/src/infrastructure/firebase/firestore.js";
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

    var access = await verifyCourseBuilderAccess(user);
    if (!access.allowed) {
        routeUnauthorizedUser(access.role);
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

async function verifyCourseBuilderAccess(user) {
    try {
        var tokenResult = await user.getIdTokenResult();
        var claims = tokenResult && tokenResult.claims ? tokenResult.claims : {};
        var profileSnap = await getDoc(doc(db, "users", user.uid));
        var profile = profileSnap.exists() ? profileSnap.data() : {};
        var role = normalizeRole(profile.role || claims.role || "");
        var roles = normalizeRoles([]
            .concat(profile.roles || [])
            .concat(profile.userRoles || [])
            .concat(claims.roles || [])
            .concat(claims.userRoles || []));

        if (isAllowedStaffRole(role) || roles.some(isAllowedStaffRole)) {
            return { allowed: true, role: role || roles[0] || "" };
        }

        return { allowed: false, role: role || roles[0] || "" };
    } catch (error) {
        console.warn("[course-builder-auth] Could not verify profile before loading UI.", {
            uid: user.uid,
            errorCode: error && error.code ? error.code : "",
            message: error && error.message ? error.message : String(error)
        });
        return { allowed: false, role: "" };
    }
}

function routeUnauthorizedUser(role) {
    if (normalizeRole(role) === "student") {
        window.sessionStorage.setItem("oquwayStudentLoginMessage", "Your student account opens the Student Dashboard, not Course Builder.");
        window.location.href = "../student-dashboard/index.html";
        return;
    }

    document.getElementById("app").innerHTML = '<main class="min-h-screen grid place-items-center bg-slate-50 p-6"><section class="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"><h1 class="text-2xl font-black text-slate-950">Course Builder access required</h1><p class="mt-2 text-sm font-semibold text-slate-600">This workspace is available to admins and course creators only.</p><a class="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white" href="./login.html">Use another account</a></section></main>';
}

function normalizeRoles(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map(normalizeRole).filter(Boolean);
}

function normalizeRole(value) {
    if (typeof value !== "string") {
        return "";
    }

    var normalized = value.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (normalized === "superadmin") return "superAdmin";
    if (normalized === "platformadmin") return "platformAdmin";
    if (normalized === "schooladmin") return "schoolAdmin";
    if (normalized === "coursecreator") return "courseCreator";
    if (normalized === "admin") return "admin";
    if (normalized === "student") return "student";
    return normalized;
}

function isAllowedStaffRole(role) {
    return role === "superAdmin"
        || role === "platformAdmin"
        || role === "schoolAdmin"
        || role === "admin"
        || role === "courseCreator";
}
