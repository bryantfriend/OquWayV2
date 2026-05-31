const crypto = require("crypto");
const admin = require("firebase-admin");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

admin.initializeApp();

exports.studentLogin = onCall(async function (request) {
  const data = request.data || {};
  const action = data.action || "";

  if (!action && data.studentId && data.fruitPassword) {
    return loginStudent(data);
  }

  if (action === "listClasses") {
    return listClasses(data);
  }

  if (action === "listStudents") {
    return listStudents(data);
  }

  if (action === "login") {
    return loginStudent(data);
  }

  throw new HttpsError("invalid-argument", "Unknown student login action.");
});

exports.resetStudentFruitPassword = onCall(async function (request) {
  const auth = request.auth;
  const data = request.data || {};

  verifyAdminCaller(auth);
  return resetStudentFruitPassword(data);
});

async function listClasses(data) {
  const locationId = readRequiredText(data.locationId, "locationId");
  const db = admin.firestore();
  const classes = [];

  const nestedSnapshot = await db.collection("locations").doc(locationId).collection("classes").get();
  nestedSnapshot.forEach(function (classDoc) {
    const classData = classDoc.data() || {};

    if (shouldIncludeActiveRecord(classData)) {
      classes.push(sanitizeClass(classDoc.id, classData));
    }
  });

  if (classes.length === 0) {
    const topLevelSnapshot = await db.collection("classes").where("locationId", "==", locationId).get();
    topLevelSnapshot.forEach(function (classDoc) {
      const classData = classDoc.data() || {};

      if (shouldIncludeActiveRecord(classData)) {
        classes.push(sanitizeClass(classDoc.id, classData));
      }
    });
  }

  classes.sort(compareByName);

  return {
    success: true,
    classes: classes
  };
}

async function listStudents(data) {
  const locationId = readRequiredText(data.locationId, "locationId");
  const classId = readRequiredText(data.classId, "classId");
  const db = admin.firestore();
  const students = [];
  const snapshot = await db.collection("users")
    .where("locationId", "==", locationId)
    .where("status", "==", "active")
    .get();

  snapshot.forEach(function (studentDoc) {
    const student = studentDoc.data() || {};

    if (hasStudentRole(student) && studentMatchesClass(student, classId)) {
      students.push(sanitizeStudent(studentDoc.id, student));
    }
  });

  students.sort(compareByName);

  return {
    success: true,
    students: students
  };
}

async function loginStudent(data) {
  const locationId = readOptionalText(data.locationId);
  const classId = readOptionalText(data.classId);
  const studentId = readRequiredText(data.studentId, "studentId");
  const fruits = readFruitArray(data.fruits || data.fruitPassword);
  const db = admin.firestore();
  const studentDoc = await db.collection("users").doc(studentId).get();

  if (!studentDoc.exists) {
    throw new HttpsError("not-found", "Student profile was not found.");
  }

  const student = studentDoc.data() || {};

  verifyStudentCanUseFruitLogin(student, classId, locationId);

  if (!verifyFruitPassword(fruits, student)) {
    throw new HttpsError("permission-denied", "Those fruits did not match. Please try again.");
  }

  const customToken = await admin.auth().createCustomToken(studentId, {
    role: "student",
    locationId: locationId,
    classId: classId
  });

  return {
    success: true,
    customToken: customToken,
    student: sanitizeStudent(studentId, student)
  };
}

function verifyStudentCanUseFruitLogin(student, classId, locationId) {
  if (!hasStudentRole(student)) {
    throw new HttpsError("permission-denied", "This is not a student account.");
  }

  if (student.status && student.status !== "active" && student.status !== "approved") {
    throw new HttpsError("permission-denied", "This student account is not active.");
  }

  if (classId && !studentMatchesClass(student, classId)) {
    throw new HttpsError("permission-denied", "This student is not in the selected class.");
  }

  if (locationId && !studentMatchesLocation(student, locationId)) {
    throw new HttpsError("permission-denied", "This student is not in the selected location.");
  }
}

function verifyFruitPassword(fruits, student) {
  if (student.fruitPasswordHash && typeof student.fruitPasswordHash === "string") {
    return verifyPbkdf2FruitPassword(fruits, student.fruitPasswordHash);
  }

  if (Array.isArray(student.fruitPassword)) {
    return JSON.stringify(student.fruitPassword) === JSON.stringify(fruits);
  }

  if (Array.isArray(student.fruit)) {
    return JSON.stringify(student.fruit) === JSON.stringify(fruits);
  }

  return false;
}

