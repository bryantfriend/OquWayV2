import { auth } from "../../packages/core/src/infrastructure/firebase/auth.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
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

// If already logged in → redirect
onAuthStateChanged(auth, function (user) {
    if (user) {
        redirectToReturnTo();
    }
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
        await signInWithEmailAndPassword(auth, email, password);
        redirectToReturnTo();
    } catch (error) {
        errorDiv.textContent = error.message;
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
    if (!document.referrer || document.referrer.indexOf("/apps/super-admin-dashboard/") === -1) {
        return "";
    }

    return document.referrer;
}

function isSafeReturnTo(value) {
    if (!value) {
        return false;
    }

    if (value.indexOf("/") === 0 && value.indexOf("//") !== 0) {
        return true;
    }

    try {
        const url = new URL(value);
        return url.origin === window.location.origin;
    } catch (error) {
        return false;
    }
}
