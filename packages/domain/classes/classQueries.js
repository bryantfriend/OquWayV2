import { collection, db, getDocs, query, where } from "../../firebase/index.js";

export async function getClassesForTeacher(teacherIds, roles) {
  var classes = [];
  var safeTeacherIds = Array.isArray(teacherIds) ? teacherIds : [];
  var index = 0;

  if (safeTeacherIds.length === 0 && isAdminRoleList(roles || [])) {
    return [];
  }

  while (index < safeTeacherIds.length) {
    await appendClassOwnershipQuery(classes, query(collection(db, "classes"), where("primaryTeacherId", "==", safeTeacherIds[index])), {
      teacherId: safeTeacherIds[index],
      ownershipRole: "Primary Teacher",
      queryShape: "classes where primaryTeacherId == teacherId"
    });
    await appendClassOwnershipQuery(classes, query(collection(db, "classes"), where("assistantIds", "array-contains", safeTeacherIds[index])), {
      teacherId: safeTeacherIds[index],
      ownershipRole: "Assistant",
      queryShape: "classes where assistantIds array-contains teacherId"
    });
    index = index + 1;
  }

  return classes.sort(compareByName);
}

export async function getClassesForLocation(locationId) {
  var classes = [];

  if (!locationId) {
    return classes;
  }

  await appendLocationQuery(classes, query(collection(db, "classes"), where("locationId", "==", locationId)), "classes where locationId == locationId");
  await appendLocationQuery(classes, query(collection(db, "classes"), where("locId", "==", locationId)), "classes where locId == locationId");
  await appendLocationQuery(classes, query(collection(db, "classes"), where("schoolId", "==", locationId)), "classes where schoolId == locationId");
  await appendLocationQuery(classes, query(collection(db, "classes"), where("primaryLocationId", "==", locationId)), "classes where primaryLocationId == locationId");

  return classes.sort(compareByName);
}

async function appendClassOwnershipQuery(classes, classesQuery, details) {
  console.info("[teacher-dashboard:classes-query]", {
    teacherId: details && details.teacherId ? details.teacherId : "",
    queryShape: details && details.queryShape ? details.queryShape : "classes ownership query"
  });

  try {
    var snapshot = await getDocs(classesQuery);
    snapshot.forEach(function (classSnap) {
      addUniqueRecord(classes, Object.assign({
        id: classSnap.id,
        source: "classes",
        ownershipRole: details && details.ownershipRole ? details.ownershipRole : "Assigned"
      }, classSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:classes-query-failed]", {
      teacherId: details && details.teacherId ? details.teacherId : "",
      queryShape: details && details.queryShape ? details.queryShape : "classes ownership query",
      errorMessage: readErrorMessage(error)
    });
  }
}

async function appendLocationQuery(classes, classesQuery, queryShape) {
  try {
    var snapshot = await getDocs(classesQuery);
    snapshot.forEach(function (classSnap) {
      addUniqueRecord(classes, Object.assign({ id: classSnap.id }, classSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[classes:location-query-failed]", {
      queryShape: queryShape,
      errorMessage: readErrorMessage(error)
    });
  }
}

function isAdminRoleList(roles) {
  return roles.indexOf("schoolAdmin") !== -1 || roles.indexOf("platformAdmin") !== -1 || roles.indexOf("superAdmin") !== -1;
}

function compareByName(a, b) {
  return readName(a, "").localeCompare(readName(b, ""));
}

function readName(source, fallback) {
  if (!source) {
    return fallback;
  }

  return source.displayName || source.name || source.title || source.fullName || fallback;
}

function addUniqueRecord(records, record) {
  if (!record || !record.id) {
    return;
  }

  if (!records.some(function (item) { return item.id === record.id; })) {
    records.push(record);
  }
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}
