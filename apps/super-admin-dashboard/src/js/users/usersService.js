import { sendStaffResetEmail } from "../firebase/authService.js";
import { createDocumentRef, deleteDocument, getCollection, getDocument, serverTimestamp, setDocument } from "../firebase/firestoreService.js";

export async function getUsers() {
  var snapshot = await getCollection("users");
  var users = [];

  snapshot.forEach(function (userSnap) {
    users.push(Object.assign({ id: userSnap.id }, userSnap.data()));
  });

  return users;
}

export async function getUser(payload) {
  var snapshot = await getDocument("users", payload.userId);

  if (!snapshot.exists()) {
    return null;
  }

  return Object.assign({ id: snapshot.id }, snapshot.data());
}

export async function createUser(payload) {
  var profileRef = payload.userId ? null : createDocumentRef("users");
  var userId = payload.userId || profileRef.id;
  var record = buildUserProfileRecord(payload, true);

  await setDocument("users", userId, record, { merge: true });
  return Object.assign({ id: userId }, record);
}

export async function updateUser(payload) {
  var record = buildUserProfileRecord(payload, false);

  await setDocument("users", payload.userId, record, { merge: true });
  return Object.assign({ id: payload.userId }, record);
}

export async function disableUser(payload) {
  await setDocument("users", payload.userId, {
    status: payload.status || "inactive",
    updatedAt: serverTimestamp()
  }, { merge: true });

  return {
    userId: payload.userId,
    status: payload.status || "inactive"
  };
}

export async function deleteUser(payload) {
  await deleteDocument("users", payload.userId);
  return { userId: payload.userId };
}

export async function sendPasswordReset(payload) {
  await sendStaffResetEmail(payload.email);
  return { email: payload.email };
}

function buildUserProfileRecord(payload, isCreate) {
  var record = {
    displayName: payload.displayName,
    email: payload.email,
    phone: payload.phone,
    photoUrl: payload.photoUrl,
    roles: payload.roles,
    role: readLegacyRole(payload.roles),
    locationIds: payload.locationIds,
    primaryLocationId: payload.primaryLocationId,
    locationId: payload.primaryLocationId,
    status: payload.status,
    name: payload.displayName,
    classId: payload.classId,
    childStudentIds: payload.childStudentIds,
    classIds: payload.classIds,
    updatedAt: serverTimestamp()
  };

  if (isCreate) {
    record.createdAt = serverTimestamp();
  }

  return record;
}

function readLegacyRole(roles) {
  var safeRoles = Array.isArray(roles) ? roles : [];

  if (safeRoles.indexOf("superAdmin") !== -1) {
    return "superAdmin";
  }

  if (safeRoles.indexOf("platformAdmin") !== -1) {
    return "platformAdmin";
  }

  if (safeRoles.indexOf("student") !== -1) {
    return "student";
  }

  return safeRoles[0] || "";
}
