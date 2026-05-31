import { collection, db, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "./firebaseConfig.js";

export function getCollection(collectionName) {
  return getDocs(collection(db, collectionName));
}

export function getDocument(collectionName, id) {
  return getDoc(doc(db, collectionName, id));
}

export function setDocument(collectionName, id, data, options) {
  return setDoc(doc(db, collectionName, id), data, options || { merge: true });
}

export function createDocumentRef(collectionName) {
  return doc(collection(db, collectionName));
}

export function deleteDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

export { collection, db, doc, getDocs, serverTimestamp, setDoc };
