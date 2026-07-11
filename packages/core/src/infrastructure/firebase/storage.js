import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";
import {
  firebaseApp,
  markFirebaseEmulatorConnected,
  readFirebaseEmulatorHost,
  shouldUseFirebaseEmulators
} from "./firebaseApp.js?v=1.1.82-shared-command-center-shell";

export const storage = getStorage(firebaseApp);

if (shouldUseFirebaseEmulators() && markFirebaseEmulatorConnected("storage")) {
  var storageEmulatorHost = readFirebaseEmulatorHost("storage", "127.0.0.1:9199").split(":");
  connectStorageEmulator(storage, storageEmulatorHost[0], Number(storageEmulatorHost[1] || 9199));
}

export {
  getDownloadURL,
  ref,
  uploadBytes
};
