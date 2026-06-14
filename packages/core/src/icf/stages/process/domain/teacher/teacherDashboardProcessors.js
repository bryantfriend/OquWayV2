import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, db, doc, getDoc, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.178-teacher-analytics-dashboard";
import { auth } from "../../../../../infrastructure/firebase/auth.js?v=1.1.178-teacher-analytics-dashboard";
import { getClassesForTeacher } from "../../../../../../../domain/classes/index.js";
import { getExternalTaskSubmissionsForTeacher } from "../../../../../../../domain/externalTasks/index.js?v=1.1.178-teacher-analytics-dashboard";
import { getModulesForCourse, readModuleTitle as readDomainModuleTitle } from "../../../../../../../domain/modules/index.js";
import {
  getStudentsForClasses,
  getUserProfileByAuthUid,
  getUserRoles,
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
    var data = await buildTeacherClassListData(executionState);
    executionState.result = data;
    return { valid: true, data: data };
  } catch (error) {
    return createProcessError("TEACHER_DASHBOARD_LOAD_FAILED", "Could not load teacher dashboard: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherClasses(executionState) {
  try {
    var data = await buildTeacherClassListData(executionState);
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
    executionState.result = await buildTeacherCoursesData(executionState);
    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_COURSES_LOAD_FAILED", "Could not load teacher courses: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherClassDetail(executionState) {
  try {
    executionState.result = await buildTeacherClassDetailData(executionState);
    return { valid: true, data: executionState.result };
  } catch (error) {
    return createProcessError("TEACHER_CLASS_DETAIL_LOAD_FAILED", "Could not load teacher class detail: " + readErrorMessage(error));
  }
}

export async function processLoadTeacherCourseDetail(executionState) {
  try {
    var payload = executionState.payload || {};
    var scope = await loadTeacherOwnershipScope(executionState);
    var assignmentId = payload.assignmentId || payload.courseAssignmentId || "";
    var assignment = findById(scope.assignments, assignmentId);
    var classId = "";
    var classRecord = null;
    var students = [];
    var courseCards = [];
    var courseRecord = null;
    var modules = [];
    var studentProgressById = {};
    var studentCards = [];
    var moduleSummaries = [];
    var monitorSummary = {};

    if (!assignment && payload.courseId) {
      assignment = scope.assignments.find(function (item) {
        return item && item.courseId === payload.courseId;
      }) || null;
    }

    classId = assignment ? readAssignmentClassId(assignment) : "";
    classRecord = classId ? findById(scope.classes, classId) : null;

    if (assignment && classId) {
      try {
        students = await loadStudentsForClasses([classId]);
      } catch (error) {
        console.error("[teacher-course-detail:students-load-failed]", {
          courseId: payload.courseId || "",
          assignmentId: assignmentId,
          errorMessage: readErrorMessage(error)
        });
        students = [];
      }
    }

    if (assignment) {
      courseRecord = await loadCourseDetailRecord(assignment.courseId);
      modules = await loadCourseModulesForMonitor(assignment.courseId, courseRecord);
      studentProgressById = await loadCourseProgressForStudents(students, assignment.courseId, modules);
      studentCards = students.map(function (student) {
        return normalizeCourseMonitorStudent(student, studentProgressById[student.id] || createEmptyCourseMonitorProgress(assignment.courseId, modules), modules, classRecord);
      });
      moduleSummaries = buildCourseMonitorModuleSummaries(modules, studentCards);
      monitorSummary = createCourseMonitorSummary(studentCards, moduleSummaries);
      courseCards = await normalizeCourseAssignmentCards([assignment], classRecord ? [classRecord] : scope.classes, students, {});
    }

    executionState.result = {
      teacher: normalizeTeacherProfile(scope.profile),
      course: createCourseMonitorCourseRecord(courseCards.length > 0 ? courseCards[0] : null, courseRecord, monitorSummary),
      classRecord: classRecord ? normalizeClassCard(classRecord, students, [assignment], 0) : null,
      students: studentCards,
      modules: moduleSummaries,
      submissions: [],
      summary: monitorSummary,
      errors: assignment ? {} : {
        courseDetail: "The selected course assignment is no longer available for this teacher or is outside your assigned scope."
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

async function buildTeacherCoursesData(executionState) {
  var scope = await loadTeacherOwnershipScope(executionState);
  var courseCards = await normalizeCourseAssignmentCards(scope.assignments, scope.classes, [], {});

  return {
    teacher: normalizeTeacherProfile(scope.profile),
    courses: courseCards,
    summary: {
      classCount: scope.classes.length,
      courseCount: courseCards.length,
      studentCount: 0,
      pendingSubmissionsCount: 0
    }
  };
}

async function buildTeacherClassListData(executionState) {
  var scope = await loadTeacherClassScope(executionState);
  var classCards = scope.classes.map(function (classRecord) {
    return normalizeClassListCard(classRecord);
  });

  return {
    teacher: normalizeTeacherProfile(scope.profile),
    classes: classCards,
    courses: [],
    students: [],
    submissions: [],
    filters: {
      classIds: scope.classIds,
      courseIds: [],
      assignmentIds: []
    },
    summary: {
      classCount: classCards.length,
      courseCount: 0,
      studentCount: countStoredClassStudents(classCards),
      pendingSubmissionsCount: 0
    }
  };
}

async function buildTeacherClassDetailData(executionState) {
  var payload = executionState.payload || {};
  var requestedClassId = payload.classId || "";
  var scope = await loadTeacherClassScope(executionState);
  var classRecord = findById(scope.classes, requestedClassId);

  if (!requestedClassId || !classRecord) {
    console.warn("[teacher-dashboard:class-detail-missing]", {
      classId: requestedClassId,
      teacherId: scope.profile && scope.profile.id ? scope.profile.id : ""
    });

    return {
      teacher: normalizeTeacherProfile(scope.profile),
      classRecord: classRecord,
      students: [],
      courses: [],
      submissions: [],
      emotionalCheckIns: [],
      errors: requestedClassId ? {
        classInfo: "The selected class is no longer available for this teacher."
      } : {},
      summary: createClassDetailSummary([], [], [])
    };
  }

  var errors = {};
  var students = [];
  var assignments = [];
  var courseCards = [];

  try {
    students = await loadStudentsForClasses([requestedClassId]);
  } catch (error) {
    console.error("[teacher-class-detail:students-load-failed]", {
      classId: requestedClassId,
      errorMessage: readErrorMessage(error)
    });
    errors.students = readErrorMessage(error);
  }

  try {
    assignments = await loadCourseAssignmentsForClass(requestedClassId);
  } catch (error) {
    console.error("[teacher-class-detail:courses-load-failed]", {
      classId: requestedClassId,
      errorMessage: readErrorMessage(error)
    });
    errors.courses = readErrorMessage(error);
  }

  try {
    courseCards = await normalizeCourseAssignmentCards(assignments, [classRecord], students, {});
  } catch (error) {
    console.error("[teacher-class-detail:course-cards-load-failed]", {
      classId: requestedClassId,
      errorMessage: readErrorMessage(error)
    });
    errors.courses = readErrorMessage(error);
    courseCards = [];
  }

  var studentCards = students.map(function (student) {
    return normalizeStudentCard(student, null, 0);
  });

  return {
    teacher: normalizeTeacherProfile(scope.profile),
    classRecord: normalizeClassCard(classRecord, students, assignments, 0),
    students: studentCards,
    courses: courseCards,
    submissions: [],
    emotionalCheckIns: [],
    errors: errors,
    summary: createClassDetailSummary(studentCards, courseCards, [])
  };
}

async function buildTeacherDashboardData(executionState) {
  var scope = await loadTeacherOwnershipScope(executionState);
  var profile = scope.profile;
  var classes = scope.classes;
  var effectiveClassIds = scope.classIds;
  var students = await loadStudentsForClasses(effectiveClassIds);
  var progress = await loadProgressForStudents(students);
  var submissions = await loadScopedSubmissions({
    classIds: effectiveClassIds,
    assignmentIds: scope.assignmentIds,
    courseIds: scope.courseIds,
    teacherIds: scope.teacherIds,
    reviewStatus: (executionState.payload || {}).reviewStatus || "pending"
  });
  var pendingCountsByClass = countSubmissionsByField(submissions, "classId");
  var pendingCountsByStudent = countSubmissionsByField(submissions, "studentId");
  var pendingCountsByAssignment = countSubmissionsByAssignment(submissions);
  var classCards = classes.map(function (classRecord) {
    return normalizeClassCard(classRecord, students, scope.assignments, pendingCountsByClass[classRecord.id] || 0);
  });
  var courseCards = await normalizeCourseAssignmentCards(scope.assignments, classes, students, pendingCountsByAssignment);
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

async function loadTeacherClassScope(executionState) {
  var context = executionState.context || {};
  var profile = context.teacherProfile || null;
  var teacherIds = readTeacherOwnershipIds(context, profile, executionState.actor || {});
  var classes = await loadTeacherClassesByOwnership(teacherIds, readTeacherRoles(profile));
  var classIds = classes.map(function (classRecord) { return classRecord.id; });

  return {
    profile: profile,
    authUid: context.authUid || "",
    profileUserId: context.profileUserId || "",
    teacherIds: teacherIds,
    classes: classes,
    classIds: classIds
  };
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

async function loadCourseAssignmentsForClass(classId) {
  var assignments = [];

  if (!classId) {
    return assignments;
  }

  await appendClassAssignmentQuery(assignments, query(collection(db, "courseAssignments"), where("targetType", "==", "class"), where("targetId", "==", classId)), {
    classId: classId,
    queryShape: "courseAssignments where targetType == class and targetId == classId"
  });
  await appendClassAssignmentQuery(assignments, query(collection(db, "courseAssignments"), where("classId", "==", classId)), {
    classId: classId,
    queryShape: "courseAssignments where classId == classId"
  });

  return assignments.filter(isVisibleCourseAssignment).sort(compareAssignmentByTitle);
}

async function appendClassAssignmentQuery(assignments, assignmentsQuery, details) {
  try {
    var snapshot = await getDocs(assignmentsQuery);
    snapshot.forEach(function (assignmentSnap) {
      addUniqueRecord(assignments, Object.assign({
        id: assignmentSnap.id,
        ownershipRole: "Assigned"
      }, assignmentSnap.data() || {}));
    });
  } catch (error) {
    console.warn("[teacher-dashboard:class-courses-query-failed]", {
      classId: details && details.classId ? details.classId : "",
      queryShape: details && details.queryShape ? details.queryShape : "courseAssignments class query",
      errorMessage: readErrorMessage(error)
    });
  }
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

async function loadCourseDetailRecord(courseId) {
  var course = await readCourseDetailFromSource(courseId, "catalogCourses")
    || await readCourseDetailFromSource(courseId, "courses");

  return course || null;
}

async function readCourseDetailFromSource(courseId, source) {
  if (!courseId) {
    return null;
  }

  try {
    var courseSnap = await getDoc(doc(db, source, courseId));

    if (!courseSnap.exists()) {
      return null;
    }

    var data = courseSnap.data() || {};
    return Object.assign({ id: courseSnap.id, source: source }, data, {
      id: courseSnap.id,
      source: source,
      title: readTitle(data.title || data.name || data.displayName, "Untitled Course"),
      description: readTitle(data.description || data.summary || data.overview, ""),
      status: data.status || data.readinessStatus || data.publishedStatus || ""
    });
  } catch (error) {
    console.warn("[teacher-course-detail:course-load-failed]", {
      courseId: courseId,
      source: source,
      errorMessage: readErrorMessage(error)
    });
    return null;
  }
}

async function loadCourseModulesForMonitor(courseId, courseRecord) {
  var modules = [];
  var index = 0;

  try {
    modules = await getModulesForCourse(courseId, {
      course: courseRecord || {},
      sources: ["catalogCourses", "courses"]
    });
  } catch (error) {
    console.warn("[teacher-course-detail:modules-load-failed]", {
      courseId: courseId,
      errorMessage: readErrorMessage(error)
    });
    modules = [];
  }

  while (index < modules.length) {
    modules[index] = await attachMonitorSessionsToModule(courseId, modules[index]);
    index = index + 1;
  }

  return modules;
}

async function attachMonitorSessionsToModule(courseId, moduleRecord) {
  var sessions = [];
  var source = moduleRecord && moduleRecord.source ? moduleRecord.source : "catalogCourses";

  try {
    sessions = await readMonitorSessions(courseId, moduleRecord.id || moduleRecord.moduleId, source);
  } catch (error) {
    console.warn("[teacher-course-detail:sessions-load-failed]", {
      courseId: courseId,
      moduleId: moduleRecord && moduleRecord.id ? moduleRecord.id : "",
      source: source,
      errorMessage: readErrorMessage(error)
    });
    sessions = [];
  }

  if (sessions.length === 0 && source !== "catalogCourses") {
    sessions = await readMonitorSessions(courseId, moduleRecord.id || moduleRecord.moduleId, "catalogCourses");
  }

  if (sessions.length === 0 && source !== "courses") {
    sessions = await readMonitorSessions(courseId, moduleRecord.id || moduleRecord.moduleId, "courses");
  }

  if (sessions.length === 0) {
    sessions = createMonitorSessionsFromModule(moduleRecord);
  }

  return Object.assign({}, moduleRecord, {
    sessions: sessions,
    totalStepCount: countMonitorModuleSteps(Object.assign({}, moduleRecord, { sessions: sessions }))
  });
}

async function readMonitorSessions(courseId, moduleId, source) {
  var snapshot = null;
  var sessions = [];

  if (!courseId || !moduleId || !source) {
    return sessions;
  }

  snapshot = await getDocs(collection(db, source, courseId, "modules", moduleId, "sessions"));
  snapshot.forEach(function (sessionSnap) {
    sessions.push(Object.assign({ id: sessionSnap.id, source: source }, sessionSnap.data() || {}));
  });
  sessions.sort(compareMonitorOrder);

  return sessions;
}

function createMonitorSessionsFromModule(moduleRecord) {
  var learningModes = moduleRecord && moduleRecord.learningModes && typeof moduleRecord.learningModes === "object" ? moduleRecord.learningModes : {};
  var keys = Object.keys(learningModes);
  var sessions = [];
  var index = 0;

  while (index < keys.length) {
    sessions.push({
      id: learningModes[keys[index]].legacySessionId || keys[index],
      learningModeId: keys[index],
      learningModeType: learningModes[keys[index]].modeType || keys[index],
      order: readNumber(learningModes[keys[index]].order, index + 1),
      practiceModes: learningModes[keys[index]].practiceModes || {
        beforeClass: {
          steps: Array.isArray(learningModes[keys[index]].steps) ? learningModes[keys[index]].steps : []
        }
      }
    });
    index = index + 1;
  }

  sessions.sort(compareMonitorOrder);
  return sessions;
}

async function loadCourseProgressForStudents(students, courseId, modules) {
  var progressByStudent = {};
  var index = 0;

  while (index < students.length) {
    progressByStudent[students[index].id] = await readStudentCourseMonitorProgress(students[index].id, courseId, modules);
    index = index + 1;
  }

  return progressByStudent;
}

async function readStudentCourseMonitorProgress(studentId, courseId, modules) {
  var summary = createEmptyCourseMonitorProgress(courseId, modules);

  if (!studentId || !courseId) {
    return summary;
  }

  try {
    var snapshot = await getDocs(collection(db, "studentProgress", studentId, "courses", courseId, "sessions"));

    snapshot.forEach(function (progressSnap) {
      mergeSessionProgressIntoMonitor(summary, Object.assign({ id: progressSnap.id }, progressSnap.data() || {}), modules);
    });
  } catch (error) {
    console.warn("[teacher-course-detail:progress-load-failed]", {
      studentId: studentId,
      courseId: courseId,
      errorMessage: readErrorMessage(error)
    });
    summary.progressLoadError = readErrorMessage(error);
  }

  finalizeCourseMonitorProgress(summary, modules);
  return summary;
}

function createEmptyCourseMonitorProgress(courseId, modules) {
  return {
    courseId: courseId || "",
    completedModuleCount: 0,
    totalModuleCount: Array.isArray(modules) ? modules.length : 0,
    completedStepCount: 0,
    totalStepCount: countMonitorCourseSteps(modules),
    progressPercent: 0,
    currentModuleId: "",
    currentModuleTitle: "",
    currentStepId: "",
    currentStepTitle: "",
    lastActivityAt: null,
    timeOnTaskSeconds: 0,
    moduleProgressById: {},
    touchedModuleIds: [],
    completedStepIdsByModuleId: {},
    hasProgress: false,
    progressLoadError: ""
  };
}

function mergeSessionProgressIntoMonitor(summary, progress, modules) {
  var moduleId = progress.moduleId || findModuleIdForSession(modules, progress.sessionId || progress.id);
  var completedStepIds = readProgressCompletedStepIds(progress);
  var updatedAt = progress.updatedAt || readProgressLatestModeTimestamp(progress);
  var timeOnTaskSeconds = readProgressTimeOnTask(progress);

  if (!moduleId) {
    return;
  }

  summary.hasProgress = true;
  addUniqueText(summary.touchedModuleIds, moduleId);
  summary.timeOnTaskSeconds = summary.timeOnTaskSeconds + timeOnTaskSeconds;
  appendCompletedStepIdsForModule(summary.completedStepIdsByModuleId, moduleId, completedStepIds);

  if (!summary.moduleProgressById[moduleId]) {
    summary.moduleProgressById[moduleId] = {
      moduleId: moduleId,
      completedStepCount: 0,
      totalStepCount: countMonitorModuleSteps(findModuleById(modules, moduleId)),
      lastActivityAt: null,
      completed: false
    };
  }

  if (readMillis(updatedAt) >= readMillis(summary.moduleProgressById[moduleId].lastActivityAt)) {
    summary.moduleProgressById[moduleId].lastActivityAt = updatedAt;
  }

  if (readMillis(updatedAt) >= readMillis(summary.lastActivityAt)) {
    summary.lastActivityAt = updatedAt;
    summary.currentModuleId = moduleId;
    summary.currentStepId = findCurrentStepIdForProgress(findModuleById(modules, moduleId), progress, completedStepIds);
  }
}

function finalizeCourseMonitorProgress(summary, modules) {
  var moduleIds = Object.keys(summary.moduleProgressById);
  var completedStepTotal = 0;
  var completedModuleTotal = 0;
  var index = 0;

  while (index < moduleIds.length) {
    var moduleProgress = summary.moduleProgressById[moduleIds[index]];
    moduleProgress.completedStepCount = countUniqueText(summary.completedStepIdsByModuleId[moduleIds[index]] || []);
    moduleProgress.completed = moduleProgress.totalStepCount > 0
      ? moduleProgress.completedStepCount >= moduleProgress.totalStepCount
      : summary.touchedModuleIds.indexOf(moduleIds[index]) !== -1;
    completedStepTotal = completedStepTotal + moduleProgress.completedStepCount;
    if (moduleProgress.completed) {
      completedModuleTotal = completedModuleTotal + 1;
    }
    index = index + 1;
  }

  summary.completedStepCount = completedStepTotal;
  summary.completedModuleCount = completedModuleTotal;
  summary.progressPercent = summary.totalStepCount > 0 ? Math.min(100, Math.round((completedStepTotal / summary.totalStepCount) * 100)) : 0;
  summary.currentModuleTitle = readDomainModuleTitle(findModuleById(modules, summary.currentModuleId) || {});
  summary.currentStepTitle = readMonitorStepTitle(findStepById(findModuleById(modules, summary.currentModuleId), summary.currentStepId));
}

function normalizeCourseMonitorStudent(student, progress, modules, classRecord) {
  var base = normalizeStudentCard(student, {
    courseCount: progress.hasProgress ? 1 : 0,
    lastActiveAt: progress.lastActivityAt
  }, 0);
  var status = readCourseMonitorStatus(progress);

  return Object.assign({}, base, {
    classId: base.classId || (classRecord ? classRecord.id : ""),
    className: student.className || (classRecord ? readName(classRecord, "Class") : ""),
    courseStatus: status,
    courseStatusLabel: formatCourseMonitorStatus(status),
    engagementStatus: readEngagementStatus(progress.lastActivityAt),
    currentModuleId: progress.currentModuleId,
    currentModuleTitle: progress.currentModuleTitle || "Not started",
    currentStepId: progress.currentStepId,
    currentStepTitle: progress.currentStepTitle || "Not available",
    lastActivityAt: progress.lastActivityAt,
    moduleProgressCount: progress.completedModuleCount + "/" + progress.totalModuleCount,
    stepProgressCount: progress.completedStepCount + "/" + progress.totalStepCount,
    completedModuleCount: progress.completedModuleCount,
    totalModuleCount: progress.totalModuleCount,
    completedStepCount: progress.completedStepCount,
    totalStepCount: progress.totalStepCount,
    progressPercent: progress.progressPercent,
    timeOnTaskSeconds: progress.timeOnTaskSeconds,
    moduleProgressById: progress.moduleProgressById,
    progressLoadError: progress.progressLoadError || ""
  });
}

function buildCourseMonitorModuleSummaries(modules, students) {
  return (modules || []).map(function (moduleRecord, index) {
    var moduleId = moduleRecord.id || moduleRecord.moduleId || "";
    var startedStudents = [];
    var completedStudents = [];
    var progressTotal = 0;

    (students || []).forEach(function (student) {
      var moduleProgress = student.moduleProgressById ? student.moduleProgressById[moduleId] : null;
      var percent = moduleProgress && moduleProgress.totalStepCount > 0
        ? Math.round((moduleProgress.completedStepCount / moduleProgress.totalStepCount) * 100)
        : 0;

      if (moduleProgress) {
        startedStudents.push(createMonitorStudentReference(student, percent));
        progressTotal = progressTotal + percent;
      }

      if (moduleProgress && moduleProgress.completed) {
        completedStudents.push(createMonitorStudentReference(student, percent));
      }
    });

    return Object.assign({}, moduleRecord, {
      id: moduleId,
      order: readNumber(moduleRecord.order, index + 1),
      title: readDomainModuleTitle(moduleRecord),
      totalStepCount: countMonitorModuleSteps(moduleRecord),
      studentsStartedCount: startedStudents.length,
      studentsCompletedCount: completedStudents.length,
      averageCompletionPercent: startedStudents.length > 0 ? Math.round(progressTotal / startedStudents.length) : 0,
      activeStudents: startedStudents,
      completedStudents: completedStudents
    });
  });
}

function createMonitorStudentReference(student, progressPercent) {
  return {
    id: student.id || "",
    name: student.name || "Student",
    progressPercent: progressPercent || 0,
    engagementStatus: student.engagementStatus || "Inactive"
  };
}

function createCourseMonitorSummary(students, modules) {
  var activeNow = 0;
  var completedStudents = 0;
  var progressTotal = 0;

  (students || []).forEach(function (student) {
    if (student.engagementStatus === "Active Now") {
      activeNow = activeNow + 1;
    }
    if (student.courseStatus === "completed") {
      completedStudents = completedStudents + 1;
    }
    progressTotal = progressTotal + (Number(student.progressPercent) || 0);
  });

  return {
    totalStudents: students ? students.length : 0,
    activeNow: activeNow,
    totalModules: modules ? modules.length : 0,
    completedStudents: completedStudents,
    averageCompletionPercent: students && students.length > 0 ? Math.round(progressTotal / students.length) : 0
  };
}

function createCourseMonitorCourseRecord(courseCard, courseRecord, summary) {
  if (!courseCard && !courseRecord) {
    return null;
  }

  return Object.assign({}, courseCard || {}, {
    courseId: (courseCard && courseCard.courseId) || (courseRecord && courseRecord.id) || "",
    courseTitle: (courseCard && courseCard.courseTitle) || (courseRecord && courseRecord.title) || "Untitled Course",
    title: (courseRecord && courseRecord.title) || (courseCard && courseCard.courseTitle) || "Untitled Course",
    description: courseRecord && courseRecord.description ? courseRecord.description : "",
    status: (courseCard && courseCard.status) || (courseRecord && courseRecord.status) || "",
    courseRecordSource: courseRecord && courseRecord.source ? courseRecord.source : "",
    progressPercent: summary && typeof summary.averageCompletionPercent === "number" ? summary.averageCompletionPercent : null,
    moduleCount: summary && typeof summary.totalModules === "number" ? summary.totalModules : 0,
    studentCount: summary && typeof summary.totalStudents === "number" ? summary.totalStudents : (courseCard ? courseCard.studentCount : 0)
  });
}

function readCourseMonitorStatus(progress) {
  if (!progress || !progress.hasProgress) {
    return "notStarted";
  }

  if (progress.totalStepCount > 0 && progress.completedStepCount >= progress.totalStepCount) {
    return "completed";
  }

  if (readEngagementStatus(progress.lastActivityAt) === "Active Now") {
    return "active";
  }

  return "inProgress";
}

function formatCourseMonitorStatus(status) {
  if (status === "active") return "Active";
  if (status === "inProgress") return "In Progress";
  if (status === "completed") return "Completed";
  return "Not Started";
}

function readEngagementStatus(lastActivityAt) {
  var millis = readMillis(lastActivityAt);
  var age = Date.now() - millis;

  if (!millis) {
    return "Inactive";
  }

  if (age <= 2 * 60 * 1000) {
    return "Active Now";
  }

  if (age <= 30 * 60 * 1000) {
    return "Recently Active";
  }

  return "Inactive";
}

function readProgressCompletedStepIds(progress) {
  var ids = [];
  var practiceModes = progress && progress.practiceModes && typeof progress.practiceModes === "object" ? progress.practiceModes : {};

  Object.keys(practiceModes).forEach(function (key) {
    appendTextValues(ids, practiceModes[key] && Array.isArray(practiceModes[key].completedStepIds) ? practiceModes[key].completedStepIds : []);
  });

  return ids;
}

function readProgressLatestModeTimestamp(progress) {
  var latest = progress ? progress.updatedAt : null;
  var practiceModes = progress && progress.practiceModes && typeof progress.practiceModes === "object" ? progress.practiceModes : {};

  Object.keys(practiceModes).forEach(function (key) {
    if (practiceModes[key] && readMillis(practiceModes[key].updatedAt) > readMillis(latest)) {
      latest = practiceModes[key].updatedAt;
    }
  });

  return latest;
}

function readProgressTimeOnTask(progress) {
  var total = readNumber(progress ? (progress.timeOnTaskSeconds || progress.totalTimeSeconds || progress.durationSeconds) : 0, 0);
  var practiceModes = progress && progress.practiceModes && typeof progress.practiceModes === "object" ? progress.practiceModes : {};

  Object.keys(practiceModes).forEach(function (key) {
    total = total + readNumber(practiceModes[key] ? (practiceModes[key].timeOnTaskSeconds || practiceModes[key].totalTimeSeconds || practiceModes[key].durationSeconds) : 0, 0);
  });

  return total;
}

function appendCompletedStepIdsForModule(completedStepIdsByModuleId, moduleId, stepIds) {
  if (!completedStepIdsByModuleId[moduleId]) {
    completedStepIdsByModuleId[moduleId] = [];
  }

  appendTextValues(completedStepIdsByModuleId[moduleId], stepIds);
}

function findCurrentStepIdForProgress(moduleRecord, progress, completedStepIds) {
  var session = findSessionById(moduleRecord, progress.sessionId || progress.id);
  var orderedSteps = flattenMonitorSessionSteps(session);
  var index = 0;

  while (index < orderedSteps.length) {
    if (completedStepIds.indexOf(orderedSteps[index].id || orderedSteps[index].stepId || "") === -1) {
      return orderedSteps[index].id || orderedSteps[index].stepId || "";
    }
    index = index + 1;
  }

  return orderedSteps.length > 0 ? (orderedSteps[orderedSteps.length - 1].id || orderedSteps[orderedSteps.length - 1].stepId || "") : "";
}

function findModuleIdForSession(modules, sessionId) {
  var index = 0;

  while (Array.isArray(modules) && index < modules.length) {
    if (findSessionById(modules[index], sessionId)) {
      return modules[index].id || modules[index].moduleId || "";
    }
    index = index + 1;
  }

  return "";
}

function findModuleById(modules, moduleId) {
  return (modules || []).find(function (moduleRecord) {
    return moduleRecord && (moduleRecord.id === moduleId || moduleRecord.moduleId === moduleId);
  }) || null;
}

function findSessionById(moduleRecord, sessionId) {
  var sessions = moduleRecord && Array.isArray(moduleRecord.sessions) ? moduleRecord.sessions : [];

  return sessions.find(function (session) {
    return session && (session.id === sessionId || session.sessionId === sessionId || session.learningModeId === sessionId);
  }) || null;
}

function findStepById(moduleRecord, stepId) {
  var sessions = moduleRecord && Array.isArray(moduleRecord.sessions) ? moduleRecord.sessions : [];
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    var steps = flattenMonitorSessionSteps(sessions[sessionIndex]);
    var step = steps.find(function (item) {
      return item && (item.id === stepId || item.stepId === stepId);
    });

    if (step) {
      return step;
    }

    sessionIndex = sessionIndex + 1;
  }

  return null;
}

function readMonitorStepTitle(step) {
  if (!step) {
    return "";
  }

  return readTitle(step.title || step.name || step.label, "Step");
}

function countMonitorCourseSteps(modules) {
  var total = 0;

  (modules || []).forEach(function (moduleRecord) {
    total = total + countMonitorModuleSteps(moduleRecord);
  });

  return total;
}

function countMonitorModuleSteps(moduleRecord) {
  var sessions = moduleRecord && Array.isArray(moduleRecord.sessions) ? moduleRecord.sessions : [];
  var total = 0;

  sessions.forEach(function (session) {
    total = total + flattenMonitorSessionSteps(session).length;
  });

  return total;
}

function flattenMonitorSessionSteps(session) {
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  var steps = [];

  Object.keys(practiceModes).forEach(function (key) {
    var modeSteps = practiceModes[key] && Array.isArray(practiceModes[key].steps) ? practiceModes[key].steps.slice() : [];
    modeSteps.sort(compareMonitorOrder);
    steps = steps.concat(modeSteps);
  });

  return steps;
}

function compareMonitorOrder(first, second) {
  return readNumber(first && first.order, readNumber(first && first.sessionNumber, 0)) - readNumber(second && second.order, readNumber(second && second.sessionNumber, 0));
}

function readNumber(value, fallback) {
  var numeric = Number(value);

  return Number.isFinite(numeric) ? numeric : (fallback || 0);
}

function addUniqueText(result, value) {
  if (typeof value === "string" && value && result.indexOf(value) === -1) {
    result.push(value);
  }
}

function countUniqueText(values) {
  var unique = [];

  appendTextValues(unique, values || []);
  return unique.length;
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
    ownershipRole: classRecord.ownershipRole || "Assigned",
    source: classRecord.source || "classes"
  };
}

function normalizeClassListCard(classRecord) {
  return {
    id: classRecord.id,
    name: readName(classRecord, "Class " + classRecord.id),
    locationId: readClassLocationId(classRecord),
    locationName: classRecord.locationName || classRecord.schoolName || classRecord.locationId || "Assigned location",
    studentCount: readStoredCount(classRecord, ["studentCount", "studentsCount", "studentTotal"], classRecord.studentIds),
    assignedCoursesCount: readStoredCount(classRecord, ["assignedCoursesCount", "courseCount", "coursesCount"], classRecord.assignedCourseIds),
    pendingSubmissionsCount: readStoredCount(classRecord, ["pendingSubmissionsCount", "pendingReviewCount"], []),
    ownershipRole: classRecord.ownershipRole || "Assigned",
    source: classRecord.source || "classes"
  };
}

async function normalizeCourseAssignmentCards(assignments, classes, students, pendingCountsByAssignment) {
  var courseCache = {};
  var cards = [];
  var index = 0;

  while (index < assignments.length) {
    var assignment = assignments[index];
    var course = await loadCourseSummary(assignment.courseId, courseCache);
    var targetClassId = readAssignmentClassId(assignment);
    var targetClass = findById(classes, targetClassId);
    var targetStudents = targetClassId
      ? students.filter(function (student) { return studentInClass(student, targetClassId); })
      : [];

    cards.push({
      id: assignment.id,
      assignmentId: assignment.id,
      courseId: assignment.courseId || "",
      courseTitle: assignment.courseTitle || (course ? course.title : "Untitled Course"),
      targetType: assignment.targetType || (targetClassId ? "class" : ""),
      targetId: assignment.targetId || targetClassId,
      classId: targetClassId,
      targetName: assignment.targetName || assignment.className || (targetClass ? targetClass.name : targetClassId || "Assigned target"),
      ownershipRole: assignment.ownershipRole || "Assigned",
      studentCount: targetStudents.length,
      pendingSubmissionsCount: pendingCountsByAssignment[assignment.id] || 0,
      status: assignment.status || "active"
    });
    index = index + 1;
  }

  return cards.sort(function (a, b) {
    return (a.courseTitle || "").localeCompare(b.courseTitle || "");
  });
}

function normalizeStudentCard(student, progress, pendingCount) {
  return Object.assign({}, student, {
    id: student.id,
    name: readName(student, "Student " + student.id),
    photoUrl: student.photoUrl || student.avatarUrl || "",
    classId: student.classId || firstArrayValue(student.classIds) || firstArrayValue(student.assignedClassIds),
    classIds: readTextArray([student.classId, student.classIds, student.assignedClassIds]),
    lastActiveAt: progress ? progress.lastActiveAt : null,
    currentCourseProgress: progress && progress.courseCount > 0 ? progress.courseCount + " course(s) active" : "No progress yet",
    pendingSubmissionsCount: pendingCount,
    status: pendingCount > 0 ? "needsReview" : "steady"
  });
}

function createClassDetailSummary(students, courses, emotionalCheckIns) {
  return {
    studentCount: students.length,
    courseCount: courses.length,
    emotionalCheckInCount: emotionalCheckIns.length
  };
}

function countStoredClassStudents(classCards) {
  var total = 0;
  var index = 0;

  while (index < classCards.length) {
    total = total + (Number(classCards[index].studentCount) || 0);
    index = index + 1;
  }

  return total;
}

function readStoredCount(record, fieldNames, fallbackArray) {
  var index = 0;

  while (record && index < fieldNames.length) {
    if (typeof record[fieldNames[index]] === "number" && Number.isFinite(record[fieldNames[index]])) {
      return record[fieldNames[index]];
    }

    if (typeof record[fieldNames[index]] === "string" && record[fieldNames[index]].trim() && Number.isFinite(Number(record[fieldNames[index]]))) {
      return Number(record[fieldNames[index]]);
    }

    index = index + 1;
  }

  return Array.isArray(fallbackArray) ? fallbackArray.length : 0;
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
    addText(ids, readAssignmentClassId(assignments[index]));
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

function readAssignmentClassId(assignment) {
  if (!assignment) {
    return "";
  }

  if (assignment.targetType === "class" && assignment.targetId) {
    return assignment.targetId;
  }

  return assignment.classId || assignment.targetClassId || "";
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


