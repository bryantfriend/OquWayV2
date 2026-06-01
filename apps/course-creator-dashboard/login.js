import { auth } from "../../packages/core/src/infrastructure/firebase/auth.js";
import { db, doc, getDoc } from "../../packages/core/src/infrastructure/firebase/firestore.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("error");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const resetModal = document.getElementById("resetModal");
const resetEmailInput = document.getElementById("resetEmail");
const resetSubmitBtn = document.getElementById("resetSubmitBtn");
const resetCancelBtn = document.getElementById("resetCancelBtn");
const resetStatus = document.getElementById("resetStatus");
const returnToUrl = captureReturnToUrl();
let redirectStarted = false;

showInitialLoginMessage();

onAuthStateChanged(auth, async function (user) {
    if (!user || redirectStarted) {
        return;
    }

    const access = await verifyCourseCreatorAccess(user);

    if (access.allowed) {
        redirectToReturnTo();
        return;
    }

    await rejectUnauthorizedUser(access.role);
});

loginBtn.addEventListener("click", async function () {
    errorDiv.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        errorDiv.textContent = "Email and password required.";
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "Checking access...";
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const access = await verifyCourseCreatorAccess(credential.user);

        if (!access.allowed) {
            await rejectUnauthorizedUser(access.role);
            return;
        }

        redirectToReturnTo();
    } catch (error) {
        errorDiv.textContent = readFriendlyLoginError(error);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
});

forgotPasswordBtn.addEventListener("click", function () {
    openResetModal();
});

resetCancelBtn.addEventListener("click", function () {
    closeResetModal();
});

resetModal.addEventListener("click", function (event) {
    if (event.target === resetModal) {
        closeResetModal();
    }
});

resetSubmitBtn.addEventListener("click", async function () {
    await sendStaffPasswordReset();
});

resetEmailInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        await sendStaffPasswordReset();
    }
});

function openResetModal() {
    resetEmailInput.value = emailInput.value.trim();
    resetStatus.textContent = "";
    resetStatus.className = "status";
    resetModal.removeAttribute("hidden");
    resetEmailInput.focus();
}

function closeResetModal() {
    resetModal.setAttribute("hidden", "hidden");
    setResetLoading(false);
}

