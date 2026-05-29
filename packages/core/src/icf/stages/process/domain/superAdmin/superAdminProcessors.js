import { functions, httpsCallable } from "../../../../../infrastructure/firebase/functions.js";
import { collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../../../../../infrastructure/firebase/firestore.js";

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
    return createProcessError("ADMIN_PROFILE_LOAD_FAILED", error.message);
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
    var createDuplicateResult = await findDuplicateLocationSlug(payload.loginSlug, "");

    if (createDuplicateResult.hasDuplicate) {
      return createProcessError("LOCATION_LOGIN_SLUG_DUPLICATE", "That loginSlug is already used by another location.");
    }

    var locationRef = doc(collection(db, "locations"));
    var location = {
      name: payload.name,
      status: payload.status,
      loginMode: payload.loginMode,
      loginSlug: payload.loginSlug,
      loginPath: "/l/" + payload.loginSlug,
      imageUrl: payload.imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

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
    var updateDuplicateResult = await findDuplicateLocationSlug(payload.loginSlug, payload.locationId);

    if (updateDuplicateResult.hasDuplicate) {
      return createProcessError("LOCATION_LOGIN_SLUG_DUPLICATE", "That loginSlug is already used by another location.");
    }

    await setDoc(doc(db, "locations", payload.locationId), {
      name: payload.name,
      status: payload.status,
      loginMode: payload.loginMode,
      loginSlug: payload.loginSlug,
      loginPath: "/l/" + payload.loginSlug,
      imageUrl: payload.imageUrl,
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
  var slugQuery = query(collection(db, "locations"), where("loginSlug", "==", loginSlug));
  var snapshot = await getDocs(slugQuery);
  var hasDuplicate = false;

  snapshot.forEach(function (locationSnap) {
    if (locationSnap.id !== locationId) {
      hasDuplicate = true;
    }
  });

  return {
    hasDuplicate: hasDuplicate
  };
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
    var classRecord = {
      name: payload.name,
      locationId: payload.locationId,
      status: payload.status,
      isVisible: payload.isVisible,
      photoDataUrl: payload.photoDataUrl,
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
    await setDoc(doc(db, "classes", payload.classId), {
      name: payload.name,
      locationId: payload.locationId,
      status: payload.status,
      isVisible: payload.isVisible,
      photoDataUrl: payload.photoDataUrl,
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

export async function processListStudents(executionState) {
  var payload = executionState.payload || {};

  try {
    var roleNames = ["student", "ROLE_STUDENT"];
    var students = [];
    var seenStudentIds = {};
    var roleIndex = 0;

    while (roleIndex < roleNames.length) {
      var studentQuery = createStudentListQuery(roleNames[roleIndex], payload);
      var snapshot = await getDocs(studentQuery);

      snapshot.forEach(function (studentSnap) {
        if (seenStudentIds[studentSnap.id]) {
          return;
        }

        seenStudentIds[studentSnap.id] = true;

        var student = sanitizeStudent(studentSnap.id, studentSnap.data());
        if (matchesSearch(student, payload.searchText)) {
          students.push(student);
        }
      });

      roleIndex = roleIndex + 1;
    }

    students.sort(compareByName);
    executionState.result = {
      students: students
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("STUDENTS_LOAD_FAILED", error.message);
  }
}

function createStudentListQuery(roleName, payload) {
  if (payload.classId) {
    return query(collection(db, "users"), where("role", "==", roleName), where("classId", "==", payload.classId));
  }

  if (payload.locationId) {
    return query(collection(db, "users"), where("role", "==", roleName), where("locationId", "==", payload.locationId));
  }

  return query(collection(db, "users"), where("role", "==", roleName));
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
  return {
    id: classId,
    name: readText(data.name),
    locationId: readText(data.locationId),
    status: readText(data.status || "active"),
    isVisible: data.isVisible === false ? false : true,
    photoDataUrl: readText(data.photoDataUrl)
  };
}

function sanitizeStudent(studentId, data) {
  return {
    id: studentId,
    role: readText(data.role || "student"),
    name: readText(data.name || data.displayName),
    displayName: readText(data.displayName || data.name),
    photoUrl: readText(data.photoUrl),
    classId: readText(data.classId),
    locationId: readText(data.locationId),
    status: readText(data.status || (data.isActive === true ? "active" : "")),
    email: readText(data.email),
    username: readText(data.username),
    fruitPasswordSet: data.fruitPasswordSet === true || Boolean(data.fruitPasswordHash || data.fruitPassword || data.fruit),
    fruitPasswordUpdatedAt: data.fruitPasswordUpdatedAt || null
  };
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
