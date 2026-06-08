import { collection, db, doc, getDoc, getDocs, query, where } from "../../firebase/index.js";
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

export async function getStudentsForClassRosters(classRecords) {
  var students = [];
  var queryErrors = [];
  var studentIds = readRosterStudentIds(classRecords);
  var index = 0;

  while (index < studentIds.length) {
    await appendStudentDoc(students, queryErrors, studentIds[index]);
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
  var matchedCount = 0;
  var scopeStartCount = students.length;

  while (index < identifiers.length) {
    matchedCount = matchedCount + (await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("classId", "==", identifiers[index])), {
      classId: identifiers[index],
      queryShape: "users where classId == classId"
    })).count;
    matchedCount = matchedCount + (await appendStudentQuery(students, queryErrors, query(collection(db, "users"), where("primaryClassId", "==", identifiers[index])), {
      classId: identifiers[index],
      queryShape: "users where primaryClassId == classId"
    })).count;
    index = index + 1;
  }

  if (matchedCount > 0) {
    return;
  }

  index = 0;
  while (index < identifiers.length) {
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

  if (students.length > scopeStartCount) {
    return;
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
    var beforeCount = students.length;
    var snapshot = await getDocs(studentsQuery);
    snapshot.forEach(function (studentSnap) {
      addUniqueRecord(students, Object.assign({ id: studentSnap.id }, studentSnap.data() || {}));
    });
    return {
      ok: true,
      count: students.length - beforeCount
    };
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
    return {
      ok: false,
      count: 0
    };
  }
}

async function appendStudentDoc(students, queryErrors, studentId) {
  console.info("[teacher-dashboard:students-query]", {
    classId: "",
    className: "",
    queryShape: "users/" + studentId
  });

  try {
    var studentSnap = await getDoc(doc(db, "users", studentId));

    if (studentSnap.exists()) {
      addUniqueRecord(students, Object.assign({ id: studentSnap.id }, studentSnap.data() || {}));
    }
  } catch (error) {
    queryErrors.push({
      collection: "users",
      studentId: studentId,
      queryShape: "users/" + studentId,
      errorCode: error && error.code ? error.code : "",
      errorMessage: readErrorMessage(error)
    });
    console.warn("[teacher-dashboard:students-query-failed]", {
      studentId: studentId,
      queryShape: "users/" + studentId,
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

function readRosterStudentIds(classRecords) {
  var ids = [];
  var records = Array.isArray(classRecords) ? classRecords : [];
  var index = 0;

  while (index < records.length) {
    appendTextValues(ids, records[index] && records[index].studentIds);
    appendTextValues(ids, records[index] && records[index].assignedStudentIds);
    appendTextValues(ids, records[index] && records[index].enrolledStudentIds);
    appendTextValues(ids, records[index] && records[index].learnerIds);
    appendTextValues(ids, records[index] && records[index].memberIds);
    appendRecordIds(ids, records[index] && records[index].students);
    appendRecordIds(ids, records[index] && records[index].assignedStudents);
    appendRecordIds(ids, records[index] && records[index].roster);
    appendRecordIds(ids, records[index] && records[index].studentRefs);
    index = index + 1;
  }

  return ids;
}

function appendRecordIds(result, values) {
  var records = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < records.length) {
    if (typeof records[index] === "string") {
      appendTextValues(result, records[index]);
    } else if (records[index] && typeof records[index] === "object") {
      appendTextValues(result, records[index].id || records[index].studentId || records[index].userId || records[index].uid || records[index].refId);
    }
    index = index + 1;
  }
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}