async function sendStaffPasswordReset() {
    const email = resetEmailInput.value.trim();

    resetStatus.textContent = "";
    resetStatus.className = "status";

    if (!email) {
        showResetStatus("Enter your email address.", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showResetStatus("Enter a valid email address.", "error");
        return;
    }

    try {
        setResetLoading(true);
        await sendPasswordResetEmail(auth, email);
        showResetStatus("If an account exists for this email, a reset link has been sent.", "success");
    } catch (error) {
        if (error && error.code === "auth/invalid-email") {
            showResetStatus("Enter a valid email address.", "error");
        } else {
            showResetStatus("If an account exists for this email, a reset link has been sent.", "success");
        }
    } finally {
        setResetLoading(false);
    }
}

function showResetStatus(message, type) {
    resetStatus.textContent = message;
    resetStatus.className = "status " + type;
}

function setResetLoading(isLoading) {
    resetSubmitBtn.disabled = isLoading;
    resetCancelBtn.disabled = isLoading;
    resetSubmitBtn.textContent = isLoading ? "Sending..." : "Send Reset Link";
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function captureReturnToUrl() {
    const returnTo = readReturnToUrl();

    if (isSafeReturnTo(returnTo) && returnTo !== "./index.html") {
        writeStoredReturnTo(returnTo);
    }

    return returnTo;
}

function redirectToReturnTo() {
    if (redirectStarted) {
        return;
    }

    redirectStarted = true;
    const target = returnToUrl || readReturnToUrl();
    clearStoredReturnTo();
    window.location.href = target;
}

function readReturnToUrl() {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo") || readStoredReturnTo() || readReferrerReturnTo();

    if (isSafeReturnTo(returnTo)) {
        return returnTo;
    }

    return "./index.html";
}

function readStoredReturnTo() {
    if (!window.sessionStorage) {
        return "";
    }

    return window.sessionStorage.getItem("oquwayAdminReturnTo") || "";
}

function writeStoredReturnTo(value) {
    if (window.sessionStorage) {
        window.sessionStorage.setItem("oquwayAdminReturnTo", value);
    }
}

function clearStoredReturnTo() {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem("oquwayAdminReturnTo");
    }
}

function readReferrerReturnTo() {
    if (!document.referrer || document.referrer.indexOf("/apps/course-creator-dashboard/") === -1) {
        return "";
    }

    return document.referrer;
}

function isSafeReturnTo(value) {
    if (!value) {
        return false;
    }

    if (value === "./index.html" || value.indexOf("./index.html") === 0) {
        return true;
    }

    try {
        const url = new URL(value, window.location.href);
        return url.origin === window.location.origin
            && url.pathname.indexOf("/apps/course-creator-dashboard/") !== -1
            && url.pathname.indexOf("/login.html") === -1;
    } catch (error) {
        return false;
    }
}

async function verifyCourseCreatorAccess(user) {
    try {
        const tokenResult = await user.getIdTokenResult();
        const claims = tokenResult && tokenResult.claims ? tokenResult.claims : {};
        const profileSnap = await getDoc(doc(db, "users", user.uid));
        const profile = profileSnap.exists() ? profileSnap.data() : {};
        const role = normalizeRole(profile.role || claims.role || "");
        const roles = normalizeRoles([])
            .concat(normalizeRoles(profile.roles))
            .concat(normalizeRoles(profile.userRoles))
            .concat(normalizeRoles(claims.roles))
            .concat(normalizeRoles(claims.userRoles));

        if (isAllowedCourseCreatorRole(role) || roles.some(isAllowedCourseCreatorRole)) {
            return { allowed: true, role: role || roles[0] || "" };
        }

        return { allowed: false, role: role || roles[0] || "" };
    } catch (error) {
        console.warn("[course-builder-login] Could not verify Course Creator access.", {
            uid: user && user.uid ? user.uid : "",
            errorCode: error && error.code ? error.code : "",
            message: error && error.message ? error.message : String(error)
        });
        return { allowed: false, role: "" };
    }
}

async function rejectUnauthorizedUser(role) {
    const normalizedRole = normalizeRole(role);
    const message = normalizedRole === "student"
        ? "Please log in with a Course Creator or Admin account."
        : "Course Creator access requires an admin or course creator account.";

    try {
        await signOut(auth);
    } catch (error) {
        console.warn("[course-builder-login] Could not sign out unauthorized account.", {
            role: normalizedRole,
            errorCode: error && error.code ? error.code : "",
            message: error && error.message ? error.message : String(error)
        });
    }

    clearStoredReturnTo();
    errorDiv.textContent = message;
}

function showInitialLoginMessage() {
    const message = readStoredLoginMessage() || readQueryMessage();

    if (message) {
        errorDiv.textContent = message;
    }
}

function readStoredLoginMessage() {
    if (!window.sessionStorage) {
        return "";
    }

    const message = window.sessionStorage.getItem("oquwayCourseCreatorLoginMessage") || "";
    window.sessionStorage.removeItem("oquwayCourseCreatorLoginMessage");
    return message;
}

function readQueryMessage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("message") || "";
}

function readFriendlyLoginError(error) {
    if (error && error.code === "auth/invalid-email") {
        return "Enter a valid email address.";
    }

    if (error && (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential")) {
        return "Email or password is incorrect.";
    }

    return error && error.message ? error.message : "Login failed. Please try again.";
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

    const normalized = value.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

    if (normalized === "superadmin") return "superAdmin";
    if (normalized === "platformadmin") return "platformAdmin";
    if (normalized === "schooladmin") return "schoolAdmin";
    if (normalized === "coursecreator") return "courseCreator";
    if (normalized === "admin") return "admin";
    if (normalized === "student") return "student";

    return normalized;
}

function isAllowedCourseCreatorRole(role) {
    return role === "superAdmin"
        || role === "platformAdmin"
        || role === "schoolAdmin"
        || role === "courseCreator";
}
