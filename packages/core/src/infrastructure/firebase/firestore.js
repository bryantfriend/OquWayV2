import {
    collection,
    connectFirestoreEmulator,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    initializeFirestore,
    memoryLocalCache,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch
} from "firebase/firestore";

import {
    firebaseApp,
    markFirebaseEmulatorConnected,
    readFirebaseEmulatorHost,
    shouldUseFirebaseEmulators
} from "./firebaseApp.js?v=1.1.82-shared-command-center-shell";

export const db = initializeFirestore(firebaseApp, {
    localCache: memoryLocalCache()
});

if (shouldUseFirebaseEmulators() && markFirebaseEmulatorConnected("firestore")) {
    var firestoreEmulatorHost = readFirebaseEmulatorHost("firestore", "127.0.0.1:8080").split(":");
    connectFirestoreEmulator(db, firestoreEmulatorHost[0], Number(firestoreEmulatorHost[1] || 8080));
}

export {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch
};
