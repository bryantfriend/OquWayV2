import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, db, doc, getDoc, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.54-multi-role-assistant";
import { auth } from "../../../../../infrastructure/firebase/auth.js?v=1.1.54-multi-role-assistant";

export async function processTeacherLogin(executionState) {
  var payload = executionState.payload || {};

  try {
    var credential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
    var user = credential.user;
    if (user && user.getIdToken) {
      await user.getIdToken(true);
    }
    var profile = await loadUserProfile(user.uid);

    executionState.result = {
      user: {
        uid: user.uid,
        email: user.email || payload.email
      },
      profile: profile
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_LOGIN_FAILED", "Teacher login failed: " + readAuthErrorMessage(error));
  }
}

export async function processSendTeacherPasswordReset(executionState) {
  var payload = executionState.payload || {};

  try {
    await sendPasswordResetEmail(auth, payload.email);
    executionState.result = {
      email: payload.email,
      sent: true
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_PASSWORD_RESET_FAILED", "Could not send reset email: " + readAuthErrorMessage(error));
  }
}

export async function processLoadTeacherDashboard(executionState) {
  try {
    var data = await buildTeacherDashboardData(executionState);
    executionState.result = data;
    return { valid: true, data: data };
  } catch (error) {
    return createProcessError("TEACHER_DASHBOARD_LOAD_FAILED", "Could not load teacher dashboard: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherClasses(executionState) {
  try {
    var data = await buildTeacherDashboardData(executionState);
    executionState.result = {
      teacher: data.teacher,
      classes: data.classes,
      summary: data.summary
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_CLASSES_LOAD_FAILED", "Could not load teacher classes: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherStudents(executionState) {
  try {
    var profile = executionState.context.teacherProfile;
    var classIds = resolveRequestedClassIds(executionState.payload, executionState.context.teacherClassIds || []);
    var students = await loadStudentsForClasses(classIds);
    var progress = await loadProgressForStudents(students);
    var pendingCounts = await loadPendingCountsByStudent(classIds, executionState.context.teacherLocationIds || []);

    executionState.result = {
      teacher: profile,
      students: students.map(function (student) {
        return normalizeStudentCard(student, progress[student.id] || null, pendingCounts[student.id] || 0);
      })
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_STUDENTS_LOAD_FAILED", "Could not load teacher students: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherReviewQueue(executionState) {
  try {
    var payload = executionState.payload || {};
    var submissions = await loadScopedSubmissions({
      classIds: resolveRequestedClassIds(payload, executionState.context.teacherClassIds || []),
      locationIds: executionState.context.teacherLocationIds || [],
      reviewStatus: payload.reviewStatus,
      courseId: payload.courseId,
      moduleId: payload.moduleId
    });

    executionState.result = {
      submissions: submissions
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_REVIEW_QUEUE_LOAD_FAILED", "Could not load teacher review queue: " + readErrorMessage(error));
  }
}

async function buildTeacherDashboardData(executionState) {
  var profile = executionState.context.teacherProfile;
  var classIds = executionState.context.teacherClassIds || [];
  var locationIds = executionState.context.teacherLocationIds || [];
  var classes = await loadTeacherClasses(classIds, locationIds, readTeacherRoles(profile));
  var effectiveClassIds = classes.map(function (item) { return item.id; });
  var students = await loadStudentsForClasses(effectiveClassIds);
  var progress = await loadProgressForStudents(students);
  var assignments = await loadAssignmentsForClasses(effectiveClassIds);
  var pendingCountsByClass = await loadPendingCountsByClass(effectiveClassIds, locationIds);
  var pendingCountsByStudent = await loadPendingCountsByStudent(effectiveClassIds, locationIds);
  var submissions = await loadScopedSubmissions({
    classIds: effectiveClassIds,
    locationIds: locationIds,
    reviewStatus: (executionState.payload || {}).reviewStatus || "pending"
  });
  var classCards = classes.map(function (classRecord) {
    return normalizeClassCard(classRecord, students, assignments, pendingCountsByClass[classRecord.id] || 0);
  });
  var studentCards = students.map(function (student) {
    return normalizeStudentCard(student, progress[student.id] || null, pendingCountsByStudent[student.id] || 0);
  });

  console.info("[teacher-dashboard:context]", {
    teacherId: profile && profile.id ? profile.id : "",
    role: readPrimaryRole(profile),
    assignedClassCount: effectiveClassIds.length,
    studentCount: studentCards.length,
    pendingSubmissionsCount: submissions.length
  });

  return {
    teacher: normalizeTeacherProfile(profile),
    classes: classCards,
    students: studentCards,
    submissions: submissions,
    filters: {
      classIds: effectiveClassIds,
      locationIds: locationIds
    },
    summary: {
      classCount: classCards.length,
      studentCount: studentCards.length,
      pendingSubmissionsCount: submissions.filter(function (submission) {
        return submission.reviewStatus === "pending";
      }).length
    }
  };
}

async function loadTeacherClasses(classIds, locationIds, roles) {
  var classes = [];
  var index = 0;

  if (isAdminRoleList(roles) && classIds.length === 0) {
    return await loadClassesByLocations(locationIds);
  }

  while (index < classIds.length) {
    var classRecord = await loadClassById(classIds[index], locationIds);
    if (classRecord) {
      addUniqueRecord(classes, classRecord);
    }
    index = index + 1;
  }

  return classes.sort(compareByName);
}

async function loadClassById(classId, locationIds) {
  var classSnap = await getDoc(doc(db, "classes", classId));

  if (classSnap.exists()) {
    return Object.assign({ id: classSnap.id, source: "classes" }, classSnap.data() || {});
  }

  var index = 0;
  while (index < locationIds.length) {
    var nestedSnap = await getDoc(doc(db, "locations", locationIds[index], "classes", classId));
    if (nestedSnap.exists()) {
      return Object.assign({
        id: nestedSnap.id,
        locationId: locationIds[index],
        source: "locations/" + locationIds[index] + "/classes"
      }, nestedSnap.data() || {});
    }
    index = index + 1;
  }

  return {
    id: classId,
    name: "Class " + classId,
    source: "teacherProfile"
  };
}

async function loadClassesByLocations(locationIds) {
  var classes = [];
  var topLevelSnap = await getDocs(collection(db, "classes"));

  topLevelSnap.forEach(function (classSnap) {
    var data = Object.assign({ id: classSnap.id, source: "classes" }, classSnap.data() || {});
    if (locationIds.length === 0 || locationIds.indexOf(readClassLocationId(data)) !== -1) {
      addUniqueRecord(classes, data);
    }
  });

  return classes.sort(compareByName);
}

async function loadStudentsForClasses(classIds) {
  var students = [];
  var classIndex = 0;

  while (classIndex < classIds.length) {
    await appendStudentQuery(students, query(collection(db, "users"), where("classId", "==", classIds[classIndex])), {
      classId: classIds[classIndex],
      queryShape: "users where classId == classId"
    });
    await appendStudentQuery(students, query(collection(db, "users"), where("classIds", "array-contains", classIds[classIndex])), {
      classId: classIds[classIndex],
      queryShape: "users where classIds array-contains classId"
    });
    await appendStudentQuery(students, query(collection(db, "users"), where("assignedClassIds", "array-contains", classIds[classIndex])), {
      classId: classIds[classIndex],
      queryShape: "users where assignedClassIds array-contains classId"
    });
    classIndex = classIndex + 1;
  }

  return students.filter(isStudentProfile).sort(compareByName);
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

async function loadAssignmentsForClasses(classIds) {
  var assignments = [];
  var index = 0;

  while (index < classIds.length) {
    await appendAssignmentQuery(assignments, query(collection(db, "courseAssignments"), where("targetType", "==", "class"), where("targetId", "==", classIds[index]), where("status", "==", "active")));
    await appendAssignmentQuery(assignments, query(collection(db, "courseAssignments"), where("classId", "==", classIds[index]), where("status", "==", "active")));
    index = index + 1;
  }

  return assignments;
}

async function appendAssignmentQuery(assignments, assignmentsQuery) {
  try {
    var snapshot = await getDocs(assignmentsQuery);
    snapshot.forEach(function (assignmentSnap) {
      addUniqueRecord(assignments, Object.assign({ id: assignmentSnap.id }, assignmentSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:assignments-query-failed]", {
      errorMessage: readErrorMessage(error)
    });
  }
}

async function loadProgressForStudents(students) {
  var progressByStudent = {};
  var index = 0;

  while (index < students.length) {
    progressByStudent[students[index].id] = await readStudentProgressSummary(students[index].id);
    index = index + 1;
  }

  return progressByStudent;
}

async function readStudentProgressSummary(studentId) {
  try {
    var snapshot = await getDocs(collection(db, "studentProgress", studentId, "courses"));
    var courseCount = 0;
    var updatedAt = null;

    snapshot.forEach(function (courseSnap) {
      courseCount = courseCount + 1;
      var data = courseSnap.data() || {};
      if (!updatedAt || readMillis(data.updatedAt) > readMillis(updatedAt)) {
        updatedAt = data.updatedAt || updatedAt;
      }
    });

    return {
      courseCount: courseCount,
      lastActiveAt: updatedAt
    };
  } catch (error) {
    return {
      courseCount: 0,
      lastActiveAt: null
    };
  }
}

async function loadPendingCountsByClass(classIds, locationIds) {
  var submissions = await loadScopedSubmissions({
    classIds: classIds,
    locationIds: locationIds,
    reviewStatus: "pending"
  });
  var counts = {};
  var index = 0;

  while (index < submissions.length) {
    counts[submissions[index].classId] = (counts[submissions[index].classId] || 0) + 1;
    index = index + 1;
  }

  return counts;
}

async function loadPendingCountsByStudent(classIds, locationIds) {
  var submissions = await loadScopedSubmissions({
    classIds: classIds,
    locationIds: locationIds,
    reviewStatus: "pending"
  });
  var counts = {};
  var index = 0;

  while (index < submissions.length) {
    counts[submissions[index].studentId] = (counts[submissions[index].studentId] || 0) + 1;
    index = index + 1;
  }

  return counts;
}

async function loadScopedSubmissions(filters) {
  var submissions = [];
  var classIds = filters.classIds || [];
  var locationIds = filters.locationIds || [];
  var index = 0;

  while (index < classIds.length) {
    await appendSubmissionQuery(submissions, buildSubmissionQuery("classId", classIds[index], filters), {
      classId: classIds[index],
      locationId: "",
      queryShape: readSubmissionQueryShape("classId", filters)
    });
    index = index + 1;
  }

  if (classIds.length === 0) {
    index = 0;
    while (index < locationIds.length) {
      await appendSubmissionQuery(submissions, buildSubmissionQuery("locationId", locationIds[index], filters), {
        classId: "",
        locationId: locationIds[index],
        queryShape: readSubmissionQueryShape("locationId", filters)
      });
      index = index + 1;
    }
  }

  submissions = submissions.filter(function (submission) {
    return matchesOptional(submission.reviewStatus, filters.reviewStatus)
      && matchesOptional(submission.courseId, filters.courseId)
      && matchesOptional(submission.moduleId, filters.moduleId);
  });

  submissions.sort(function (a, b) {
    return readMillis(b.createdAt) - readMillis(a.createdAt);
  });

  return await enrichSubmissionsWithCourseMetadata(submissions);
}

function buildSubmissionQuery(scopeField, scopeValue, filters) {
  if (filters && filters.reviewStatus) {
    return query(collection(db, "externalTaskSubmissions"), where(scopeField, "==", scopeValue), where("reviewStatus", "==", filters.reviewStatus));
  }

  return query(collection(db, "externalTaskSubmissions"), where(scopeField, "==", scopeValue));
}

function readSubmissionQueryShape(scopeField, filters) {
  return filters && filters.reviewStatus
    ? "externalTaskSubmissions where " + scopeField + " == scopeValue and reviewStatus == " + filters.reviewStatus
    : "externalTaskSubmissions where " + scopeField + " == scopeValue";
}

async function appendSubmissionQuery(submissions, submissionsQuery, details) {
  console.info("[teacher-dashboard:submissions-query]", {
    classId: details && details.classId ? details.classId : "",
    locationId: details && details.locationId ? details.locationId : "",
    queryShape: details && details.queryShape ? details.queryShape : "externalTaskSubmissions scoped query"
  });

  try {
    var snapshot = await getDocs(submissionsQuery);
    snapshot.forEach(function (submissionSnap) {
      addUniqueRecord(submissions, Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:submissions-query-failed]", {
      classId: details && details.classId ? details.classId : "",
      locationId: details && details.locationId ? details.locationId : "",
      queryShape: details && details.queryShape ? details.queryShape : "externalTaskSubmissions scoped query",
      errorMessage: readErrorMessage(error)
    });
  }
}

async function loadUserProfile(uid) {
  var profileSnap = await getDoc(doc(db, "users", uid));

  if (profileSnap.exists()) {
    return normalizeTeacherProfileDocument(profileSnap, uid);
  }

  var authUidSnapshot = await getDocs(query(collection(db, "users"), where("authUid", "==", uid)));
  var profile = null;

  authUidSnapshot.forEach(function (snap) {
    if (!profile) {
      profile = normalizeTeacherProfileDocument(snap, uid);
    }
  });

  return profile;
}

function normalizeTeacherProfileDocument(profileSnap, authUid) {
  var data = profileSnap.data() || {};
  var profileAuthUid = readText(data.authUid) || authUid;

  return Object.assign({
    id: profileSnap.id,
    profileUserId: profileSnap.id,
    authUid: profileAuthUid
  }, data, {
    id: profileSnap.id,
    profileUserId: profileSnap.id,
    authUid: profileAuthUid
  });
}

async function enrichSubmissionsWithCourseMetadata(submissions) {
  var courseCache = {};
  var moduleCache = {};
  var index = 0;

  while (index < submissions.length) {
    var submission = submissions[index];
    var course = await loadCourseSummary(submission.courseId, courseCache);
    var module = await loadModuleSummary(submission.courseId, submission.moduleId, moduleCache, course ? course.source : "");

    submissions[index] = Object.assign({}, submission, {
      courseTitle: submission.courseTitle || (course ? course.title : ""),
      moduleTitle: submission.moduleTitle || (module ? module.title : "")
    });

    index = index + 1;
  }

  return submissions;
}

async function loadCourseSummary(courseId, cache) {
  if (!courseId) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(cache, courseId)) {
    return cache[courseId];
  }

  cache[courseId] = await readCourseSummaryFromSource(courseId, "catalogCourses")
    || await readCourseSummaryFromSource(courseId, "courses");

  return cache[courseId];
}

async function readCourseSummaryFromSource(courseId, source) {
  try {
    var courseSnap = await getDoc(doc(db, source, courseId));

    if (!courseSnap.exists()) {
      return null;
    }

    var data = courseSnap.data() || {};
    return {
      id: courseSnap.id,
      source: source,
      title: readTitle(data.title || data.name || data.displayName, "Untitled Course")
    };
  } catch (error) {
    return null;
  }
}

async function loadModuleSummary(courseId, moduleId, cache, preferredSource) {
  var cacheKey = courseId + "/" + moduleId;

  if (!courseId || !moduleId) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
    return cache[cacheKey];
  }

  cache[cacheKey] = await readModuleSummaryFromSource(courseId, moduleId, preferredSource || "catalogCourses")
    || await readModuleSummaryFromSource(courseId, moduleId, "catalogCourses")
    || await readModuleSummaryFromSource(courseId, moduleId, "courses");

  return cache[cacheKey];
}

async function readModuleSummaryFromSource(courseId, moduleId, source) {
  if (!source) {
    return null;
  }

  try {
    var moduleSnap = await getDoc(doc(db, source, courseId, "modules", moduleId));

    if (!moduleSnap.exists()) {
      return null;
    }

    var data = moduleSnap.data() || {};
    return {
      id: moduleSnap.id,
      source: source,
      title: readTitle(data.title || data.name || data.displayName, "Untitled Module")
    };
  } catch (error) {
    return null;
  }
}

function normalizeTeacherProfile(profile) {
  return {
    id: profile && profile.id ? profile.id : "",
    name: readName(profile, "Teacher"),
    email: profile && profile.email ? profile.email : "",
    role: readPrimaryRole(profile),
    roleLabel: formatRole(readPrimaryRole(profile)),
    locationId: profile && (profile.locationId || profile.primaryLocationId || profile.schoolId) ? (profile.locationId || profile.primaryLocationId || profile.schoolId) : "",
    locationName: profile && (profile.locationName || profile.schoolName) ? (profile.locationName || profile.schoolName) : "Assigned school"
  };
}

function normalizeClassCard(classRecord, students, assignments, pendingCount) {
  var classStudents = students.filter(function (student) {
    return studentInClass(student, classRecord.id);
  });
  var classAssignments = assignments.filter(function (assignment) {
    return assignment.targetId === classRecord.id || assignment.classId === classRecord.id;
  });

  return {
    id: classRecord.id,
    name: readName(classRecord, "Class " + classRecord.id),
    locationId: readClassLocationId(classRecord),
    locationName: classRecord.locationName || classRecord.schoolName || classRecord.locationId || "Assigned location",
    studentCount: classStudents.length,
    assignedCoursesCount: countUniqueCourseIds(classAssignments),
    pendingSubmissionsCount: pendingCount,
    source: classRecord.source || "classes"
  };
}

function normalizeStudentCard(student, progress, pendingCount) {
  return {
    id: student.id,
    name: readName(student, "Student " + student.id),
    photoUrl: student.photoUrl || student.avatarUrl || "",
    classId: student.classId || firstArrayValue(student.classIds) || firstArrayValue(student.assignedClassIds),
    classIds: readTextArray([student.classId, student.classIds, student.assignedClassIds]),
    lastActiveAt: progress ? progress.lastActiveAt : null,
    currentCourseProgress: progress && progress.courseCount > 0 ? progress.courseCount + " course(s) active" : "No progress yet",
    pendingSubmissionsCount: pendingCount,
    status: pendingCount > 0 ? "needsReview" : "steady"
  };
}

function resolveRequestedClassIds(payload, teacherClassIds) {
  var classId = payload && payload.classId ? payload.classId : "";

  if (classId && teacherClassIds.indexOf(classId) !== -1) {
    return [classId];
  }

  return teacherClassIds.slice();
}

function readTeacherRoles(profile) {
  var roles = [];

  if (profile && Array.isArray(profile.roles)) {
    roles = roles.concat(profile.roles.map(normalizeRole));
  }

  if (profile && profile.role) {
    roles.push(normalizeRole(profile.role));
  }

  return roles;
}

function isAdminRoleList(roles) {
  return roles.indexOf("schoolAdmin") !== -1 || roles.indexOf("platformAdmin") !== -1 || roles.indexOf("superAdmin") !== -1;
}

function isStudentProfile(profile) {
  var roles = readTeacherRoles(profile);

  if (roles.length === 0) {
    return profile && (profile.classId || Array.isArray(profile.classIds));
  }

  return roles.indexOf("student") !== -1;
}

function studentInClass(student, classId) {
  return readTextArray([student.classId, student.classIds, student.assignedClassIds]).indexOf(classId) !== -1;
}

function countUniqueCourseIds(assignments) {
  var ids = [];
  var index = 0;

  while (index < assignments.length) {
    if (assignments[index].courseId && ids.indexOf(assignments[index].courseId) === -1) {
      ids.push(assignments[index].courseId);
    }
    index = index + 1;
  }

  return ids.length;
}

function addUniqueRecord(records, record) {
  if (!record || !record.id) {
    return;
  }

  if (!records.some(function (item) { return item.id === record.id; })) {
    records.push(record);
  }
}

function readClassLocationId(classRecord) {
  return classRecord.locationId || classRecord.schoolId || classRecord.primaryLocationId || "";
}

function readName(source, fallback) {
  if (!source) {
    return fallback;
  }

  return source.displayName || source.name || source.title || source.fullName || fallback;
}

function readTitle(value, fallback) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (value && typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }

  return fallback;
}

function readPrimaryRole(profile) {
  var roles = readTeacherRoles(profile);
  return roles.length > 0 ? roles[0] : "";
}

function formatRole(role) {
  if (role === "schoolAdmin") return "School Admin";
  if (role === "platformAdmin") return "Platform Admin";
  if (role === "superAdmin") return "Super Admin";
  if (role === "teacher") return "Teacher";
  return "Teacher";
}

function normalizeRole(role) {
  var normalized = typeof role === "string"
    ? role.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase()
    : "";

  if (normalized === "schooladmin") return "schoolAdmin";
  if (normalized === "platformadmin") return "platformAdmin";
  if (normalized === "superadmin") return "superAdmin";
  if (normalized === "rolestudent" || normalized === "student") return "student";
  if (normalized === "roleteacher" || normalized === "teacher") return "teacher";
  return normalized;
}

function compareByName(a, b) {
  return readName(a, "").localeCompare(readName(b, ""));
}

function matchesOptional(actual, expected) {
  return !expected || actual === expected;
}

function firstArrayValue(value) {
  return Array.isArray(value) && value.length > 0 ? value[0] : "";
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

function readMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value === "number") {
    return value;
  }

  if (value.seconds) {
    return value.seconds * 1000;
  }

  return 0;
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

function readAuthErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
    return "Email or password is incorrect.";
  }

  return readErrorMessage(error);
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}


