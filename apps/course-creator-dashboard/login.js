import { auth } from "../../packages/core/src/infrastructure/firebase/auth.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("error");
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
