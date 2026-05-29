import { auth } from "../../packages/core/src/infrastructure/firebase/auth.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("error");

// If already logged in → redirect
onAuthStateChanged(auth, function (user) {
    if (user) {
        window.location.href = "./index.html";
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
        window.location.href = "./index.html";
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});
