import { collection, db, getDocs, query, where } from "../../firebase/index.js";
import { isStudentProfile } from "./roleService.js";

var IN_QUERY_CHUNK_SIZE = 10;

export async function getStudentsForClasses(classIds) {
  var result = await getStudentsForClassScopes((Array.isArray(classIds) ? classIds : []).map(function (classId) {
    return { id: classId };
  }));

  return result.students;
}

export async function getStudentsForClassScopes(classScopes) {
  var students = [];
  var queryErrors = [];
  var safeClassScopes = Array.isArray(classScopes) ? classScopes : [];
  var classIndex = 0;

  while (classIndex < safeClassScopes.length) {
    await loadStudentsForClassScope(students, queryErrors, safeClassScopes[classIndex]);
    classIndex = classIndex + 1;
  }

  return {
    students: students.filter(isStudentProfile).sort(compareByName),
    queryErrors: queryErrors
  };
}

export async function getStudentsForClassIds(classIds) {
  var students = [];
  var queryErrors = [];
  var chunks = chunkValues(readTextArray([classIds]), IN_QUERY_CHUNK_SIZE);
  var index = 0;

  while (index < chunks.length) {
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("classId", "in", chunks[index])), {
      classId: chunks[index].join(","),
      queryShape: "users where classId in classIds"
    });
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("classIds", "array-contains-any", chunks[index])), {
      classId: chunks[index].join(","),
      queryShape: "users where classIds array-contains-any classIds"
    });
    index = index + 1;
  }

  return {
    students: students.filter(isStudentProfile).sort(compareByName),
    queryErrors: queryErrors
  };
}

export function buildStudentClassScope(classRecord) {
  var scope = {
    id: readText(classRecord && classRecord.id),
    identifiers: readTextArray([
      classRecord && classRecord.id,
      classRecord && classRecord.classId,
      classRecord && classRecord.name,
      classRecord && classRecord.subject,
      classRecord && classRecord.title,
      classRecord && classRecord.displayName,
      classRecord && classRecord.classCode,
      classRecord && classRecord.code
    ]),
    names: readTextArray([
      classRecord && classRecord.name,
      classRecord && classRecord.subject,
      classRecord && classRecord.title,
      classRecord && classRecord.displayName,
      classRecord && classRecord.classCode,
      classRecord && classRecord.code,
      buildGradeName(classRecord && (classRecord.name || classRecord.subject || classRecord.title))
    ])
  };

  return scope;
}

function buildGradeName(value) {
  var text = readText(value);

  if (!text || /^grade\s+/i.test(text)) {
    return "";
  }

  return "Grade " + text;
}

async function loadStudentsForClassScope(students, queryErrors, classScope) {
  var identifiers = classScope && Array.isArray(classScope.identifiers) && classScope.identifiers.length > 0
    ? classScope.identifiers
    : readTextArray([classScope && classScope.id]);
  var names = classScope && Array.isArray(classScope.names) ? classScope.names : [];
  var index = 0;

  while (index < identifiers.length) {
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("classId", "==", identifiers[index])), {
      classId: identifiers[index],
      queryShape: "users where classId == classId"
    });
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("primaryClassId", "==", identifiers[index])), {
      classId: identifiers[index],
      queryShape: "users where primaryClassId == classId"
    });
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("classIds", "array-contains", identifiers[index])), {
      classId: identifiers[index],
      queryShape: "users where classIds array-contains classId"
    });
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("assignedClassIds", "array-contains", identifiers[index])), {
      classId: identifiers[index],
      queryShape: "users where assignedClassIds array-contains classId"
    });
    index = index + 1;
  }

  index = 0;
  while (index < names.length) {
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("className", "==", names[index])), {
      classId: classScope && classScope.id ? classScope.id : names[index],
      className: names[index],
      queryShape: "users where className == class name"
    });
    await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("classCode", "==", names[index])), {
      classId: classScope && classScope.id ? classScope.id : names[index],
      className: names[index],
      queryShape: "users where classCode == class code"
    });
    index = index + 1;
  }
}

export function userInClass(userProfile, classId) {
  var identifiers = Array.isArray(classId) ? classId : [classId];
  var userIdentifiers = readTextArray([
    userProfile && userProfile.classId,
    userProfile && userProfile.primaryClassId,
    userProfile && userProfile.className,
    userProfile && userProfile.classIds,
    userProfile && userProfile.assignedClassIds
  ]);

  return identifiers.some(function (identifier) {
    return userIdentifiers.indexOf(identifier) !== -1;
  });
}

async function appendStudentQuery(students, queryErrors, studentsQuery, details) {
  console.info("[teacher-dashboard:students-query]", {
    classId: details && details.classId ? details.classId : "",
    className: details && details.className ? details.className : "",
    queryShape: details && details.queryShape ? details.queryShape : "users scoped query"
  });

  try {
    var snapshot = await getDocs(studentsQuery);
    snapshot.forEach(function (studentSnap) {
      addUniqueRecord(students, Object.assign({ id: studentSnap.id }, studentSnap.data() || {}));
    });
  } catch (error) {
    queryErrors.push({
      collection: "users",
      classId: details && details.classId ? details.classId : "",
      className: details && details.className ? details.className : "",
      queryShape: details && details.queryShape ? details.queryShape : "users scoped query",
      errorCode: error && error.code ? error.code : "",
      errorMessage: readErrorMessage(error)
    });
    console.warn("[teacher-dashboard:students-query-failed]", {
      classId: details && details.classId ? details.classId : "",
      className: details && details.className ? details.className : "",
      queryShape: details && details.queryShape ? details.queryShape : "users scoped query",
      errorCode: error && error.code ? error.code : "",
      errorMessage: error && error.message ? error.message : readErrorMessage(error)
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

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
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

  if (!Array.isArray(value)) {
    return;
  }

  var index = 0;
  while (index < value.length) {
    appendTextValues(result, value[index]);
    index = index + 1;
  }
}

function chunkValues(values, chunkSize) {
  var chunks = [];
  var index = 0;
  var safeValues = Array.isArray(values) ? values : [];

  while (index < safeValues.length) {
    chunks.push(safeValues.slice(index, index + chunkSize));
    index = index + chunkSize;
  }

  return chunks;
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}
