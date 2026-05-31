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
  return resetStudentFruitPassword(data, auth);
});

const FRUIT_ALIASES = {
  apple: "apple",
  "\uD83C\uDF4E": "apple",
  watermelon: "watermelon",
  "\uD83C\uDF49": "watermelon",
  banana: "banana",
  "\uD83C\uDF4C": "banana",
  strawberry: "strawberry",
  "\uD83C\uDF53": "strawberry",
  pineapple: "pineapple",
  "\uD83C\uDF4D": "pineapple",
  mango: "mango",
  "\uD83E\uDD6D": "mango",
  kiwi: "kiwi",
  "\uD83E\uDD5D": "kiwi",
  orange: "orange",
  "\uD83C\uDF4A": "orange",
  cherry: "cherry",
  cherries: "cherry",
  "\uD83C\uDF52": "cherry"
};

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
  const className = await readSelectedClassName(admin.firestore(), locationId, classId, data.className);
  const db = admin.firestore();
  const students = [];
  const filteredReasons = {};
  const snapshot = await db.collection("users").get();

  snapshot.forEach(function (studentDoc) {
    const student = studentDoc.data() || {};
    const filterReason = readStudentFilterReason(student, locationId, classId, className);

    if (!filterReason) {
      students.push(sanitizeStudent(studentDoc.id, student));
      return;
    }

    addReasonCount(filteredReasons, filterReason);
  });

  students.sort(compareByName);

  const response = {
    success: true,
    students: students
  };

  if (isDebugRequest(data)) {
    response.debug = {
      selectedLocationId: locationId,
      selectedClassId: classId,
      selectedClassName: className,
      queryCollection: "users",
      rawResultCount: snapshot.size,
      filteredResultCount: students.length,
      filteredReasons: filteredReasons
    };

    logStudentListDebug(response.debug);
  }

  return response;
}

async function loginStudent(data) {
  const locationId = readOptionalText(data.locationId);
  const classId = readOptionalText(data.classId);
  const className = await readSelectedClassName(admin.firestore(), locationId, classId, data.className);
  const studentId = readRequiredText(data.studentId, "studentId");
  const fruits = readFruitArray(data.fruits || data.fruitPassword);
  const db = admin.firestore();
  const studentDoc = await db.collection("users").doc(studentId).get();

  if (!studentDoc.exists) {
    throw new HttpsError("not-found", "Student profile was not found.");
  }

  const student = studentDoc.data() || {};

  verifyStudentCanUseFruitLogin(student, classId, locationId, className);
  logFruitPasswordDebug("login", {
    studentId: studentId,
    locationId: locationId,
    classId: classId,
    expectedFieldExists: Boolean(student.fruitPasswordHash),
    submittedNormalizedSequence: fruits,
    storedFormatType: readStoredFruitFormat(student)
  });

  if (!verifyFruitPassword(fruits, student)) {
    throw new HttpsError("permission-denied", "Those fruits did not match. Please try again.");
  }

  const customToken = await admin.auth().createCustomToken(studentId, {
    role: "student",
    studentId: studentId,
    locationId: locationId,
    classId: classId,
    className: className
  });

  return {
    success: true,
    customToken: customToken,
    token: customToken,
    student: sanitizeStudent(studentId, student)
  };
}

function verifyStudentCanUseFruitLogin(student, classId, locationId, className) {
  if (!hasStudentRole(student)) {
    throw new HttpsError("permission-denied", "This is not a student account.");
  }

  if (!isActiveStudent(student)) {
    throw new HttpsError("permission-denied", "This student account is not active.");
  }

  if (classId && !studentMatchesClass(student, classId, className)) {
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
    return JSON.stringify(normalizeStoredFruitArray(student.fruitPassword)) === JSON.stringify(fruits);
  }

  if (Array.isArray(student.fruit)) {
    return JSON.stringify(normalizeStoredFruitArray(student.fruit)) === JSON.stringify(fruits);
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
    return normalizeFruitKey(fruit);
  });
}

function normalizeStoredFruitArray(value) {
  try {
    return readFruitArray(value);
  } catch (error) {
    return [];
  }
}

