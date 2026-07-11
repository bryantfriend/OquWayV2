import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
    firebaseApp,
    markFirebaseEmulatorConnected,
    readFirebaseEmulatorHost,
    shouldUseFirebaseEmulators
} from "./firebaseApp.js?v=1.1.82-shared-command-center-shell";

export const auth = getAuth(firebaseApp);

if (shouldUseFirebaseEmulators() && markFirebaseEmulatorConnected("auth")) {
    connectAuthEmulator(auth, "http://" + readFirebaseEmulatorHost("auth", "127.0.0.1:9099"), {
        disableWarnings: true
    });
}
