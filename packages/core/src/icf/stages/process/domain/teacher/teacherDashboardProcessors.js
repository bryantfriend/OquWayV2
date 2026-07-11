import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, db, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.218-dashboard-calm-teacher-functional";
import { auth } from "../../../../../infrastructure/firebase/auth.js?v=1.1.218-dashboard-calm-teacher-functional";
import { getClassesForTeacher } from "../../../../../../../domain/classes/index.js";
import { getExternalTaskSubmissionsForTeacher } from "../../../../../../../domain/externalTasks/index.js?v=1.1.218-dashboard-calm-teacher-functional";
import {
  getStudentProfile,
  getStudentsForClasses,
  getUserProfileByAuthUid,
  getUserRoles,
  readUserClassIds,
  isStudentProfile as isStudentUserProfile,
  userInClass as userProfileInClass
} from "../../../../../../../domain/users/index.js";

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
    console.warn("[teacher-login:auth-failed]", {
      email: payload.email || "",
      errorCode: error && error.code ? error.code : "",
      errorMessage: readErrorMessage(error)
    });
    return createProcessError("TEACHER_LOGIN_FAILED", readAuthErrorMessage(error));
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
    return createProcessError("TEACHER_PASSWORD_RESET_FAILED", readPasswordResetErrorMessage(error));
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

