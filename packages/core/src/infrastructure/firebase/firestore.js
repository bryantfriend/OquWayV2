import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    initializeFirestore,
    limit,
    memoryLocalCache,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch
} from "firebase/firestore";

import { firebaseApp } from "./firebaseApp.js?v=1.1.162-modal-stack";

export const db = initializeFirestore(firebaseApp, {
    localCache: memoryLocalCache()
});

export {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch
};
