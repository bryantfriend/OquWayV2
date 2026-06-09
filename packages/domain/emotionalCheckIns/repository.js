import { db, doc, getDoc, serverTimestamp, setDoc } from "../../firebase/firestore/index.js?v=1.1.161-universal-check-in";
import { buildEmotionalCheckInDocumentId, buildEmotionalCheckInRecord } from "./context.js?v=1.1.161-universal-check-in";

export async function getExistingEmotionalCheckIn(checkInContext) {
  var documentId = buildEmotionalCheckInDocumentId(checkInContext);
  var snapshot = await getDoc(doc(db, "emotionalCheckIns", documentId));

  if (!snapshot.exists()) {
    return null;
  }

  return Object.assign({ id: snapshot.id }, snapshot.data());
}

export async function saveEmotionalCheckIn(checkInContext, selectedEmotionKey) {
  var record = buildEmotionalCheckInRecord(checkInContext, selectedEmotionKey);
  var documentId = buildEmotionalCheckInDocumentId(record);
  var existing = await getExistingEmotionalCheckIn(record);

  if (existing) {
    return {
      id: existing.id,
      exists: true,
      record: existing
    };
  }

  await setDoc(doc(db, "emotionalCheckIns", documentId), Object.assign({}, record, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }));

  return {
    id: documentId,
    exists: false,
    record: record
  };
}
