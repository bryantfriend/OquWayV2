import { functions, httpsCallable } from "../../../../../infrastructure/firebase/functions.js?v=1.1.121-student-dashboard-open-clean";
import { collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.121-student-dashboard-open-clean";

export async function processLoadAdminProfile(executionState) {
  var actor = executionState.actor;

  try {
    if (!actor || !actor.id) {
      throw new Error("Admin authentication is required.");
    }

    var profile = await loadUserProfile(actor.id);

    executionState.result = {
      admin: sanitizeAdminProfile(profile, actor)
    };

    return { valid: true };
  } catch (error) {
    executionState.warnings.push({
      code: "ADMIN_PROFILE_LOAD_FALLBACK",
      message: "Admin profile could not be loaded, so the authenticated actor was used instead: " + error.message
    });
    executionState.result = {
      admin: sanitizeAdminProfile({
        id: actor && actor.id ? actor.id : "",
        email: actor && actor.email ? actor.email : "",
        role: actor && actor.role ? actor.role : ""
      }, actor || {})
    };
    return { valid: true };
  }
}

export function processVerifySuperAdminAccess(executionState) {
  executionState.result = {
    allowed: true,
    role: executionState.actor && executionState.actor.role ? executionState.actor.role : ""
  };

  return { valid: true };
}

export async function processCreateLocation(executionState) {
  var payload = executionState.payload;

  try {
    var createDuplicateResult = payload.status === "archived" ? { hasDuplicate: false } : await findDuplicateLocationSlug(payload.loginSlug, "");

    if (createDuplicateResult.hasDuplicate) {
      return createProcessError("LOCATION_LOGIN_SLUG_DUPLICATE", "That loginSlug is already used by another location.");
    }

    var locationRef = doc(collection(db, "locations"));
    var location = buildLocationWriteData(payload, true);

    await setDoc(locationRef, location);
    executionState.result = {
      location: Object.assign({ id: locationRef.id }, location)
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("LOCATION_CREATE_FAILED", error.message);
  }
}

export async function processUpdateLocation(executionState) {
  var payload = executionState.payload;

  try {
    var updateDuplicateResult = payload.status === "archived" ? { hasDuplicate: false } : await findDuplicateLocationSlug(payload.loginSlug, payload.locationId);

    if (updateDuplicateResult.hasDuplicate) {
      return createProcessError("LOCATION_LOGIN_SLUG_DUPLICATE", "That loginSlug is already used by another location.");
    }

    await setDoc(doc(db, "locations", payload.locationId), {
      name: payload.name,
      type: payload.type,
      status: payload.status,
      isArchived: payload.isArchived,
      description: payload.description,
      schoolCode: payload.schoolCode,
      photoUrl: payload.photoUrl,
      imageUrl: payload.photoUrl,
      address: payload.address,
      city: payload.city,
      region: payload.region,
      country: payload.country,
      twoGisUrl: payload.twoGisUrl,
      latitude: payload.latitude,
      longitude: payload.longitude,
      contact: payload.contact,
      email: payload.email,
      website: payload.website,
      hours: payload.hours,
      socialLinks: payload.socialLinks,
      loginMode: payload.loginMode,
      loginSlug: payload.loginSlug,
      loginPath: payload.loginPath,
      allowStudentLogin: payload.allowStudentLogin,
      languages: payload.languages,
      intentionStoreEnabled: payload.intentionStoreEnabled,
      parentPortalEnabled: payload.parentPortalEnabled,
      courseEditorEnabled: payload.courseEditorEnabled,
      gamificationEnabled: payload.gamificationEnabled,
      adminUids: payload.adminUids,
      subscription: payload.subscription,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      locationId: payload.locationId
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("LOCATION_UPDATE_FAILED", error.message);
  }
}

async function findDuplicateLocationSlug(loginSlug, locationId) {
  if (!loginSlug) {
    return {
      hasDuplicate: false
    };
  }

  var slugQuery = query(collection(db, "locations"), where("loginSlug", "==", loginSlug));
  var snapshot = await getDocs(slugQuery);
  var hasDuplicate = false;

  snapshot.forEach(function (locationSnap) {
    var data = locationSnap.data() || {};
    var isArchived = data.isArchived === true || data.status === "archived";

    if (locationSnap.id !== locationId && !isArchived) {
      hasDuplicate = true;
    }
  });

  return {
    hasDuplicate: hasDuplicate
  };
}

function buildLocationWriteData(payload, includeCreatedAt) {
  var location = {
    name: payload.name,
    type: payload.type,
    status: payload.status,
    isArchived: payload.isArchived,
    description: payload.description,
    schoolCode: payload.schoolCode,
    photoUrl: payload.photoUrl,
    imageUrl: payload.photoUrl,
    address: payload.address,
    city: payload.city,
    region: payload.region,
    country: payload.country,
    twoGisUrl: payload.twoGisUrl,
    latitude: payload.latitude,
    longitude: payload.longitude,
    contact: payload.contact,
    email: payload.email,
    website: payload.website,
    hours: payload.hours,
    socialLinks: payload.socialLinks,
    loginMode: payload.loginMode,
    loginSlug: payload.loginSlug,
    loginPath: payload.loginPath,
    allowStudentLogin: payload.allowStudentLogin,
    languages: payload.languages,
    intentionStoreEnabled: payload.intentionStoreEnabled,
    parentPortalEnabled: payload.parentPortalEnabled,
    courseEditorEnabled: payload.courseEditorEnabled,
    gamificationEnabled: payload.gamificationEnabled,
    adminUids: payload.adminUids,
    subscription: payload.subscription,
    updatedAt: serverTimestamp()
  };

  if (includeCreatedAt) {
    location.createdAt = serverTimestamp();
  }

  return location;
}

export async function processListClasses(executionState) {
  var payload = executionState.payload || {};

  try {
    var classQuery = null;

    if (payload.locationId) {
      classQuery = query(collection(db, "classes"), where("locationId", "==", payload.locationId));
    } else {
      classQuery = collection(db, "classes");
    }

    var snapshot = await getDocs(classQuery);
    var classes = [];

    snapshot.forEach(function (classSnap) {
      classes.push(sanitizeClass(classSnap.id, classSnap.data()));
    });

    classes.sort(compareByName);
    executionState.result = {
      classes: classes
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("CLASSES_LOAD_FAILED", error.message);
  }
}

export async function processCreateClass(executionState) {
  var payload = executionState.payload;

  try {
    var classRef = doc(collection(db, "classes"));
    var ownershipFields = await buildClassOwnershipFields(payload);
    var classRecord = {
      name: payload.name,
      locationId: payload.locationId,
      status: payload.status,
      isVisible: payload.isVisible,
      photoDataUrl: payload.photoDataUrl,
      primaryTeacherId: ownershipFields.primaryTeacherId,
      assistantIds: ownershipFields.assistantIds,
      primaryTeacherName: ownershipFields.primaryTeacherName,
      assistantNames: ownershipFields.assistantNames,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(classRef, classRecord);
    executionState.result = {
      classRecord: Object.assign({ id: classRef.id }, classRecord)
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("CLASS_CREATE_FAILED", error.message);
  }
}

export async function processUpdateClass(executionState) {
  var payload = executionState.payload;

  try {
    var ownershipFields = await buildClassOwnershipFields(payload);
    await setDoc(doc(db, "classes", payload.classId), {
      name: payload.name,
      locationId: payload.locationId,
      status: payload.status,
      isVisible: payload.isVisible,
      photoDataUrl: payload.photoDataUrl,
      primaryTeacherId: ownershipFields.primaryTeacherId,
      assistantIds: ownershipFields.assistantIds,
      primaryTeacherName: ownershipFields.primaryTeacherName,
      assistantNames: ownershipFields.assistantNames,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      classId: payload.classId
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("CLASS_UPDATE_FAILED", error.message);
  }
}

export async function processLoadClassOwnership(executionState) {
  var payload = executionState.payload || {};

  try {
    var classSnap = await getDoc(doc(db, "classes", payload.classId));

    if (!classSnap.exists()) {
      return createProcessError("CLASS_NOT_FOUND", "Class was not found.");
    }

    executionState.result = {
      classId: classSnap.id,
      ownership: readClassOwnership(classSnap.data() || {})
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("CLASS_OWNERSHIP_LOAD_FAILED", error.message);
  }
}

export async function processAssignClassTeacher(executionState) {
  var payload = executionState.payload;

  try {
    var ownershipFields = await buildClassOwnershipFields(payload);

    await setDoc(doc(db, "classes", payload.classId), {
      primaryTeacherId: ownershipFields.primaryTeacherId,
      assistantIds: ownershipFields.assistantIds,
      primaryTeacherName: ownershipFields.primaryTeacherName,
      assistantNames: ownershipFields.assistantNames,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      classId: payload.classId,
      ownership: ownershipFields
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("CLASS_TEACHER_ASSIGN_FAILED", error.message);
  }
}

export async function processAssignClassAssistants(executionState) {
  var payload = executionState.payload;

  try {
    var ownershipFields = await buildClassOwnershipFields(payload);

    await setDoc(doc(db, "classes", payload.classId), {
      assistantIds: ownershipFields.assistantIds,
      assistantNames: ownershipFields.assistantNames,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      classId: payload.classId,
      ownership: ownershipFields
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("CLASS_ASSISTANTS_ASSIGN_FAILED", error.message);
  }
}

export async function processListStudents(executionState) {
  var payload = executionState.payload || {};

  try {
    var students = [];
    var seenStudentIds = {};
    var snapshot = await getDocs(collection(db, "users"));

    snapshot.forEach(function (studentSnap) {
      var data = studentSnap.data() || {};

      if (seenStudentIds[studentSnap.id] || !hasStudentRole(data)) {
        return;
      }

      seenStudentIds[studentSnap.id] = true;

      var student = sanitizeStudent(studentSnap.id, data);
      if (matchesStudentFilters(student, payload) && matchesSearch(student, payload.searchText)) {
        students.push(student);
      }
    });

    students.sort(compareByName);
    executionState.result = {
      students: students
    };

    return { valid: true };
  } catch (error) {
    executionState.warnings.push({
      code: "STUDENTS_LOAD_FAILED",
      message: "Students could not be loaded: " + error.message
    });
    executionState.result = {
      students: []
    };
    return { valid: true };
  }
}

export async function processCreateStudent(executionState) {
  var payload = executionState.payload;

  try {
    var studentRef = doc(collection(db, "users"));
    var student = createStudentRecord(payload);

    await setDoc(studentRef, student);

    if (payload.fruitPassword && payload.fruitPassword.length === 4) {
      await callResetStudentFruitPassword(studentRef.id, payload.fruitPassword);
      student.fruitPasswordSet = true;
    }

    executionState.result = {
      student: Object.assign({ id: studentRef.id }, student)
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("STUDENT_CREATE_FAILED", error.message);
  }
}

export async function processUpdateStudent(executionState) {
  var payload = executionState.payload;

  try {
    await setDoc(doc(db, "users", payload.studentId), {
      name: payload.name,
      displayName: payload.name,
      photoUrl: payload.photoUrl,
      classId: payload.classId,
      locationId: payload.locationId,
      status: payload.status,
      email: payload.email,
      username: payload.username,
      role: "student",
      roles: ["student"],
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      studentId: payload.studentId
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("STUDENT_UPDATE_FAILED", error.message);
  }
}

export async function processSetStudentStatus(executionState) {
  var payload = executionState.payload;

  try {
    await setDoc(doc(db, "users", payload.studentId), {
      status: payload.status,
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      studentId: payload.studentId,
      status: payload.status
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("STUDENT_STATUS_UPDATE_FAILED", error.message);
  }
}

export async function processResetStudentFruitPassword(executionState) {
  var payload = executionState.payload;

  try {
    var result = await callResetStudentFruitPassword(payload.studentId, payload.fruitPassword);

    executionState.result = {
      studentId: payload.studentId,
      fruitPasswordSet: true,
      resetResult: result
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("FRUIT_PASSWORD_RESET_FAILED", error.message);
  }
}

async function callResetStudentFruitPassword(studentId, fruitPassword) {
  var callable = httpsCallable(functions, "resetStudentFruitPassword");
  var response = await callable({
    studentId: studentId,
    fruitPassword: fruitPassword
  });

  if (!response || !response.data) {
    throw new Error("Fruit password reset returned an empty response.");
  }

  if (response.data.success === false) {
    throw new Error(response.data.message || "Fruit password reset failed.");
  }

  return response.data;
}

async function loadUserProfile(userId) {
  var userSnap = await getDoc(doc(db, "users", userId));

  if (!userSnap.exists()) {
    return {
      id: userId
    };
  }

  return Object.assign({ id: userSnap.id }, userSnap.data());
}

function createStudentRecord(payload) {
  return {
    role: "student",
    roles: ["student"],
    name: payload.name,
    displayName: payload.name,
    photoUrl: payload.photoUrl,
    classId: payload.classId,
    locationId: payload.locationId,
    status: payload.status,
    email: payload.email,
    username: payload.username,
    fruitPasswordSet: false,
    points: {
      physical: 0,
      cognitive: 0,
      creative: 0,
      social: 0
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function sanitizeAdminProfile(profile, actor) {
  return {
    id: profile.id || actor.id,
    email: readText(profile.email || actor.email),
    role: readText(profile.role || actor.role),
    name: readText(profile.name || profile.displayName)
  };
}

function sanitizeClass(classId, data) {
  var ownership = readClassOwnership(data || {});

  return {
    id: classId,
    name: readText(data.name),
    locationId: readText(data.locationId),
    status: readText(data.status || "active"),
    isVisible: data.isVisible === false ? false : true,
    photoDataUrl: readText(data.photoDataUrl),
    primaryTeacherId: ownership.primaryTeacherId,
    assistantIds: ownership.assistantIds,
    primaryTeacherName: ownership.primaryTeacherName,
    assistantNames: ownership.assistantNames
  };
}

function readClassOwnership(data) {
  var primaryTeacherId = readText(data.primaryTeacherId || data.teacherId || data.teacherUid);
  var assistantIds = readIdList([data.assistantIds, data.teacherIds]).filter(function (assistantId) {
    return assistantId !== primaryTeacherId;
  });

  return {
    primaryTeacherId: primaryTeacherId,
    assistantIds: assistantIds,
    primaryTeacherName: readText(data.primaryTeacherName),
    assistantNames: Array.isArray(data.assistantNames) ? data.assistantNames.map(readText).filter(Boolean) : []
  };
}

async function buildClassOwnershipFields(payload) {
  var primaryTeacherId = readText(payload.primaryTeacherId);
  var assistantIds = readIdList(payload.assistantIds).filter(function (assistantId) {
    return assistantId !== primaryTeacherId;
  });
  var assistantNames = [];
  var index = 0;

  if (primaryTeacherId) {
    await requireStaffRole(primaryTeacherId, ["teacher"], "Primary class teacher must have the teacher role.");
  }

  while (index < assistantIds.length) {
    await requireStaffRole(assistantIds[index], ["teacher", "assistant"], "Class assistants must have teacher or assistant role.");
    assistantNames.push(await readUserDisplayName(assistantIds[index]));
    index = index + 1;
  }

  return {
    primaryTeacherId: primaryTeacherId,
    assistantIds: assistantIds,
    primaryTeacherName: primaryTeacherId ? await readUserDisplayName(primaryTeacherId) : "",
    assistantNames: assistantNames.filter(Boolean)
  };
}

async function requireStaffRole(userId, allowedRoles, message) {
  var userSnap = await getDoc(doc(db, "users", userId));
  var roles = userSnap.exists() ? readRoles(userSnap.data() || {}) : [];
  var index = 0;

  while (index < allowedRoles.length) {
    if (roles.indexOf(allowedRoles[index]) !== -1) {
      return;
    }
    index = index + 1;
  }

  throw new Error(message);
}

async function readUserDisplayName(userId) {
  var safeId = readText(userId);

  if (!safeId) {
    return "";
  }

  try {
    var userSnap = await getDoc(doc(db, "users", safeId));
    var data = userSnap.exists() ? userSnap.data() || {} : {};

    return readText(data.displayName || data.name || data.email || safeId);
  } catch (error) {
    return safeId;
  }
}

function sanitizeStudent(studentId, data) {
  return {
    id: studentId,
    role: readText(data.role || "student"),
    roles: readRoles(data),
    name: readText(data.name || data.displayName),
    displayName: readText(data.displayName || data.name),
    photoUrl: readText(data.photoUrl),
    classId: readText(data.classId),
    classIds: readIdList(data.classIds),
    locationId: readText(data.locationId),
    status: readText(data.status || (data.isActive === true ? "active" : "")),
    email: readText(data.email),
    username: readText(data.username),
    fruitPasswordSet: data.fruitPasswordSet === true || Boolean(data.fruitPasswordHash || data.fruitPassword || data.fruit),
    fruitPasswordUpdatedAt: data.fruitPasswordUpdatedAt || null
  };
}

function matchesStudentFilters(student, payload) {
  if (payload.classId && student.classId !== payload.classId && student.classIds.indexOf(payload.classId) === -1) {
    return false;
  }

  if (payload.locationId && student.locationId !== payload.locationId) {
    return false;
  }

  return true;
}

function hasStudentRole(data) {
  return readRoles(data).indexOf("student") !== -1;
}

function readRoles(data) {
  var source = [];
  var roles = [];
  var index = 0;

  if (Array.isArray(data.roles)) {
    source = source.concat(data.roles);
  }

  if (data.role) {
    source.push(data.role);
  }

  while (index < source.length) {
    var normalizedRole = normalizeRole(source[index]);

    if (normalizedRole && roles.indexOf(normalizedRole) === -1) {
      roles.push(normalizedRole);
    }

    index = index + 1;
  }

  if (data.ROLE_STUDENT === true && roles.indexOf("student") === -1) {
    roles.push("student");
  }

  if (data.ROLE_TEACHER === true && roles.indexOf("teacher") === -1) {
    roles.push("teacher");
  }

  if (data.ROLE_ASSISTANT === true && roles.indexOf("assistant") === -1) {
    roles.push("assistant");
  }

  return roles;
}

function normalizeRole(role) {
  var normalizedRole = readText(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "student") {
    return "student";
  }

  if (normalizedRole === "teacher") {
    return "teacher";
  }

  if (normalizedRole === "parent") {
    return "parent";
  }

  if (normalizedRole === "assistant" || normalizedRole === "roleassistant") {
    return "assistant";
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
  var ids = [];

  appendIdValue(ids, value);

  return ids;
}

function appendIdValue(ids, value) {
  var source = value;
  var index = 0;

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return;
  }

  while (index < source.length) {
    if (Array.isArray(source[index])) {
      appendIdValue(ids, source[index]);
    } else {
      var id = readText(source[index]).trim();

      if (id && ids.indexOf(id) === -1) {
        ids.push(id);
      }
    }

    index = index + 1;
  }
}

function matchesSearch(student, searchText) {
  var queryText = readText(searchText).toLowerCase();

  if (!queryText) {
    return true;
  }

  return readText(student.name).toLowerCase().indexOf(queryText) !== -1
    || readText(student.email).toLowerCase().indexOf(queryText) !== -1
    || readText(student.username).toLowerCase().indexOf(queryText) !== -1;
}

function compareByName(a, b) {
  return readText(a.name || a.id).localeCompare(readText(b.name || b.id));
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}

function createProcessError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
