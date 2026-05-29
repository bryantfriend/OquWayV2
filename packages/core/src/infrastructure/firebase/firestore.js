import {
    collection,
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

import { firebaseApp } from "./firebaseApp.js";

export const db = initializeFirestore(firebaseApp, {
    localCache: memoryLocalCache()
});

export {
    collection,
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
