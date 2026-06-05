import { sendPasswordResetEmail } from "firebase/auth";
import { auth, collection, db, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "../../../../../packages/firebase/index.js?v=1.1.66-super-admin-cleanup";

export async function getUsers() {
  var snapshot = await getDocs(collection(db, "users"));
  var users = [];

  snapshot.forEach(function (userSnap) {
    users.push(Object.assign({ id: userSnap.id }, userSnap.data()));
  });

  return users;
}

export async function getUser(payload) {
  var snapshot = await getDoc(doc(db, "users", payload.userId));

  if (!snapshot.exists()) {
    return null;
  }

  return Object.assign({ id: snapshot.id }, snapshot.data());
}

export async function createUser(payload) {
  var profileRef = payload.userId ? null : doc(collection(db, "users"));
  var userId = payload.userId || profileRef.id;
  var record = buildUserProfileRecord(payload, true);

  await setDoc(doc(db, "users", userId), record, { merge: true });
  return Object.assign({ id: userId }, record);
}

export async function updateUser(payload) {
  var record = buildUserProfileRecord(payload, false);

  await setDoc(doc(db, "users", payload.userId), record, { merge: true });
  return Object.assign({ id: payload.userId }, record);
}

export async function disableUser(payload) {
  await setDoc(doc(db, "users", payload.userId), {
    status: payload.status || "inactive",
    updatedAt: serverTimestamp()
  }, { merge: true });

  return {
    userId: payload.userId,
    status: payload.status || "inactive"
  };
}

export async function deleteUser(payload) {
  await deleteDoc(doc(db, "users", payload.userId));
  return { userId: payload.userId };
}

export async function sendPasswordReset(payload) {
  await sendPasswordResetEmail(auth, payload.email);
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

  if (safeRoles.indexOf("schoolAdmin") !== -1) {
    return "schoolAdmin";
  }

  if (safeRoles.indexOf("courseCreator") !== -1) {
    return "courseCreator";
  }

  if (safeRoles.indexOf("assistant") !== -1) {
    return "assistant";
  }

  if (safeRoles.indexOf("student") !== -1) {
    return "student";
  }

  return safeRoles[0] || "";
}
