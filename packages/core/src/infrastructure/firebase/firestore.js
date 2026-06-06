import {
    collection,
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

import { firebaseApp } from "./firebaseApp.js?v=1.1.108-student-class-alias-merge";

export const db = initializeFirestore(firebaseApp, {
    localCache: memoryLocalCache()
});

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
