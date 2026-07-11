import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBaMBZpawyx2uUc-0_ImZtG7Ast8t2PjvM",
    authDomain: "oquway-c1160.firebaseapp.com",
    projectId: "oquway-c1160",
    storageBucket: "oquway-c1160.firebasestorage.app",
    messagingSenderId: "54166550685",
    appId: "1:54166550685:web:8cd6c5e8a77b8a5558fc74",
    measurementId: "G-GKX81PPMKD"
};

export const firebaseApp = initializeApp(firebaseConfig);

const firebaseEmulatorConnectionState = {};

export function shouldUseFirebaseEmulators() {
    if (typeof window === "undefined" || !isLocalFirebaseHost()) {
        return false;
    }

    rememberFirebaseEmulatorPreference();

    try {
        return window.localStorage.getItem("oquwayUseFirebaseEmulator") === "true";
    } catch (error) {
        return false;
    }
}

export function readFirebaseEmulatorHost(serviceName, fallbackHost) {
    var paramName = "firebase" + serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + "EmulatorHost";
    var value = "";

    if (typeof window !== "undefined" && window.location && window.location.search) {
        value = new URLSearchParams(window.location.search).get(paramName) || "";
    }

    return value || fallbackHost;
}

export function markFirebaseEmulatorConnected(serviceName) {
    if (firebaseEmulatorConnectionState[serviceName]) {
        return false;
    }

    firebaseEmulatorConnectionState[serviceName] = true;
    return true;
}

function rememberFirebaseEmulatorPreference() {
    var searchParams = null;
    var requested = "";

    try {
        searchParams = new URLSearchParams(window.location.search);
        requested = searchParams.get("useFirebaseEmulator") || searchParams.get("useEmulator") || "";

        if (requested === "1" || requested === "true") {
            window.localStorage.setItem("oquwayUseFirebaseEmulator", "true");
        }

        if (requested === "0" || requested === "false") {
            window.localStorage.removeItem("oquwayUseFirebaseEmulator");
        }
    } catch (error) {
        return;
    }
}

function isLocalFirebaseHost() {
    return window.location
        && (window.location.hostname === "localhost"
            || window.location.hostname === "127.0.0.1"
            || window.location.hostname === "");
}