function verifyPbkdf2FruitPassword(fruits, storedHash) {
  const parts = storedHash.split(":");

  if (parts.length !== 4) {
    return false;
  }

  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const expectedHash = parts[3];
  const actualHash = crypto.pbkdf2Sync(fruits.join("|"), salt, iterations, 32, "sha256").toString("hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(actualHash, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function readRequiredText(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpsError("invalid-argument", fieldName + " is required.");
  }

  return value.trim();
}

function readOptionalText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readFruitArray(value) {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new HttpsError("invalid-argument", "Four fruits are required.");
  }

  return value.map(function (fruit) {
    return String(fruit);
  });
}

function sanitizeClass(classId, data) {
  return {
    id: classId,
    name: readText(data.name),
    title: readText(data.title),
    locationId: readText(data.locationId),
    status: readText(data.status || "active")
  };
}

function sanitizeStudent(studentId, data) {
  return {
    id: studentId,
    name: readText(data.name || data.displayName),
    displayName: readText(data.displayName || data.name),
    photoUrl: readText(data.photoUrl),
    classId: readText(data.classId),
    classIds: readIdList(data.classIds),
    locationId: readText(data.locationId),
    locationIds: readIdList(data.locationIds),
    status: readText(data.status || "active")
  };
}

async function resetStudentFruitPassword(data) {
  const studentId = readRequiredText(data.studentId, "studentId");
  const fruits = readFruitArray(data.fruitPassword);
  const db = admin.firestore();
  const studentRef = db.collection("users").doc(studentId);
  const studentDoc = await studentRef.get();

  if (!studentDoc.exists) {
    throw new HttpsError("not-found", "Student profile was not found.");
  }

  const student = studentDoc.data() || {};

  if (!hasStudentRole(student)) {
    throw new HttpsError("permission-denied", "Fruit passwords can only be reset for students.");
  }

  await studentRef.set({
    fruitPasswordHash: createFruitPasswordHash(fruits),
    fruitPassword: fruits,
    fruit: fruits,
    fruitPasswordSet: true,
    fruitPasswordUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return {
    success: true,
    studentId: studentId
  };
}

function createFruitPasswordHash(fruits) {
  const iterations = 120000;
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(fruits.join("|"), salt, iterations, 32, "sha256").toString("hex");

  return "pbkdf2:" + iterations + ":" + salt + ":" + hash;
}

function verifyAdminCaller(auth) {
  const role = auth && auth.token && auth.token.role ? auth.token.role : "";

  if (role === "superAdmin"
      || role === "platformAdmin"
      || role === "ROLE_SUPER_ADMIN"
      || role === "ROLE_PLATFORM_ADMIN") {
    return;
  }

  throw new HttpsError("permission-denied", "Only super admins or platform admins can reset fruit passwords.");
}

function hasStudentRole(user) {
  return readRoles(user).indexOf("student") !== -1;
}

function studentMatchesClass(student, classId) {
  const classIds = readIdList(student.classIds);

  if (readText(student.classId) === classId) {
    return true;
  }

  return classIds.indexOf(classId) !== -1;
}

function studentMatchesLocation(student, locationId) {
  const locationIds = readIdList(student.locationIds);

  if (readText(student.locationId || student.primaryLocationId) === locationId) {
    return true;
  }

  return locationIds.indexOf(locationId) !== -1;
}

function readRoles(user) {
  const data = user || {};
  const source = [];
  const roles = [];

  if (Array.isArray(data.roles)) {
    source.push(...data.roles);
  }

  if (data.role) {
    source.push(data.role);
  }

  source.forEach(function (role) {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole && roles.indexOf(normalizedRole) === -1) {
      roles.push(normalizedRole);
    }
  });

  return roles;
}

function normalizeRole(role) {
  const normalizedRole = readText(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "student") {
    return "student";
  }

  if (normalizedRole === "teacher") {
    return "teacher";
  }

  if (normalizedRole === "parent") {
    return "parent";
  }

  if (normalizedRole === "schooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "regionaladmin") {
    return "regionalAdmin";
  }

  if (normalizedRole === "ministryuser" || normalizedRole === "ministry") {
    return "ministryUser";
  }

  if (normalizedRole === "platformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "superadmin") {
    return "superAdmin";
  }

  return "";
}

function readIdList(value) {
  let source = value;
  const ids = [];

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return ids;
  }

  source.forEach(function (item) {
    const id = readText(item).trim();

    if (id && ids.indexOf(id) === -1) {
      ids.push(id);
    }
  });

  return ids;
}

function compareByName(a, b) {
  return readText(a.name || a.title || a.id).localeCompare(readText(b.name || b.title || b.id));
}

function shouldIncludeActiveRecord(data) {
  if (!data.status) {
    return true;
  }

  return data.status === "active";
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
