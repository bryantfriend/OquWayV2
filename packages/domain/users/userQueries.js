import { collection, db, getDocs, query, where } from "../../firebase/firestore/index.js?v=1.1.218-dashboard-calm-teacher-functional";
import { isStudentProfile } from "./roleService.js";

export async function getStudentsForClasses(classIds) {
  var students = [];
  var safeClassIds = Array.isArray(classIds) ? classIds : [];
  var classIndex = 0;

  while (classIndex < safeClassIds.length) {
    await appendStudentQuery(students, query(collection(db, "users"), where("classId", "==", safeClassIds[classIndex])), {
      classId: safeClassIds[classIndex],
      queryShape: "users where classId == classId"
    });
    await appendStudentQuery(students, query(collection(db, "users"), where("classIds", "array-contains", safeClassIds[classIndex])), {
      classId: safeClassIds[classIndex],
      queryShape: "users where classIds array-contains classId"
    });
    await appendStudentQuery(students, query(collection(db, "users"), where("assignedClassIds", "array-contains", safeClassIds[classIndex])), {
      classId: safeClassIds[classIndex],
      queryShape: "users where assignedClassIds array-contains classId"
    });
    classIndex = classIndex + 1;
  }

  return students.filter(isStudentProfile).sort(compareByName);
}

export function userInClass(userProfile, classId) {
  return readUserClassIds(userProfile).indexOf(classId) !== -1;
}

export function readUserClassIds(userProfile) {
  return readTextArray([
    userProfile && userProfile.classId,
    userProfile && userProfile.classIds,
    userProfile && userProfile.assignedClassIds,
    userProfile && userProfile.assignedClasses,
    userProfile && userProfile.classRefs,
    userProfile && userProfile.classes
  ]);
}

async function appendStudentQuery(students, studentsQuery, details) {
  console.info("[teacher-dashboard:students-query]", {
    classId: details && details.classId ? details.classId : "",
    queryShape: details && details.queryShape ? details.queryShape : "users scoped query"
  });

  try {
    var snapshot = await getDocs(studentsQuery);
    snapshot.forEach(function (studentSnap) {
      addUniqueRecord(students, Object.assign({ id: studentSnap.id }, studentSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:students-query-failed]", {
      classId: details && details.classId ? details.classId : "",
      queryShape: details && details.queryShape ? details.queryShape : "users scoped query",
      errorMessage: readErrorMessage(error)
    });
  }
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

function readTextArray(values) {
  var result = [];
  var index = 0;

  while (index < values.length) {
    appendTextValues(result, values[index]);
    index = index + 1;
  }

  return result;
}

function appendTextValues(result, value) {
  if (typeof value === "string" && value && result.indexOf(value) === -1) {
    result.push(value);
    return;
  }

  if (Array.isArray(value)) {
    var index = 0;
    while (index < value.length) {
      appendTextValues(result, value[index]);
      index = index + 1;
    }
    return;
  }

  if (value && typeof value === "object") {
    appendTextValues(result, value.id);
    appendTextValues(result, value.classId);
    appendTextValues(result, value.classID);
    appendTextValues(result, value.refId);
  }
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}