function normalizeFruitKey(value) {
  const rawValue = readText(value).trim();
  const textValue = rawValue.toLowerCase();
  const compactValue = textValue.replace(/[^a-z0-9]/g, "");
  const normalized = FRUIT_ALIASES[rawValue]
    || FRUIT_ALIASES[textValue]
    || FRUIT_ALIASES[compactValue];

  if (!normalized) {
    throw new HttpsError("invalid-argument", "Fruit passwords must use supported fruit keys.");
  }

  return normalized;
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

async function resetStudentFruitPassword(data, auth) {
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
    fruitPasswordSet: true,
    fruitPasswordUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    fruitPasswordResetBy: auth && auth.uid ? auth.uid : "",
    fruitPassword: admin.firestore.FieldValue.delete(),
    fruit: admin.firestore.FieldValue.delete(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  logFruitPasswordDebug("reset", {
    studentId: studentId,
    locationId: readText(student.locationId || student.primaryLocationId),
    classId: readText(student.classId),
    expectedFieldExists: true,
    submittedNormalizedSequence: fruits,
    storedFormatType: "hash"
  });

  return {
    success: true,
    studentId: studentId
  };
}

function readStoredFruitFormat(student) {
  if (student.fruitPasswordHash && typeof student.fruitPasswordHash === "string") {
    return "hash";
  }

  if (Array.isArray(student.fruitPassword)) {
    return "plain-fruitPassword-array";
  }

  if (Array.isArray(student.fruit)) {
    return "plain-fruit-array";
  }

  return "missing";
}

function logFruitPasswordDebug(eventName, details) {
  if (process.env.FUNCTIONS_EMULATOR !== "true") {
    return;
  }

  console.info("[fruit-password-debug]", eventName, {
    studentId: details.studentId,
    locationId: details.locationId,
    classId: details.classId,
    expectedFieldExists: details.expectedFieldExists,
    submittedNormalizedSequence: details.submittedNormalizedSequence,
    storedFormatType: details.storedFormatType
  });
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

function readStudentFilterReason(student, locationId, classId, className) {
  if (!hasStudentRole(student)) {
    return "not-student-role";
  }

  if (!isActiveStudent(student)) {
    return "inactive-status";
  }

  if (!studentMatchesLocation(student, locationId)) {
    return "location-mismatch";
  }

  if (!studentMatchesClass(student, classId, className)) {
    return "class-mismatch";
  }

  return "";
}

function isActiveStudent(student) {
  const status = readText(student.status).toLowerCase();

  if (status) {
    return status === "active" || status === "approved";
  }

  if (typeof student.isActive === "boolean") {
    return student.isActive === true;
  }

  return true;
}

function studentMatchesClass(student, classId, className) {
  const classIds = readIdList([
    student.classId,
    student.classIds,
    student.assignedClassIds,
    student.assignedClasses,
    student.classRefs,
    student.classes
  ]);
  const classNames = readNameList([
    student.className,
    student.classNames,
    student.assignedClasses,
    student.classRefs,
    student.classes
  ]);
  const normalizedClassName = normalizeComparableText(className);

  if (classIds.indexOf(classId) !== -1) {
    return true;
  }

  if (normalizedClassName && classNames.indexOf(normalizedClassName) !== -1) {
    return true;
  }

  return false;
}

function studentMatchesLocation(student, locationId) {
  const locationIds = readIdList([
    student.locationId,
    student.primaryLocationId,
    student.locationIds,
    student.locations,
    student.schoolId,
    student.schoolIds
  ]);

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

  if (normalizedRole === "student" || normalizedRole === "rolestudent") {
    return "student";
  }

  if (normalizedRole === "teacher" || normalizedRole === "roleteacher") {
    return "teacher";
  }

  if (normalizedRole === "parent" || normalizedRole === "roleparent") {
    return "parent";
  }

  if (normalizedRole === "schooladmin" || normalizedRole === "roleschooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "regionaladmin") {
    return "regionalAdmin";
  }

  if (normalizedRole === "ministryuser" || normalizedRole === "ministry") {
    return "ministryUser";
  }

  if (normalizedRole === "platformadmin" || normalizedRole === "roleplatformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "superadmin" || normalizedRole === "rolesuperadmin") {
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
    source = [source];
  }

  source.forEach(function (item) {
    if (Array.isArray(item)) {
      readIdList(item).forEach(function (nestedId) {
        if (ids.indexOf(nestedId) === -1) {
          ids.push(nestedId);
        }
      });
      return;
    }

    const id = readRecordId(item);

    if (id && ids.indexOf(id) === -1) {
      ids.push(id);
    }
  });

  return ids;
}

function readNameList(value) {
  let source = value;
  const names = [];

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    source = [source];
  }

  source.forEach(function (item) {
    if (Array.isArray(item)) {
      readNameList(item).forEach(function (nestedName) {
        if (names.indexOf(nestedName) === -1) {
          names.push(nestedName);
        }
      });
      return;
    }

    const name = readRecordName(item);

    if (name && names.indexOf(name) === -1) {
      names.push(name);
    }
  });

  return names;
}

function readRecordId(value) {
  if (!value || typeof value !== "object") {
    return readText(value).trim();
  }

  return readText(value.id || value.uid || value.refId || value.classId || value.locationId || value.schoolId).trim();
}

function readRecordName(value) {
  if (!value || typeof value !== "object") {
    return normalizeComparableText(value);
  }

  return normalizeComparableText(value.name || value.title || value.className || value.label);
}

async function readSelectedClassName(db, locationId, classId, className) {
  const explicitClassName = readText(className).trim();

  if (explicitClassName) {
    return explicitClassName;
  }

  if (!classId) {
    return "";
  }

  const nestedClassDoc = await db.collection("locations").doc(locationId).collection("classes").doc(classId).get();

  if (nestedClassDoc.exists) {
    return readText((nestedClassDoc.data() || {}).name || (nestedClassDoc.data() || {}).title).trim();
  }

  const topLevelClassDoc = await db.collection("classes").doc(classId).get();

  if (topLevelClassDoc.exists) {
    return readText((topLevelClassDoc.data() || {}).name || (topLevelClassDoc.data() || {}).title).trim();
  }

  return "";
}

function normalizeComparableText(value) {
  return readText(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function addReasonCount(reasons, reason) {
  reasons[reason] = (reasons[reason] || 0) + 1;
}

function isDebugRequest(data) {
  return (data && data.debug === true) || process.env.FUNCTIONS_EMULATOR === "true";
}

function logStudentListDebug(details) {
  if (process.env.FUNCTIONS_EMULATOR !== "true") {
    return;
  }

  console.info("[student-list-debug]", details);
}

function compareByName(a, b) {
  return readText(a.name || a.title || a.id).localeCompare(readText(b.name || b.title || b.id));
}

function shouldIncludeActiveRecord(data) {
  if (!data.status) {
    return true;
  }

  return data.status === "active" || data.status === "approved";
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
