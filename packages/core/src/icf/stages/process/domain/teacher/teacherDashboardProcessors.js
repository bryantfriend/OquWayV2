import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, db, doc, getDoc, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { auth } from "../../../../../infrastructure/firebase/auth.js?v=1.1.82-shared-command-center-shell";
import { getClassesForTeacher } from "../../../../../../../domain/classes/index.js";
import { getExternalTaskSubmissionsForTeacher } from "../../../../../../../domain/externalTasks/index.js?v=1.1.82-shared-command-center-shell";
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
    executionState.result = {
      teacher: data.teacher,
      classRecord: findById(data.classes, requestedClassId),
      students: data.students.filter(function (student) {
        return !requestedClassId || studentInClass(student, requestedClassId);
      }),
      submissions: data.submissions.filter(function (submission) {
        return !requestedClassId || submission.classId === requestedClassId;
      })
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

    executionState.result = {
      teacher: data.teacher,
      course: courseCard,
      submissions: data.submissions.filter(function (submission) {
        return !courseCard
          || submission.courseAssignmentId === courseCard.id
          || submission.assignmentId === courseCard.id
          || submission.courseId === courseCard.courseId;
      })
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