export async function processLoadTeacherCourses(executionState) {
  try {
    var data = await buildTeacherDashboardData(executionState);
    executionState.result = {
      teacher: data.teacher,
      courses: data.courses,
      summary: data.summary
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_COURSES_LOAD_FAILED", "Could not load teacher courses: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherClassDetail(executionState) {
  try {
    var data = await buildTeacherDashboardData(executionState);
    var requestedClassId = executionState.payload && executionState.payload.classId ? executionState.payload.classId : "";
    var classRecord = findById(data.classes, requestedClassId);
    var classStudents = data.students.filter(function (student) {
      return !requestedClassId || studentInClass(student, requestedClassId);
    });
    var classCourses = data.courses.filter(function (course) {
      return !requestedClassId || (course.classIds || []).indexOf(requestedClassId) !== -1;
    });
    var classSubmissions = data.submissions.filter(function (submission) {
      return !requestedClassId || submission.classId === requestedClassId || submission.targetClassId === requestedClassId || submission.targetId === requestedClassId;
    });

    executionState.result = {
      teacher: data.teacher,
      classRecord: classRecord,
      students: classStudents,
      courses: classCourses,
      submissions: classSubmissions,
      summary: {
        studentCount: classStudents.length,
        courseCount: classCourses.length,
        pendingSubmissionsCount: countPendingSubmissions(classSubmissions)
      }
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_CLASS_DETAIL_LOAD_FAILED", "Could not load teacher class detail: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherCourseDetail(executionState) {
  try {
    var data = await buildTeacherDashboardData(executionState);
    var payload = executionState.payload || {};
    var courseCard = findById(data.courses, payload.assignmentId || payload.courseAssignmentId || "");

    if (!courseCard && payload.courseId) {
      courseCard = data.courses.find(function (item) {
        return item.courseId === payload.courseId;
      }) || null;
    }

    var courseSubmissions = data.submissions.filter(function (submission) {
      return !courseCard
        || (courseCard.assignmentIds || []).indexOf(submission.courseAssignmentId || submission.assignmentId || "") !== -1
        || submission.courseId === courseCard.courseId;
    });
    var courseStudents = courseCard ? filterStudentsForCourseCard(data.students, courseCard) : [];
    var courseModules = courseCard ? await loadModulesForCourse(courseCard.courseId) : [];

    executionState.result = {
      teacher: data.teacher,
      course: courseCard,
      students: courseStudents,
      modules: courseModules,
      submissions: courseSubmissions,
      summary: {
        studentCount: courseStudents.length,
        moduleCount: courseModules.length,
        pendingSubmissionsCount: countPendingSubmissions(courseSubmissions)
      }
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_COURSE_DETAIL_LOAD_FAILED", "Could not load teacher course detail: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherStudents(executionState) {
  try {
    var scope = await loadTeacherOwnershipScope(executionState);
    var profile = scope.profile;
    var classIds = resolveRequestedClassIds(executionState.payload, scope.classIds);
    var students = await loadStudentsForClasses(classIds);
    var progress = await loadProgressForStudents(students);
    var submissions = await loadScopedSubmissions({
      classIds: classIds,
      assignmentIds: scope.assignmentIds,
      courseIds: scope.courseIds,
      teacherIds: scope.teacherIds,
      reviewStatus: "pending"
    });
    var pendingCounts = countSubmissionsByField(submissions, "studentId");

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
    var scope = await loadTeacherOwnershipScope(executionState);
    var submissions = await loadScopedSubmissions({
      classIds: resolveRequestedClassIds(payload, scope.classIds),
      assignmentIds: scope.assignmentIds,
      courseIds: scope.courseIds,
      teacherIds: scope.teacherIds,
      reviewStatus: payload.reviewStatus,
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      studentSearch: payload.studentSearch
    });

    executionState.result = {
      submissions: submissions
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_REVIEW_QUEUE_LOAD_FAILED", "Could not load teacher review queue: " + readErrorMessage(error));
  }
}


export async function processLoadTeacherAttendance(executionState) {
  try {
    var payload = executionState.payload || {};
    var data = await buildTeacherDashboardData(executionState);
    var classId = resolveAttendanceClassId(payload.classId, data.classes);
    var students = filterStudentsForClassId(data.students, classId);
    var record = classId ? await readAttendanceRecord(classId, payload.attendanceDate) : null;

    executionState.result = {
      teacher: data.teacher,
      classId: classId,
      attendanceDate: payload.attendanceDate,
      classes: data.classes,
      students: normalizeAttendanceStudents(students, record),
      record: record,
      summary: summarizeAttendanceRecord(students, record)
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_ATTENDANCE_LOAD_FAILED", "Could not load attendance: " + readErrorMessage(error));
  }
}

export async function processSaveTeacherAttendance(executionState) {
  try {
    var payload = executionState.payload || {};
    var scope = await loadTeacherOwnershipScope(executionState);
    var classRecord = findById(scope.classes, payload.classId);

    if (!classRecord) {
      return createProcessError("TEACHER_ATTENDANCE_SCOPE_DENIED", "This class is outside this teacher's scope.");
    }

    var students = await loadStudentsForScope([payload.classId], [classRecord], scope.assignments);
    var record = createAttendanceRecord(payload, scope, classRecord, students);

    await setDoc(doc(db, "attendanceRecords", createAttendanceRecordId(payload.classId, payload.attendanceDate)), record, { merge: true });

    executionState.result = {
      classId: payload.classId,
      attendanceDate: payload.attendanceDate,
      record: record,
      students: normalizeAttendanceStudents(students, record),
      summary: summarizeAttendanceRecord(students, record)
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_ATTENDANCE_SAVE_FAILED", "Could not save attendance: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherStudentDetail(executionState) {
  try {
    var payload = executionState.payload || {};
    var detailExecutionState = Object.assign({}, executionState, {
      payload: Object.assign({}, payload, { reviewStatus: "" })
    });
    var data = await buildTeacherDashboardData(detailExecutionState);
    var student = findById(data.students, payload.studentId);
    var studentSubmissions = data.submissions.filter(function (submission) {
      return submission.studentId === payload.studentId;
    });
    var studentCourses = data.courses.filter(function (course) {
      return student && isStudentInCourseCard(student, course);
    });
    var attendanceSummary = student ? await loadAttendanceSummaryForStudent(student, data.classes) : createEmptyAttendanceSummary();

    if (!student) {
      return createProcessError("TEACHER_STUDENT_SCOPE_DENIED", "This student is outside this teacher's scope.");
    }

    executionState.result = {
      student: student,
      courses: studentCourses,
      submissions: studentSubmissions,
      attendanceSummary: attendanceSummary,
      helpSignals: student.helpSignals || [],
      summary: {
        courseCount: studentCourses.length,
        pendingSubmissionsCount: countPendingSubmissions(studentSubmissions),
        attendanceConcernCount: attendanceSummary.absent + attendanceSummary.late
      }
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_STUDENT_DETAIL_LOAD_FAILED", "Could not load student detail: " + readErrorMessage(error));
  }
}
async function buildTeacherDashboardData(executionState) {
  var scope = await loadTeacherOwnershipScope(executionState);
  var profile = scope.profile;
  var classes = scope.classes;
  var effectiveClassIds = scope.classIds;
  var students = await loadStudentsForScope(effectiveClassIds, classes, scope.assignments);
  var progress = await loadProgressForStudents(students);
  var submissions = await loadScopedSubmissions({
    classIds: effectiveClassIds,
    assignmentIds: scope.assignmentIds,
    courseIds: scope.courseIds,
    teacherIds: scope.teacherIds,
    reviewStatus: readDashboardReviewStatus(executionState.payload || {})
  });
  var pendingCountsByClass = countSubmissionsByField(submissions, "classId");
  var pendingCountsByStudent = countSubmissionsByField(submissions, "studentId");
  var pendingCountsByAssignment = countSubmissionsByAssignment(submissions);
  var pendingCountsByCourse = countSubmissionsByField(submissions, "courseId");
  var classCards = classes.map(function (classRecord) {
    return normalizeClassCard(classRecord, students, scope.assignments, pendingCountsByClass[classRecord.id] || 0);
  });
  var courseCards = await normalizeCourseAssignmentCards(scope.assignments, classes, students, pendingCountsByAssignment, pendingCountsByCourse);
  var studentCards = students.map(function (student) {
    return normalizeStudentCard(student, progress[student.id] || null, pendingCountsByStudent[student.id] || 0);
  });

  console.info("[teacher-dashboard:context]", {
    teacherId: profile && profile.id ? profile.id : "",
    authUid: scope.authUid,
    profileUserId: scope.profileUserId,
    ownershipIds: scope.teacherIds,
    role: readPrimaryRole(profile),
    assignedClassCount: effectiveClassIds.length,
    ownedCourseAssignmentCount: courseCards.length,
    studentCount: studentCards.length,
    pendingSubmissionsCount: submissions.length
  });

  return {
    teacher: normalizeTeacherProfile(profile),
    classes: classCards,
    courses: courseCards,
    students: studentCards,
    submissions: submissions,
    filters: {
      classIds: effectiveClassIds,
      courseIds: scope.courseIds,
      assignmentIds: scope.assignmentIds
    },
    summary: {
      classCount: classCards.length,
      courseCount: courseCards.length,
      studentCount: studentCards.length,
      pendingSubmissionsCount: submissions.filter(function (submission) {
        return submission.reviewStatus === "pending";
      }).length
    }
  };
}

function readDashboardReviewStatus(payload) {
  if (Object.prototype.hasOwnProperty.call(payload || {}, "reviewStatus")) {
    return payload.reviewStatus;
  }

  return "pending";
}
async function loadTeacherOwnershipScope(executionState) {
  var context = executionState.context || {};
  var profile = context.teacherProfile || null;
  var teacherIds = readTeacherOwnershipIds(context, profile, executionState.actor || {});
  var classes = await loadTeacherClassesByOwnership(teacherIds, readTeacherRoles(profile));
  var assignments = await loadOwnedCourseAssignments(teacherIds);
  var classIds = readOwnedClassIds(classes, assignments);
  var assignmentIds = assignments.map(function (assignment) { return assignment.id; });
  var courseIds = readOwnedCourseIds(assignments);

  console.info("[teacher-dashboard:ownership-scope]", {
    authUid: context.authUid || "",
    profileUserId: context.profileUserId || "",
    teacherIds: teacherIds,
    ownedClassCount: classes.length,
    ownedCourseAssignmentCount: assignments.length,
    ownedClassIds: classIds,
    ownedCourseIds: courseIds
  });

  return {
    profile: profile,
    authUid: context.authUid || "",
    profileUserId: context.profileUserId || "",
    teacherIds: teacherIds,
    classes: classes,
    assignments: assignments,
    classIds: classIds,
    assignmentIds: assignmentIds,
    courseIds: courseIds
  };
}

async function loadTeacherClassesByOwnership(teacherIds, roles) {
  return getClassesForTeacher(teacherIds, roles);
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

async function loadStudentsForClasses(classIds) {
  return getStudentsForClasses(classIds);
}

async function loadStudentsForScope(classIds, classes, assignments) {
  var students = await loadStudentsForClasses(classIds);
  var studentIds = readScopedStudentIds(classes, assignments);
  var index = 0;

  while (index < studentIds.length) {
    try {
      addUniqueRecord(students, await getStudentProfile(studentIds[index]));
    } catch (error) {
      console.warn("[teacher-dashboard:student-profile-load-failed]", {
        studentId: studentIds[index],
        errorMessage: readErrorMessage(error)
      });
    }
    index = index + 1;
  }

  return students.filter(isStudentProfile).sort(compareByName);
}

function readScopedStudentIds(classes, assignments) {
  var ids = [];
  var index = 0;

  while (index < (classes || []).length) {
    appendTextValues(ids, classes[index].studentIds || []);
    appendTextValues(ids, classes[index].students || []);
    appendTextValues(ids, classes[index].assignedStudentIds || []);
    index = index + 1;
  }

  index = 0;
  while (index < (assignments || []).length) {
    appendTextValues(ids, readAssignmentStudentIds(assignments[index]));
    index = index + 1;
  }

  return ids;
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

async function loadOwnedCourseAssignments(teacherIds) {
  var assignments = [];
  var index = 0;

  while (index < teacherIds.length) {
    await appendAssignmentOwnershipQuery(assignments, query(collection(db, "courseAssignments"), where("teacherOwnershipIds", "array-contains", teacherIds[index])), {
      teacherId: teacherIds[index],
      ownershipRole: "Assigned",
      queryShape: "courseAssignments where teacherOwnershipIds array-contains teacherId"
    });
    await appendAssignmentOwnershipQuery(assignments, query(collection(db, "courseAssignments"), where("responsibleTeacherId", "==", teacherIds[index])), {
      teacherId: teacherIds[index],
      ownershipRole: "Responsible Teacher",
      queryShape: "courseAssignments where responsibleTeacherId == teacherId"
    });
    await appendAssignmentOwnershipQuery(assignments, query(collection(db, "courseAssignments"), where("assistantIds", "array-contains", teacherIds[index])), {
      teacherId: teacherIds[index],
      ownershipRole: "Assistant",
      queryShape: "courseAssignments where assistantIds array-contains teacherId"
    });
    index = index + 1;
  }

  return assignments.filter(isVisibleCourseAssignment).sort(compareAssignmentByTitle);
}

async function appendAssignmentOwnershipQuery(assignments, assignmentsQuery, details) {
  console.info("[teacher-dashboard:courses-query]", {
    teacherId: details && details.teacherId ? details.teacherId : "",
    queryShape: details && details.queryShape ? details.queryShape : "courseAssignments ownership query"
  });

  try {
    var snapshot = await getDocs(assignmentsQuery);
    snapshot.forEach(function (assignmentSnap) {
      addUniqueRecord(assignments, Object.assign({
        id: assignmentSnap.id,
        ownershipRole: details && details.ownershipRole ? details.ownershipRole : "Assigned"
      }, assignmentSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:courses-query-failed]", {
      teacherId: details && details.teacherId ? details.teacherId : "",
      queryShape: details && details.queryShape ? details.queryShape : "courseAssignments ownership query",
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

async function loadScopedSubmissions(filters) {
  return await enrichSubmissionsWithCourseMetadata(await getExternalTaskSubmissionsForTeacher(filters));
}

async function loadUserProfile(uid) {
  var lookup = await getUserProfileByAuthUid(uid);
  return lookup.profile;
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

async function loadModulesForCourse(courseId) {
  if (!courseId) {
    return [];
  }

  var catalogModules = await readModulesForCourseFromSource(courseId, "catalogCourses");

  if (catalogModules.length > 0) {
    return catalogModules;
  }

  return await readModulesForCourseFromSource(courseId, "courses");
}

async function readModulesForCourseFromSource(courseId, source) {
  var modules = [];

  try {
    var snapshot = await getDocs(collection(db, source, courseId, "modules"));
    snapshot.forEach(function (moduleSnap) {
      var data = moduleSnap.data() || {};
      modules.push({
        id: moduleSnap.id,
        moduleId: moduleSnap.id,
        source: source,
        title: readTitle(data.title || data.name || data.displayName, "Untitled Module"),
        status: data.status || data.lifecycleStatus || (data.published === true ? "published" : "draft"),
        order: typeof data.order === "number" ? data.order : 0,
        updatedAt: data.updatedAt || data.modifiedAt || data.createdAt || null
      });
    });
  } catch (error) {
    return [];
  }

  return modules.sort(function (a, b) {
    return a.order - b.order || a.title.localeCompare(b.title);
  });
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
    profileUserId: profile && profile.profileUserId ? profile.profileUserId : "",
    authUid: profile && profile.authUid ? profile.authUid : "",
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
    return readAssignmentClassIds(assignment).indexOf(classRecord.id) !== -1;
  });

  return {
    id: classRecord.id,
    name: readName(classRecord, "Class " + classRecord.id),
    locationId: readClassLocationId(classRecord),
    locationName: classRecord.locationName || classRecord.schoolName || classRecord.locationId || "Assigned location",
    studentCount: classStudents.length,
    assignedCoursesCount: countUniqueCourseIds(classAssignments),
    pendingSubmissionsCount: pendingCount,
    ownershipRole: classRecord.ownershipRole || "Assigned",
    source: classRecord.source || "classes"
  };
}

async function normalizeCourseAssignmentCards(assignments, classes, students, pendingCountsByAssignment, pendingCountsByCourse) {
  var courseCache = {};
  var aggregates = {};
  var order = [];
  var index = 0;

  while (index < assignments.length) {
    var assignment = assignments[index];
    var courseId = readText(assignment.courseId || assignment.catalogCourseId || assignment.targetCourseId || "");
    var aggregateKey = courseId || assignment.id;
    var course = await loadCourseSummary(courseId, courseCache);
    var aggregate = aggregates[aggregateKey];

    if (!aggregate) {
      aggregate = {
        id: aggregateKey,
        courseId: courseId,
        courseTitle: assignment.courseTitle || assignment.title || (course ? course.title : "Untitled Course"),
        targetType: assignment.targetType || "",
        targetId: "",
        targetName: "",
        targetNames: [],
        ownershipRole: assignment.ownershipRole || "Assigned",
        ownershipRoles: [],
        assignmentIds: [],
        classIds: [],
        studentIds: [],
        studentCount: 0,
        pendingSubmissionsCount: 0,
        status: assignment.status || "active"
      };
      aggregates[aggregateKey] = aggregate;
      order.push(aggregateKey);
    }

    addText(aggregate.assignmentIds, assignment.id || "");
    addText(aggregate.ownershipRoles, assignment.ownershipRole || "Assigned");
    addAssignmentScope(aggregate, assignment, classes);
    aggregate.pendingSubmissionsCount = aggregate.pendingSubmissionsCount + (pendingCountsByAssignment[assignment.id] || 0);
    index = index + 1;
  }

  return order.map(function (key) {
    var aggregate = aggregates[key];
    var courseStudents = filterStudentsForCourseCard(students, aggregate);
    var coursePendingCount = pendingCountsByCourse[aggregate.courseId] || 0;

    aggregate.studentCount = courseStudents.length;
    if (coursePendingCount > aggregate.pendingSubmissionsCount) {
      aggregate.pendingSubmissionsCount = coursePendingCount;
    }
    aggregate.targetType = aggregate.classIds.length > 0 ? "class" : (aggregate.studentIds.length > 0 ? "student" : aggregate.targetType);
    aggregate.targetId = aggregate.classIds[0] || aggregate.studentIds[0] || "";
    aggregate.targetName = readAggregateTargetName(aggregate);
    aggregate.ownershipRole = aggregate.ownershipRoles.length > 1 ? "Multiple roles" : (aggregate.ownershipRoles[0] || aggregate.ownershipRole || "Assigned");

    return aggregate;
  }).sort(function (a, b) {
    return (a.courseTitle || "").localeCompare(b.courseTitle || "");
  });
}

function addAssignmentScope(aggregate, assignment, classes) {
  var classIds = readAssignmentClassIds(assignment);
  var studentIds = readAssignmentStudentIds(assignment);
  var index = 0;

  while (index < classIds.length) {
    addText(aggregate.classIds, classIds[index]);
    addText(aggregate.targetNames, readClassNameForAssignment(classes, classIds[index]) || classIds[index]);
    index = index + 1;
  }

  index = 0;
  while (index < studentIds.length) {
    addText(aggregate.studentIds, studentIds[index]);
    addText(aggregate.targetNames, assignment.targetName || assignment.studentName || studentIds[index]);
    index = index + 1;
  }

  if (aggregate.targetNames.length === 0) {
    addText(aggregate.targetNames, assignment.targetName || assignment.className || "Assigned target");
  }
}

function readAggregateTargetName(aggregate) {
  if (aggregate.targetNames.length === 0) {
    return "Assigned target";
  }

  if (aggregate.targetNames.length === 1) {
    return aggregate.targetNames[0];
  }

  return aggregate.targetNames.slice(0, 2).join(", ") + (aggregate.targetNames.length > 2 ? " +" + (aggregate.targetNames.length - 2) : "");
}

function readClassNameForAssignment(classes, classId) {
  var classRecord = findById(classes, classId);
  return classRecord ? classRecord.name : "";
}
function normalizeStudentCard(student, progress, pendingCount) {
  return {
    id: student.id,
    name: readName(student, "Student " + student.id),
    photoUrl: student.photoUrl || student.avatarUrl || "",
    classId: student.classId || firstArrayValue(student.classIds) || firstArrayValue(student.assignedClassIds),
    classIds: readUserClassIds(student),
    lastActiveAt: progress ? progress.lastActiveAt : null,
    currentCourseProgress: progress && progress.courseCount > 0 ? progress.courseCount + " course(s) active" : "No progress yet",
    pendingSubmissionsCount: pendingCount,
    status: pendingCount > 0 ? "needsReview" : "steady"
  };
}

function resolveAttendanceClassId(classId, classes) {
  if (classId && findById(classes, classId)) {
    return classId;
  }

  return classes && classes.length > 0 ? classes[0].id : "";
}

function filterStudentsForClassId(students, classId) {
  if (!classId) {
    return [];
  }

  return (students || []).filter(function (student) {
    return studentInClass(student, classId) || (student.classIds || []).indexOf(classId) !== -1 || student.classId === classId;
  }).sort(compareByName);
}

async function readAttendanceRecord(classId, attendanceDate) {
  if (!classId || !attendanceDate) {
    return null;
  }

  try {
    var recordSnap = await getDoc(doc(db, "attendanceRecords", createAttendanceRecordId(classId, attendanceDate)));

    if (!recordSnap.exists()) {
      return null;
    }

    return Object.assign({ id: recordSnap.id }, recordSnap.data() || {});
  } catch (error) {
    return null;
  }
}

function createAttendanceRecord(payload, scope, classRecord, students) {
  var statuses = payload.statuses || {};
  var notes = payload.notes || {};
  var records = {};
  var index = 0;

  while (index < students.length) {
    records[students[index].id] = {
      studentId: students[index].id,
      studentName: readName(students[index], "Student " + students[index].id),
      status: normalizeAttendanceStatus(statuses[students[index].id]),
      note: readText(notes[students[index].id] || "")
    };
    index = index + 1;
  }

  return {
    classId: payload.classId,
    className: classRecord ? readName(classRecord, "Class " + payload.classId) : "",
    attendanceDate: payload.attendanceDate,
    locationId: classRecord ? readClassLocationId(classRecord) : "",
    teacherId: scope.profile && scope.profile.id ? scope.profile.id : "",
    teacherName: scope.profile ? readName(scope.profile, "Teacher") : "",
    records: records,
    summary: summarizeAttendanceRecord(students, { records: records }),
    updatedAt: serverTimestamp()
  };
}

function normalizeAttendanceStudents(students, record) {
  var safeStudents = Array.isArray(students) ? students : [];
  var records = record && record.records ? record.records : {};

  return safeStudents.map(function (student) {
    var attendance = records[student.id] || {};

    return Object.assign({}, student, {
      attendanceStatus: normalizeAttendanceStatus(attendance.status || ""),
      attendanceNote: attendance.note || ""
    });
  });
}

function summarizeAttendanceRecord(students, record) {
  var summary = {
    total: students ? students.length : 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    unmarked: 0
  };
  var records = record && record.records ? record.records : {};
  var safeStudents = Array.isArray(students) ? students : [];
  var index = 0;

  while (index < safeStudents.length) {
    var status = normalizeAttendanceStatus(records[safeStudents[index].id] ? records[safeStudents[index].id].status : "");
    if (!status) {
      summary.unmarked = summary.unmarked + 1;
    } else {
      summary[status] = summary[status] + 1;
    }
    index = index + 1;
  }

  return summary;
}

async function loadAttendanceSummaryForStudent(student, classes) {
  var classIds = readUserClassIds(student);
  var summary = createEmptyAttendanceSummary();
  var index = 0;

  if (classIds.length === 0 && student.classId) {
    classIds.push(student.classId);
  }

  while (index < classIds.length) {
    if (findById(classes, classIds[index])) {
      await addAttendanceRecordsForStudent(summary, student.id, classIds[index]);
    }
    index = index + 1;
  }

  return summary;
}

async function addAttendanceRecordsForStudent(summary, studentId, classId) {
  try {
    var snapshot = await getDocs(query(collection(db, "attendanceRecords"), where("classId", "==", classId)));
    snapshot.forEach(function (recordSnap) {
      var data = recordSnap.data() || {};
      var record = data.records && data.records[studentId] ? data.records[studentId] : null;
      var status = record ? normalizeAttendanceStatus(record.status || "") : "";

      if (status) {
        summary.total = summary.total + 1;
        summary[status] = summary[status] + 1;
        summary.lastMarkedAt = readLatestValue(summary.lastMarkedAt, data.attendanceDate || data.updatedAt);
      }
    });
  } catch (error) {
    return;
  }
}

function createEmptyAttendanceSummary() {
  return {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    lastMarkedAt: null
  };
}

function createAttendanceRecordId(classId, attendanceDate) {
  return cleanRecordSegment(classId) + "_" + cleanRecordSegment(attendanceDate);
}

function cleanRecordSegment(value) {
  return String(value || "unknown").replace(/[^a-zA-Z0-9_-]/g, "-");
}

function normalizeAttendanceStatus(value) {
  var text = readText(value);

  if (text === "present" || text === "absent" || text === "late" || text === "excused") {
    return text;
  }

  return "";
}

function isStudentInCourseCard(student, courseCard) {
  return (courseCard.classIds || []).some(function (classId) {
    return (student.classIds || []).indexOf(classId) !== -1 || student.classId === classId;
  }) || (courseCard.studentIds || []).indexOf(student.id) !== -1;
}

function readStudentHelpSignals(progress, pendingCount) {
  var signals = [];
  var progressPercent = progress && typeof progress.progressPercent === "number" ? progress.progressPercent : 0;
  var lastActiveMillis = progress ? readMillis(progress.lastActiveAt) : 0;
  var staleAfterMillis = 1000 * 60 * 60 * 24 * 7;

  if (pendingCount > 0) {
    signals.push("Needs teacher review");
  }

  if (!progress || progress.courseCount === 0) {
    signals.push("No course progress yet");
  } else if (progressPercent > 0 && progressPercent < 35) {
    signals.push("Low course progress");
  }

  if (!lastActiveMillis) {
    signals.push("No recent activity");
  } else if (Date.now() - lastActiveMillis > staleAfterMillis) {
    signals.push("Inactive for 7+ days");
  }

  return signals;
}

function readCompletedModeCount(progressDoc) {
  var count = 0;
  var sessions = progressDoc && progressDoc.sessions && typeof progressDoc.sessions === "object" ? progressDoc.sessions : {};
  var modes = progressDoc && progressDoc.practiceModes && typeof progressDoc.practiceModes === "object" ? progressDoc.practiceModes : {};
  var sessionIds = Object.keys(sessions);
  var modeKeys = Object.keys(modes);
  var index = 0;

  while (index < modeKeys.length) {
    if (modes[modeKeys[index]] && modes[modeKeys[index]].completed === true) {
      count = count + 1;
    }
    index = index + 1;
  }

  index = 0;
  while (index < sessionIds.length) {
    count = count + readCompletedModeCount(sessions[sessionIds[index]] || {});
    index = index + 1;
  }

  return count;
}

function calculateProgressPercent(completedCount, totalCount) {
  if (!totalCount || totalCount < 1) {
    return completedCount > 0 ? 100 : 0;
  }

  return Math.max(0, Math.min(100, Math.round((completedCount / totalCount) * 100)));
}

function readNumber(value, fallback) {
  var numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function readLatestValue(currentValue, candidateValue) {
  if (!currentValue) {
    return candidateValue || null;
  }

  if (readMillis(candidateValue) > readMillis(currentValue)) {
    return candidateValue;
  }

  return currentValue;
}
function readTeacherOwnershipIds(context, profile, actor) {
  var ids = [];

  addText(ids, context ? context.profileUserId : "");
  addText(ids, context ? context.authUid : "");
  appendTextValues(ids, context ? context.teacherOwnershipIds : []);
  addText(ids, actor ? actor.id : "");
  addText(ids, actor ? actor.authUid : "");
  addText(ids, profile ? profile.profileUserId : "");
  addText(ids, profile ? profile.id : "");
  addText(ids, profile ? profile.authUid : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.id : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.profileUserId : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.authUid : "");

  return ids;
}

function readOwnedClassIds(classes, assignments) {
  var ids = [];
  var index = 0;

  while (index < classes.length) {
    addText(ids, classes[index].id);
    index = index + 1;
  }

  index = 0;
  while (index < assignments.length) {
    appendTextValues(ids, readAssignmentClassIds(assignments[index]));
    index = index + 1;
  }

  return ids;
}

function readOwnedCourseIds(assignments) {
  var ids = [];
  var index = 0;

  while (index < assignments.length) {
    addText(ids, assignments[index].courseId || "");
    index = index + 1;
  }

  return ids;
}

function readAssignmentClassIds(assignment) {
  if (!assignment) {
    return [];
  }

  var ids = readTextArray([
    assignment.classId,
    assignment.classIds,
    assignment.targetClassId,
    assignment.targetClassIds,
    assignment.assignedClassIds,
    assignment.classes,
    assignment.assignedClasses
  ]);

  if (assignment.targetType === "class") {
    addText(ids, assignment.targetId || "");
    appendTextValues(ids, assignment.targetIds || []);
  }

  return ids;
}

function readAssignmentStudentIds(assignment) {
  if (!assignment) {
    return [];
  }

  var ids = readTextArray([
    assignment.studentId,
    assignment.studentIds,
    assignment.targetStudentId,
    assignment.targetStudentIds,
    assignment.assignedStudentIds,
    assignment.students,
    assignment.assignedStudents
  ]);

  if (assignment.targetType === "student") {
    addText(ids, assignment.targetId || "");
    appendTextValues(ids, assignment.targetIds || []);
  }

  return ids;
}

function filterStudentsForCourseCard(students, courseCard) {
  var result = [];
  var index = 0;

  while (index < students.length) {
    var student = students[index];
    var matchesClass = (courseCard.classIds || []).some(function (classId) {
      return studentInClass(student, classId);
    });
    var matchesStudent = (courseCard.studentIds || []).indexOf(student.id) !== -1;

    if ((matchesClass || matchesStudent) && !findById(result, student.id)) {
      result.push(student);
    }

    index = index + 1;
  }

  return result.sort(compareByName);
}

function countPendingSubmissions(submissions) {
  return (submissions || []).filter(function (submission) {
    return (submission.reviewStatus || "pending") === "pending";
  }).length;
}
function readAssignmentClassId(assignment) {
  return readAssignmentClassIds(assignment)[0] || "";
}

function isVisibleCourseAssignment(assignment) {
  var status = assignment && assignment.status ? String(assignment.status).toLowerCase() : "active";
  return status !== "archived" && status !== "disabled" && status !== "deleted";
}

function compareAssignmentByTitle(a, b) {
  return readTitle(a.courseTitle || a.title || a.name, "").localeCompare(readTitle(b.courseTitle || b.title || b.name, ""));
}

function countSubmissionsByField(submissions, fieldName) {
  var counts = {};
  var index = 0;

  while (index < submissions.length) {
    if (submissions[index][fieldName]) {
      counts[submissions[index][fieldName]] = (counts[submissions[index][fieldName]] || 0) + 1;
    }
    index = index + 1;
  }

  return counts;
}

function countSubmissionsByAssignment(submissions) {
  var counts = {};
  var index = 0;

  while (index < submissions.length) {
    var assignmentId = submissions[index].assignmentId || submissions[index].courseAssignmentId || "";
    if (assignmentId) {
      counts[assignmentId] = (counts[assignmentId] || 0) + 1;
    }
    index = index + 1;
  }

  return counts;
}

function findById(records, id) {
  if (!id) {
    return null;
  }

  return (records || []).find(function (record) {
    return record && record.id === id;
  }) || null;
}

function resolveRequestedClassIds(payload, teacherClassIds) {
  var classId = payload && payload.classId ? payload.classId : "";

  if (classId && teacherClassIds.indexOf(classId) !== -1) {
    return [classId];
  }

  return teacherClassIds.slice();
}

function readTeacherRoles(profile) {
  return getUserRoles(profile);
}

function isAdminRoleList(roles) {
  return roles.indexOf("schoolAdmin") !== -1 || roles.indexOf("platformAdmin") !== -1 || roles.indexOf("superAdmin") !== -1;
}

function isStudentProfile(profile) {
  return isStudentUserProfile(profile);
}

function studentInClass(student, classId) {
  return userProfileInClass(student, classId);
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

function addText(ids, value) {
  var text = typeof value === "string" ? value.trim() : "";

  if (text && ids.indexOf(text) === -1) {
    ids.push(text);
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

function readText(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return String(value).trim();
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
    appendTextValues(result, value.studentId);
    appendTextValues(result, value.userId);
    appendTextValues(result, value.refId);
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

  if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/invalid-login-credentials") {
    return "Email or password is incorrect. Try again or reset your password.";
  }

  if (error.code === "auth/user-not-found") {
    return "No teacher login account was found for this email. Ask an admin to authorize teacher login.";
  }

  if (error.code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }

  if (error.code === "auth/too-many-requests") {
    return "Too many attempts. Wait a few minutes or reset your password.";
  }

  if (error.code === "auth/user-disabled") {
    return "This login account is disabled. Contact an admin.";
  }

  if (error.code === "auth/network-request-failed") {
    return "Network error. Check your connection and try again.";
  }

  return readErrorMessage(error);
}

function readPasswordResetErrorMessage(error) {
  if (!error) {
    return "Could not send reset email.";
  }

  if (error.code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }

  if (error.code === "auth/too-many-requests") {
    return "Too many attempts. Wait a few minutes before requesting another reset email.";
  }

  if (error.code === "auth/user-disabled") {
    return "This login account is disabled. Contact an admin.";
  }

  if (error.code === "auth/network-request-failed") {
    return "Network error. Check your connection and try again.";
  }

  return "Could not send reset email: " + readErrorMessage(error);
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}


