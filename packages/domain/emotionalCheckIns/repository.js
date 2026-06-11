import { collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../../firebase/firestore/index.js?v=1.1.162-modal-stack";
import { buildEmotionalCheckInDocumentId, buildEmotionalCheckInRecord } from "./context.js?v=1.1.162-modal-stack";

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
    await setDoc(doc(db, "emotionalCheckIns", documentId), Object.assign({}, record, {
      createdAt: existing.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    }), { merge: true });

    return {
      id: existing.id,
      exists: true,
      record: Object.assign({}, existing, record)
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

export async function getEmotionalCheckInsForClassDates(classId, checkInDates) {
  var safeClassId = readText(classId);
  var safeDates = Array.isArray(checkInDates)
    ? checkInDates.map(readText).filter(Boolean)
    : [];
  var records = [];

  if (!safeClassId || safeDates.length === 0) {
    return records;
  }

  var dateChunks = createChunks(uniqueValues(safeDates), 10);
  var chunkIndex = 0;

  while (chunkIndex < dateChunks.length) {
    var snapshot = await getDocs(query(
      collection(db, "emotionalCheckIns"),
      where("classId", "==", safeClassId),
      where("checkInDate", "in", dateChunks[chunkIndex])
    ));

    snapshot.forEach(function (documentSnapshot) {
      records.push(Object.assign({ id: documentSnapshot.id }, documentSnapshot.data() || {}));
    });

    chunkIndex += 1;
  }

  return records;
}

function createChunks(values, chunkSize) {
  var chunks = [];
  var index = 0;

  while (index < values.length) {
    chunks.push(values.slice(index, index + chunkSize));
    index += chunkSize;
  }

  return chunks;
}

function uniqueValues(values) {
  return values.filter(function (value, index, list) {
    return value && list.indexOf(value) === index;
  });
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
