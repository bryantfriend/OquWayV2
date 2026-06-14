import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.194-lesson-monitor";
import {
  createStudentAnalyticsDetail,
  createTeacherAnalyticsSnapshot,
  sortStudentAnalyticsRows
} from "./ui/services/analyticsService.js?v=1.1.179-teacher-analytics-dashboard";
import { teacherDashboardService } from "./ui/services/teacherDashboardService.js?v=1.1.194-lesson-monitor";
import {
  createEmptyState,
  createLoadingState,
  createStatusBadge
} from "../../../packages/ui/index.js?v=1.1.194-lesson-monitor";

var app = document.getElementById("app");
var state = {
  authReady: false,
  isLoading: true,
  isLoggingIn: false,
  isResetting: false,
  isReviewing: "",
  currentTeacher: null,
  teacher: null,
  classes: [],
  allStudents: [],
  studentsByClassId: {},
  courses: [],
  allCourses: [],
  coursesByClassId: {},
  students: [],
  submissions: [],
  summary: null,
  classDetailCache: {},
  classDetailsById: {},
  courseDetailCache: {},
  courseDetailsById: {},
  studentDetailCache: {},
  unsubscribeHandlers: [],
  isClassDetailLoading: false,
  isCourseListLoading: false,
  isCourseDetailLoading: false,
  selectedTab: "overview",
  selectedClassId: "",
  selectedCourseId: "",
  selectedStudentId: "",
  activeTab: "overview",
  studentClassFilterId: "",
  studentStatusFilter: "all",
  courseClassFilterId: "",
  analyticsTab: "overview",
  analyticsRange: "week",
  analyticsStudentSort: "highestXp",
  selectedAnalyticsStudentId: "",
  reviewClassId: "",
  reviewCourseId: "",
  reviewModuleId: "",
  statusFilter: "pending",
  reviewStudentSearch: "",
  isReviewQueueLoading: false,
  reviewQueueError: "",
  message: "",
  error: "",
  unauthorized: false
};

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);

if (app) {
  app.addEventListener("submit", handleSubmit);
  app.addEventListener("click", handleClick);
  app.addEventListener("change", handleChange);
  app.addEventListener("input", handleInput);
}

teacherDashboardService.onAuthStateChanged(function (user) {
  handleAuthState(user);
});

async function handleAuthState(user) {
  console.info("[teacher-auth] auth state", {
    uid: user && user.uid ? user.uid : ""
  });

  if (!user) {
    setState({
      authReady: true,
      isLoading: false,
      isLoggingIn: false,
      isResetting: false,
      currentTeacher: null,
      teacher: null,
      classes: [],
      allStudents: [],
      studentsByClassId: {},
      allCourses: [],
      coursesByClassId: {},
      courses: [],
      students: [],
      submissions: [],
      summary: null,
      classDetailCache: {},
      classDetailsById: {},
      courseDetailCache: {},
      courseDetailsById: {},
      studentDetailCache: {},
      unsubscribeHandlers: [],
      isClassDetailLoading: false,
      isCourseListLoading: false,
      isCourseDetailLoading: false,
      selectedTab: "overview",
      selectedClassId: "",
      selectedCourseId: "",
      selectedStudentId: "",
      selectedAnalyticsStudentId: "",
      analyticsTab: "overview",
      analyticsRange: "week",
      analyticsStudentSort: "highestXp",
      activeTab: "overview",
      unauthorized: false,
      message: readLoginMessage(),
      error: ""
    });
    return;
  }

  await loadDashboard();
}

async function loadDashboard() {
  setState({
    authReady: true,
    isLoading: true,
    unauthorized: false,
    error: "",
    message: "Loading classroom command center..."
  });

  try {
    var data = await teacherDashboardService.loadDashboard({
      reviewStatus: readReviewStatusForQuery() || "pending"
    });

    setState({
      isLoading: false,
      isLoggingIn: false,
      currentTeacher: data.teacher,
      teacher: data.teacher,
      classes: data.classes || [],
      allStudents: data.students || [],
      studentsByClassId: buildStudentsByClassId(data.students || []),
      courses: data.courses || [],
      allCourses: data.courses || [],
      coursesByClassId: buildCoursesByClassId(data.courses || []),
      students: data.students || [],
      submissions: data.submissions || [],
      summary: data.summary || null,
      isClassDetailLoading: false,
      isCourseListLoading: false,
      message: "",
      error: "",
      unauthorized: false
    });
  } catch (error) {
    setState({
      isLoading: false,
      unauthorized: isUnauthorizedError(error),
      teacher: null,
      classes: [],
      allStudents: [],
      studentsByClassId: {},
      allCourses: [],
      coursesByClassId: {},
      courses: [],
      students: [],
      submissions: [],
      summary: null,
      classDetailCache: {},
      classDetailsById: {},
      courseDetailCache: {},
      courseDetailsById: {},
      studentDetailCache: {},
      isClassDetailLoading: false,
      isCourseListLoading: false,
      isCourseDetailLoading: false,
      error: error.message,
      message: ""
    });
  }
}

async function loadCourses() {
  if (state.isCourseListLoading || (state.courses || []).length > 0) {
    return;
  }

  setState({
    isCourseListLoading: true,
    message: "Loading courses...",
    error: ""
  });

  try {
    var data = await teacherDashboardService.loadCourses({});
    setState({
      isCourseListLoading: false,
      courses: data.courses || [],
      allCourses: data.courses || [],
      coursesByClassId: buildCoursesByClassId(data.courses || []),
      summary: Object.assign({}, state.summary || {}, data.summary || {}),
      message: "",
      error: ""
    });
  } catch (error) {
    console.warn("[teacher-dashboard:courses-load-failed]", {
      errorMessage: error.message
    });

    setState({
      isCourseListLoading: false,
      message: "",
      error: "Courses could not be loaded. Try Refresh."
    });
  }
}

async function loadClassDetail(classId, forceRefresh) {
  if (!classId) {
    console.error("Cannot open class view: missing classId");
    return;
  }

  if (!forceRefresh && state.classDetailsById[classId]) {
    setState({
      isClassDetailLoading: false,
      message: "",
      error: ""
    });
    return;
  }

  setState({
    isClassDetailLoading: true,
    message: "Loading class command center...",
    error: ""
  });

  try {
    var data = await teacherDashboardService.loadClassDetail(classId);
    var nextDetails = Object.assign({}, state.classDetailsById);
    nextDetails[classId] = data || {};

    setState({
      classDetailsById: nextDetails,
      classDetailCache: nextDetails,
      studentsByClassId: Object.assign({}, state.studentsByClassId || {}, createSingleClassRecord(classId, data && data.students ? data.students : [])),
      coursesByClassId: Object.assign({}, state.coursesByClassId || {}, createSingleClassRecord(classId, data && data.courses ? data.courses : [])),
      isClassDetailLoading: false,
      message: "",
      error: ""
    });
  } catch (error) {
    var fallbackDetails = Object.assign({}, state.classDetailsById);
    fallbackDetails[classId] = createClassDetailFallback(classId, error);

    console.error("[teacher-class-view:load-failed]", {
      classId: classId,
      errorMessage: error.message
    });

    setState({
      classDetailsById: fallbackDetails,
      classDetailCache: fallbackDetails,
      studentsByClassId: Object.assign({}, state.studentsByClassId || {}, createSingleClassRecord(classId, fallbackDetails[classId].students || [])),
      coursesByClassId: Object.assign({}, state.coursesByClassId || {}, createSingleClassRecord(classId, fallbackDetails[classId].courses || [])),
      selectedClassId: classId,
      isClassDetailLoading: false,
      message: "",
      error: ""
    });
  }
}

function createClassDetailFallback(classId, error) {
  var classRecord = (state.classes || []).find(function (item) {
    return item && item.id === classId;
  }) || null;
  var students = classId ? filterStudentsForClass(state.students || [], classId) : [];
  var courses = classId ? filterCoursesForClass(state.courses || [], classId) : [];

  return {
    classRecord: classRecord,
    students: students,
    courses: courses,
    submissions: [],
    emotionalCheckIns: [],
    errors: {
      classDetail: readErrorMessage(error)
    },
    summary: {
      studentCount: students.length,
      courseCount: courses.length,
      emotionalCheckInCount: 0
    }
  };
}

async function loadCourseDetail(assignmentId, courseId, forceRefresh) {
  var cacheKey = assignmentId || courseId || "";

  if (!cacheKey) {
    console.error("Cannot open course detail: missing course identifier");
    return;
  }

  if (!forceRefresh && state.courseDetailsById[cacheKey]) {
    setState({
      isCourseDetailLoading: false,
      message: "",
      error: ""
    });
    return;
  }

  setState({
    isCourseDetailLoading: true,
    message: "Loading course detail...",
    error: ""
  });

  try {
    var data = await teacherDashboardService.loadCourseDetail(assignmentId, courseId);
    var nextDetails = Object.assign({}, state.courseDetailsById);
    nextDetails[cacheKey] = data || {};

    setState({
      courseDetailsById: nextDetails,
      courseDetailCache: nextDetails,
      isCourseDetailLoading: false,
      message: "",
      error: ""
    });
  } catch (error) {
    var fallbackDetails = Object.assign({}, state.courseDetailsById);
    fallbackDetails[cacheKey] = createCourseDetailFallback(assignmentId, courseId, error);

    console.error("[teacher-course-view:load-failed]", {
      assignmentId: assignmentId || "",
      courseId: courseId || "",
      errorMessage: error.message
    });

    setState({
      courseDetailsById: fallbackDetails,
      courseDetailCache: fallbackDetails,
      isCourseDetailLoading: false,
      message: "",
      error: ""
    });
  }
}

function createCourseDetailFallback(assignmentId, courseId, error) {
  var course = findCourseByAssignmentOrCourseId(assignmentId, courseId);

  return {
    course: course,
    modules: [],
    students: course ? readStudentsForCourse(course) : [],
    submissions: [],
    errors: {
      courseDetail: readErrorMessage(error)
    }
  };
}

async function refreshReviewQueue() {
  setState({
    isReviewQueueLoading: true,
    message: "Loading submissions...",
    error: ""
  });

  try {
    var data = await teacherDashboardService.loadReviewQueue({
      reviewStatus: readReviewStatusForQuery(),
      classId: state.reviewClassId,
      courseId: state.reviewCourseId,
      moduleId: state.reviewModuleId,
      studentSearch: state.reviewStudentSearch
    });

    setState({
      isReviewQueueLoading: false,
      submissions: data.submissions || [],
      reviewQueueError: "",
      message: "",
      error: ""
    });
  } catch (error) {
    console.warn("[teacher-review-queue:load-failed]", {
      errorMessage: error.message
    });

    setState({
      isReviewQueueLoading: false,
      reviewQueueError: error.message,
      submissions: [],
      error: "",
      message: ""
    });
  }
}

async function handleSubmit(event) {
  var loginForm = event.target.closest("#teacherLoginForm");
  var resetForm = event.target.closest("#teacherResetForm");

  if (!loginForm && !resetForm) {
    return;
  }

  event.preventDefault();

  if (loginForm) {
    await loginTeacher(loginForm);
    return;
  }

  await sendPasswordReset(resetForm);
}

async function loginTeacher(form) {
  var email = form.querySelector("[name=email]").value;
  var password = form.querySelector("[name=password]").value;

  setState({
    isLoggingIn: true,
    error: "",
    message: "Signing in..."
  });

  try {
    await teacherDashboardService.login(email, password);
    await loadDashboard();
  } catch (error) {
    setState({
      isLoggingIn: false,
      error: error.message,
      message: ""
    });
  }
}

async function sendPasswordReset(form) {
  var resetInput = form.querySelector("[name=resetEmail]");
  var loginEmailInput = document.querySelector("#teacherLoginForm [name=email]");
  var email = (resetInput && resetInput.value ? resetInput.value : "") || (loginEmailInput && loginEmailInput.value ? loginEmailInput.value : "");

  if (!email) {
    setState({
      isResetting: false,
      error: "Enter your teacher email first.",
      message: ""
    });
    return;
  }

  setState({
    isResetting: true,
    error: "",
    message: "Sending reset email..."
  });

  try {
    await teacherDashboardService.sendPasswordReset(email);
    setState({
      isResetting: false,
      message: "If this teacher account exists, a reset email has been sent.",
      error: ""
    });
  } catch (error) {
    setState({
      isResetting: false,
      error: error.message,
      message: ""
    });
  }
}

async function handleClick(event) {
  var logoutButton = event.target.closest("[data-action=logout]");
  var refreshButton = event.target.closest("[data-action=refresh]");
  var overviewButton = event.target.closest("[data-overview-target]");
  var backToClassesButton = event.target.closest("[data-action=back-to-classes]");
  var backToCoursesButton = event.target.closest("[data-action=back-to-courses]");
  var studentProfileButton = event.target.closest("[data-action=open-student-profile]");
  var closeStudentProfileButton = event.target.closest("[data-action=close-student-profile]");
  var studentHistoryButton = event.target.closest("[data-action=view-student-history]");
  var analyticsTabButton = event.target.closest("[data-analytics-tab]");
  var analyticsStudentButton = event.target.closest("[data-analytics-student-id]");
  var closeAnalyticsStudentButton = event.target.closest("[data-action=close-analytics-student]");
  var classButton = event.target.closest("[data-class-id]");
  var courseButton = event.target.closest("[data-course-assignment-id]");
  var tabButton = event.target.closest("[data-teacher-tab]");
  var reviewButton = event.target.closest("[data-review-status]");

  if (logoutButton) {
    await teacherDashboardService.logout();
    return;
  }

  if (refreshButton) {
    var refreshClassId = state.selectedClassId;
    var refreshTab = state.activeTab;
    setState({
      classDetailsById: {},
      courses: [],
      selectedStudentId: "",
      selectedAnalyticsStudentId: ""
    });
    await loadDashboard();
    if (refreshClassId) {
      await loadClassDetail(refreshClassId, true);
    }
    if (refreshTab === "courses") {
      await loadCourses();
    }
    return;
  }

  if (overviewButton) {
    await openOverviewTarget(overviewButton);
    return;
  }

  if (backToClassesButton) {
    setState({
      selectedClassId: "",
      selectedStudentId: "",
      activeTab: "classes"
    });
    return;
  }

  if (backToCoursesButton) {
    setState({
      selectedCourseId: "",
      activeTab: "courses",
      selectedTab: "courses"
    });
    return;
  }

  if (closeStudentProfileButton || event.target.hasAttribute("data-student-profile-backdrop")) {
    setState({
      selectedStudentId: ""
    });
    return;
  }

  if (studentProfileButton) {
    setState({
      selectedStudentId: studentProfileButton.getAttribute("data-student-id") || ""
    });
    return;
  }

  if (studentHistoryButton) {
    setState({
      activeTab: "reviews",
      statusFilter: "all",
      reviewClassId: "",
      reviewCourseId: "",
      reviewModuleId: "",
      reviewStudentSearch: studentHistoryButton.getAttribute("data-student-name") || studentHistoryButton.getAttribute("data-student-id") || ""
    });
    await refreshReviewQueue();
    return;
  }

  if (analyticsTabButton) {
    setState({
      analyticsTab: analyticsTabButton.getAttribute("data-analytics-tab") || "overview",
      selectedAnalyticsStudentId: ""
    });
    return;
  }

  if (closeAnalyticsStudentButton) {
    setState({
      selectedAnalyticsStudentId: ""
    });
    return;
  }

  if (analyticsStudentButton) {
    setState({
      analyticsTab: "student-detail",
      selectedAnalyticsStudentId: analyticsStudentButton.getAttribute("data-analytics-student-id") || ""
    });
    return;
  }

  if (tabButton) {
    var nextTab = tabButton.getAttribute("data-teacher-tab") || "classes";
    setState({
      activeTab: nextTab,
      selectedTab: nextTab,
      selectedClassId: nextTab === "classes" ? state.selectedClassId : "",
      selectedCourseId: nextTab === "courses" ? state.selectedCourseId : "",
      selectedStudentId: "",
      selectedAnalyticsStudentId: nextTab === "analytics" ? state.selectedAnalyticsStudentId : ""
    });
    if (nextTab === "courses") {
      await loadCourses();
    }
    if (nextTab === "reviews") {
      await refreshReviewQueue();
    }
    return;
  }

  if (classButton) {
    var classId = classButton.getAttribute("data-class-id") || "";
    if (!classId) {
      setState({
        selectedClassId: "",
        selectedStudentId: "",
        activeTab: "classes"
      });
      return;
    }

    setState({
      selectedClassId: classId,
      selectedStudentId: "",
      activeTab: "classes"
    });
    await loadClassDetail(classId, false);
    return;
  }

  if (courseButton) {
    var assignmentId = courseButton.getAttribute("data-course-assignment-id") || "";
    var courseId = courseButton.getAttribute("data-course-id") || "";
    setState({
      selectedCourseId: assignmentId || courseId,
      selectedStudentId: "",
      activeTab: "courses",
      selectedTab: "courses"
    });
    await loadCourseDetail(assignmentId, courseId, false);
    return;
  }

  if (reviewButton) {
    await reviewSubmission(reviewButton);
  }
}

async function handleChange(event) {
  var studentClassFilter = event.target.closest("#studentClassFilter");
  var studentStatusFilter = event.target.closest("#studentStatusFilter");
  var courseClassFilter = event.target.closest("#courseClassFilter");
  var analyticsRange = event.target.closest("#analyticsRangeFilter");
  var analyticsStudentSort = event.target.closest("#analyticsStudentSort");
  var statusSelect = event.target.closest("#reviewStatusFilter");
  var classSelect = event.target.closest("#reviewClassFilter");
  var courseSelect = event.target.closest("#reviewCourseFilter");
  var moduleSelect = event.target.closest("#reviewModuleFilter");

  if (!studentClassFilter && !studentStatusFilter && !courseClassFilter && !analyticsRange && !analyticsStudentSort && !statusSelect && !classSelect && !courseSelect && !moduleSelect) {
    return;
  }

  if (studentClassFilter) {
    var nextStudentClassId = studentClassFilter.value || "";
    setState({
      studentClassFilterId: nextStudentClassId
    });
    if (nextStudentClassId) {
      await loadClassDetail(nextStudentClassId, false);
    }
    return;
  }

  if (studentStatusFilter) {
    setState({
      studentStatusFilter: studentStatusFilter.value || "all"
    });
    return;
  }

  if (courseClassFilter) {
    var nextCourseClassId = courseClassFilter.value || "";
    setState({
      courseClassFilterId: nextCourseClassId
    });
    if (nextCourseClassId) {
      await loadClassDetail(nextCourseClassId, false);
    }
    return;
  }

  if (analyticsRange) {
    setState({
      analyticsRange: analyticsRange.value || "week"
    });
    return;
  }

  if (analyticsStudentSort) {
    setState({
      analyticsStudentSort: analyticsStudentSort.value || "highestXp"
    });
    return;
  }

  if (statusSelect) {
    setState({
      statusFilter: statusSelect.value || "pending"
    });
    await refreshReviewQueue();
    return;
  }

  if (classSelect) {
    setState({
      reviewClassId: classSelect.value
    });
    await refreshReviewQueue();
    return;
  }

  if (courseSelect) {
    setState({
      reviewCourseId: courseSelect.value,
      reviewModuleId: ""
    });
    await refreshReviewQueue();
    return;
  }

  if (moduleSelect) {
    setState({
      reviewModuleId: moduleSelect.value
    });
    await refreshReviewQueue();
  }
}

async function openOverviewTarget(button) {
  var targetTab = button.getAttribute("data-overview-target") || "overview";
  var targetFilter = button.getAttribute("data-overview-filter") || "";

  setState({
    activeTab: targetTab,
    selectedTab: targetTab,
    selectedClassId: "",
    selectedCourseId: "",
    selectedStudentId: ""
  });

  if (targetTab === "courses") {
    await loadCourses();
  }

  if (targetTab === "reviews") {
    setState({
      statusFilter: targetFilter || "pending"
    });
    await refreshReviewQueue();
  }

  if (targetTab === "students" && targetFilter) {
    setState({
      studentStatusFilter: targetFilter
    });
  }
}

function handleInput(event) {
  var studentSearch = event.target.closest("#reviewStudentSearch");

  if (!studentSearch) {
    return;
  }

  setState({
    reviewStudentSearch: studentSearch.value
  });
}

async function reviewSubmission(button) {
  var submissionId = button.getAttribute("data-submission-id");
  var reviewStatus = button.getAttribute("data-review-status");
  var feedbackInput = document.querySelector('[data-feedback-id="' + cssEscape(submissionId) + '"]');
  var feedback = feedbackInput ? feedbackInput.value : "";

  setState({
    isReviewing: submissionId,
    error: "",
    message: "Saving review..."
  });

  try {
    await teacherDashboardService.reviewSubmission(submissionId, reviewStatus, feedback);
    await refreshReviewQueue();
    setState({
      isReviewing: "",
      message: "Review saved!"
    });
  } catch (error) {
    setState({
      isReviewing: "",
      error: error.message,
      message: ""
    });
  }
}

function setState(patch) {
  state = Object.assign({}, state, patch || {});

  if (Object.prototype.hasOwnProperty.call(patch || {}, "teacher")) {
    state.currentTeacher = state.teacher;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "currentTeacher")) {
    state.teacher = state.currentTeacher;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "activeTab")) {
    state.selectedTab = state.activeTab;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "selectedTab")) {
    state.activeTab = state.selectedTab;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "classDetailsById")) {
    state.classDetailCache = state.classDetailsById;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "classDetailCache")) {
    state.classDetailsById = state.classDetailCache;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "courseDetailsById")) {
    state.courseDetailCache = state.courseDetailsById;
  }

  if (Object.prototype.hasOwnProperty.call(patch || {}, "courseDetailCache")) {
    state.courseDetailsById = state.courseDetailCache;
  }

  render();
}

function render() {
  if (!app) {
    return;
  }

  if (!state.authReady || state.isLoading) {
    app.innerHTML = buildLoadingView();
    return;
  }

  if (!teacherDashboardService.getCurrentUser() || state.unauthorized) {
    app.innerHTML = buildLoginView();
    return;
  }

  app.innerHTML = buildDashboardView();
}

function buildTeacherLoadingSvg() {
  return '<svg class="teacher-svg teacher-loading-svg" viewBox="0 0 240 170" role="img" aria-label="Opening your classroom">'
    + '<path class="teacher-svg-track" d="M28 122 C58 72 95 145 128 94 C154 56 184 65 214 36"></path>'
    + '<g class="teacher-svg-card card-a"><rect x="46" y="92" width="52" height="42" rx="8"></rect><path d="M58 108h28M58 119h20"></path></g>'
    + '<g class="teacher-svg-card card-b"><rect x="104" y="64" width="52" height="42" rx="8"></rect><path d="M116 80h28M116 91h18"></path></g>'
    + '<g class="teacher-svg-card card-c"><rect x="160" y="38" width="52" height="42" rx="8"></rect><path d="M172 54h28M172 65h16"></path></g>'
    + '<circle class="teacher-svg-dot dot-a" cx="51" cy="122" r="6"></circle>'
    + '<circle class="teacher-svg-dot dot-b" cx="128" cy="94" r="6"></circle>'
    + '<circle class="teacher-svg-dot dot-c" cx="214" cy="36" r="6"></circle>'
    + '<path class="teacher-svg-spark spark-a" d="M72 38v14M65 45h14"></path>'
    + '<path class="teacher-svg-spark spark-b" d="M194 105v14M187 112h14"></path>'
    + '</svg>';
}

function buildMiniLogoSvg() {
  return '<svg class="teacher-mini-logo teacher-svg" viewBox="0 0 44 44" aria-hidden="true">'
    + '<rect x="5" y="5" width="34" height="34" rx="8"></rect>'
    + '<path class="teacher-svg-draw" d="M14 25c6-12 16-12 22 0"></path>'
    + '<circle class="teacher-svg-pulse" cx="22" cy="20" r="4"></circle>'
    + '</svg>';
}

function buildLoginHeroSvg() {
  return '<svg class="teacher-login-hero-svg teacher-svg" viewBox="0 0 360 210" aria-hidden="true">'
    + '<path class="teacher-hero-path" d="M32 155 C88 82 140 186 202 96 C238 44 278 62 328 34"></path>'
    + '<g class="teacher-hero-board"><rect x="46" y="52" width="132" height="86" rx="8"></rect><path d="M66 78h72M66 98h46M66 118h86"></path></g>'
    + '<g class="teacher-hero-card hero-card-one"><rect x="208" y="82" width="82" height="58" rx="8"></rect><path d="M224 104h38M224 120h28"></path></g>'
    + '<g class="teacher-hero-card hero-card-two"><rect x="242" y="28" width="70" height="48" rx="8"></rect><path d="M258 48h28M258 61h18"></path></g>'
    + '<circle class="teacher-hero-orbit" cx="94" cy="162" r="10"></circle>'
    + '<circle class="teacher-hero-orbit orbit-delay" cx="306" cy="96" r="7"></circle>'
    + '<path class="teacher-svg-spark spark-a" d="M198 40v18M189 49h18"></path>'
    + '<path class="teacher-svg-spark spark-b" d="M64 28v14M57 35h14"></path>'
    + '</svg>';
}

function buildTeacherBackdropSvg() {
  return '<svg class="teacher-backdrop-svg teacher-svg" viewBox="0 0 1180 260" aria-hidden="true">'
    + '<path class="teacher-backdrop-line line-one" d="M12 206 C210 42 350 254 514 104 C700 -66 806 198 1170 46"></path>'
    + '<path class="teacher-backdrop-line line-two" d="M18 86 C232 206 348 10 530 154 C708 295 888 68 1168 170"></path>'
    + '<circle class="teacher-backdrop-dot dot-a" cx="174" cy="92" r="10"></circle>'
    + '<circle class="teacher-backdrop-dot dot-b" cx="628" cy="86" r="8"></circle>'
    + '<circle class="teacher-backdrop-dot dot-c" cx="1018" cy="146" r="12"></circle>'
    + '</svg>';
}

function buildHeaderSceneSvg() {
  return '<svg class="teacher-header-scene-svg teacher-svg" viewBox="0 0 220 90" aria-hidden="true">'
    + '<path class="teacher-header-path" d="M12 64 C58 16 92 80 128 38 C150 14 178 22 210 12"></path>'
    + '<g class="teacher-header-book book-one"><rect x="26" y="42" width="38" height="36" rx="5"></rect><path d="M36 53h16M36 64h12"></path></g>'
    + '<g class="teacher-header-book book-two"><rect x="82" y="25" width="38" height="36" rx="5"></rect><path d="M92 36h16M92 47h12"></path></g>'
    + '<g class="teacher-header-book book-three"><rect x="142" y="18" width="42" height="38" rx="5"></rect><path d="M153 31h18M153 42h14"></path></g>'
    + '<circle class="teacher-svg-pulse" cx="203" cy="13" r="6"></circle>'
    + '</svg>';
}

function buildMetricSvg(tone) {
  var safeTone = tone === "students" || tone === "reviews" || tone === "courses" ? tone : "classes";

  return '<svg class="teacher-metric-svg teacher-svg teacher-metric-svg-' + safeTone + '" viewBox="0 0 82 82" aria-hidden="true">'
    + '<circle class="teacher-metric-ring" cx="41" cy="41" r="31"></circle>'
    + '<path class="teacher-metric-path" d="' + readMetricPath(safeTone) + '"></path>'
    + '<circle class="teacher-metric-satellite" cx="62" cy="23" r="5"></circle>'
    + '</svg>';
}

function readMetricPath(tone) {
  if (tone === "students") {
    return 'M24 55c4-11 11-16 17-16s13 5 17 16M31 29a10 10 0 1 0 20 0a10 10 0 1 0-20 0';
  }

  if (tone === "reviews") {
    return 'M25 42l10 10l22-26M22 59h36';
  }

  if (tone === "courses") {
    return 'M23 24h26c5 0 8 3 8 8v22H31c-5 0-8-3-8-8zM31 24v30M38 35h12M38 45h16';
  }

  return 'M25 25h32v36H25zM33 35h16M33 45h22M33 55h12';
}

function buildSectionGlyphSvg(kind) {
  var safeKind = kind === "students" || kind === "reviews" || kind === "courses" ? kind : "classes";

  return '<svg class="teacher-section-glyph teacher-svg teacher-section-glyph-' + safeKind + '" viewBox="0 0 58 58" aria-hidden="true">'
    + '<rect x="8" y="8" width="42" height="42" rx="8"></rect>'
    + '<path class="teacher-svg-draw" d="' + readSectionGlyphPath(safeKind) + '"></path>'
    + '<circle class="teacher-svg-pulse" cx="44" cy="14" r="4"></circle>'
    + '</svg>';
}

function readSectionGlyphPath(kind) {
  if (kind === "students") {
    return 'M18 40c3-8 8-12 11-12s8 4 11 12M21 21a8 8 0 1 0 16 0a8 8 0 1 0-16 0';
  }

  if (kind === "reviews") {
    return 'M17 30l8 8l18-20M18 44h25';
  }

  if (kind === "courses") {
    return 'M18 19h18c4 0 6 2 6 6v17H24c-4 0-6-2-6-6zM24 19v23M29 29h9M29 36h7';
  }

  return 'M18 18h24v24H18zM24 27h16M24 35h10';
}

function buildEmptyState(kind, title, note) {
  return createEmptyState(title, note, {
    className: "teacher-empty teacher-empty-visual",
    titleTag: "strong",
    messageTag: "span",
    beforeHtml: buildEmptyStateSvg(kind)
  });
}

function buildEmptyStateSvg(kind) {
  var safeKind = kind === "students" || kind === "reviews" || kind === "courses" ? kind : "classes";

  return '<svg class="teacher-empty-illustration teacher-svg teacher-empty-illustration-' + safeKind + '" viewBox="0 0 120 92" aria-hidden="true">'
    + '<path class="teacher-empty-path" d="M18 66 C34 28 50 82 68 44 C80 18 96 35 108 24"></path>'
    + '<rect class="teacher-empty-card card-a" x="20" y="38" width="34" height="28" rx="6"></rect>'
    + '<rect class="teacher-empty-card card-b" x="60" y="22" width="34" height="28" rx="6"></rect>'
    + '<circle class="teacher-svg-pulse" cx="101" cy="25" r="5"></circle>'
    + '</svg>';
}

function buildClassRouteSvg(seed) {
  var label = String(seed || "class").slice(0, 2).toUpperCase();

  return '<svg class="teacher-class-route-svg teacher-svg" viewBox="0 0 76 44" aria-hidden="true">'
    + '<path class="teacher-class-route" d="M8 31 C22 8 38 42 52 20 C58 10 64 8 70 7"></path>'
    + '<circle class="teacher-class-node node-a" cx="10" cy="31" r="5"></circle>'
    + '<circle class="teacher-class-node node-b" cx="52" cy="20" r="5"></circle>'
    + '<rect x="24" y="12" width="22" height="18" rx="5"></rect>'
    + '<text x="35" y="25" text-anchor="middle">' + escapeHtml(label) + '</text>'
    + '</svg>';
}

function buildCourseBookSvg(seed) {
  var label = String(seed || "course").slice(0, 2).toUpperCase();

  return '<svg class="teacher-course-book-svg teacher-svg" viewBox="0 0 78 56" aria-hidden="true">'
    + '<path class="teacher-class-route" d="M8 42 C22 15 40 50 58 20 C64 10 70 9 74 8"></path>'
    + '<rect x="18" y="14" width="40" height="34" rx="6"></rect>'
    + '<path class="teacher-svg-draw" d="M30 14v34M36 27h14M36 36h10"></path>'
    + '<circle class="teacher-class-node node-b" cx="66" cy="16" r="5"></circle>'
    + '<text x="39" y="44" text-anchor="middle">' + escapeHtml(label) + '</text>'
    + '</svg>';
}

function buildStudentPulseSvg(needsReview) {
  return '<svg class="teacher-student-pulse-svg teacher-svg' + (needsReview ? " needs-review" : "") + '" viewBox="0 0 64 34" aria-hidden="true">'
    + '<path class="teacher-student-wave" d="M4 18h10l5-10l8 20l7-14h10l5-8l7 12h6"></path>'
    + '<circle class="teacher-student-pulse-dot" cx="' + (needsReview ? "50" : "42") + '" cy="' + (needsReview ? "12" : "18") + '" r="4"></circle>'
    + '</svg>';
}

function buildSubmissionRibbonSvg() {
  return '<svg class="teacher-submission-ribbon teacher-svg" viewBox="0 0 124 38" aria-hidden="true">'
    + '<path class="teacher-ribbon-path" d="M6 26 C26 2 54 38 78 16 C92 4 106 8 118 14"></path>'
    + '<rect x="14" y="9" width="28" height="20" rx="5"></rect>'
    + '<rect x="50" y="12" width="28" height="20" rx="5"></rect>'
    + '<circle class="teacher-svg-pulse" cx="108" cy="14" r="5"></circle>'
    + '</svg>';
}

function buildReviewButtonSvg(status) {
  var path = 'M13 17l5 5l11-13';

  if (status === "needsWork") {
    path = 'M18 25v-2c0-4 8-4 8-10c0-4-3-7-8-7c-4 0-7 2-8 5M18 31h.1';
  }

  if (status === "incomplete") {
    path = 'M11 11l18 18M29 11L11 29';
  }

  return '<svg class="teacher-review-icon teacher-svg" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"></circle><path d="' + path + '"></path></svg>';
}

function buildSavingSvg() {
  return '<svg class="teacher-saving-icon teacher-svg" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14"></circle><path d="M20 6a14 14 0 0 1 14 14"></path></svg>';
}

function buildFileSvg(kind) {
  var safeKind = kind === "empty" ? "empty" : "file";

  return '<svg class="teacher-file-icon teacher-svg teacher-file-icon-' + safeKind + '" viewBox="0 0 48 48" aria-hidden="true">'
    + '<path d="M14 6h16l8 8v28H14z"></path>'
    + '<path class="teacher-svg-draw" d="M30 6v10h10M20 25h16M20 32h10"></path>'
    + '</svg>';
}

function buildLoadingView() {
  return '<main class="teacher-shell teacher-center">'
    + buildTeacherLoadingSvg()
    + '<h1>Opening your classroom...</h1>'
    + '<p>' + escapeHtml(state.message || "Loading Teacher Dashboard.") + '</p>'
    + '</main>';
}

function buildLoginView() {
  return '<main class="teacher-login-shell">'
    + '<section class="teacher-login-panel">'
    + '<div class="teacher-brand">' + buildMiniLogoSvg() + '<strong>Teacher Dashboard</strong></div>'
    + '<h1>Classroom command center</h1>'
    + '<p>Sign in with your teacher email to review student work and manage assigned classes.</p>'
    + buildStatusMessages()
    + '<form id="teacherLoginForm" class="teacher-form">'
    + '<label>Email<input name="email" type="email" autocomplete="email" required></label>'
    + '<label>Password<input name="password" type="password" autocomplete="current-password" required></label>'
    + '<button type="submit"' + disabled(state.isLoggingIn) + '>' + (state.isLoggingIn ? "Signing in..." : "Sign In") + '</button>'
    + '</form>'
    + '<form id="teacherResetForm" class="teacher-reset-form">'
    + '<label>Forgot Password?<input name="resetEmail" type="email" placeholder="Use login email or enter one here"></label>'
    + '<button type="submit"' + disabled(state.isResetting) + '>' + (state.isResetting ? "Sending..." : "Forgot Password?") + '</button>'
    + '</form>'
    + '</section>'
    + '<aside class="teacher-login-aside">'
    + buildLoginHeroSvg()
    + '<div><strong>Review-ready MVP</strong><span>Classes, students, and External Task submissions in one focused view.</span></div>'
    + '<div><strong>Teacher scoped</strong><span>Teachers see assigned classes only. Admin roles keep broader access.</span></div>'
    + '</aside>'
    + '</main>';
}

function buildDashboardView() {
  return '<main class="teacher-dashboard-shell">'
    + buildTeacherBackdropSvg()
    + buildHeader()
    + buildStatusMessages()
    + buildTeacherTabs()
    + buildActiveTeacherTab()
    + buildStudentProfileModal()
    + '</main>';
}

function buildHeader() {
  var teacher = state.teacher || {};

  return '<header class="teacher-header">'
    + '<div><p>Teacher Dashboard</p><h1>' + escapeHtml(teacher.name || "Teacher") + '</h1>'
    + '<span>' + escapeHtml(teacher.locationName || "Assigned school") + '</span></div>'
    + buildHeaderSceneSvg()
    + '<div class="teacher-header-actions"><span class="teacher-role-badge">' + escapeHtml(teacher.roleLabel || "Teacher") + '</span>'
    + '<button type="button" class="teacher-secondary-btn" data-action="refresh">Refresh</button>'
    + '<button type="button" class="teacher-secondary-btn" data-action="logout">Sign Out</button></div>'
    + '</header>';
}

function buildMetrics() {
  var summary = state.summary || {};

  return '<section class="teacher-metrics">'
    + buildMetricCard(summary.classCount || state.classes.length, "My Classes", "classes", "classes", "")
    + buildMetricCard(summary.courseCount || state.courses.length, "My Courses", "courses", "courses", "")
    + buildMetricCard(summary.studentCount || countKnownStudents(), "My Students", "students", "students", "")
    + buildMetricCard(summary.pendingSubmissionsCount || countPending(state.submissions), "Pending Reviews", "reviews", "reviews", "pending")
    + buildMetricCard(countNeedsWorkStudents(), "Needs Work", "students", "students", "needsWork")
    + buildMetricCard(countReviewsByStatus("complete"), "Completed Reviews", "reviews", "reviews", "complete")
    + '</section>';
}

function buildMetricCard(value, label, tone, targetTab, targetFilter) {
  return '<button type="button" class="teacher-metric teacher-metric-' + escapeHtml(tone) + '" data-overview-target="' + escapeHtml(targetTab || "overview") + '" data-overview-filter="' + escapeHtml(targetFilter || "") + '">'
    + buildMetricSvg(tone)
    + '<strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></button>';
}

function buildTeacherTabs() {
  return '<nav class="teacher-tabs" aria-label="Teacher dashboard sections">'
    + buildTeacherTabButton("overview", "Overview", "")
    + buildTeacherTabButton("classes", "Classes", state.classes.length)
    + buildTeacherTabButton("students", "Students", countKnownStudents())
    + buildTeacherTabButton("courses", "Courses", countKnownCourses())
    + buildTeacherTabButton("reviews", "Reviews", countPending(state.submissions))
    + buildTeacherTabButton("analytics", "Analytics", "")
    + buildTeacherTabButton("activity", "Activity", "")
    + buildTeacherTabButton("schedule", "Schedule", "")
    + '</nav>';
}

function buildTeacherTabButton(tabName, label, count) {
  return '<button type="button" class="teacher-tab' + (state.activeTab === tabName ? " active" : "") + '" data-teacher-tab="' + escapeHtml(tabName) + '">'
    + '<strong>' + escapeHtml(label) + '</strong>' + (count === "" ? "" : '<span>' + escapeHtml(String(count)) + '</span>') + '</button>';
}

function buildActiveTeacherTab() {
  if (state.activeTab === "overview") {
    return buildOverviewTab();
  }

  if (state.activeTab === "courses") {
    return buildCourseCards();
  }

  if (state.activeTab === "students") {
    return buildStudentsTab();
  }

  if (state.activeTab === "reviews") {
    return buildReviewQueue();
  }

  if (state.activeTab === "analytics") {
    return buildAnalyticsDashboard();
  }

  if (state.activeTab === "activity") {
    return buildActivityTab();
  }

  if (state.activeTab === "schedule") {
    return buildScheduleTab();
  }

  if (state.selectedClassId) {
    return buildClassCommandCenter();
  }

  return buildClassesTab();
}

function buildOverviewTab() {
  return '<section class="teacher-overview-stack">'
    + buildMetrics()
    + '<section class="teacher-grid">'
    + buildOverviewClassesPanel()
    + buildOverviewWorkPanel()
    + '</section>'
    + '</section>';
}

function buildOverviewClassesPanel() {
  var classes = (state.classes || []).slice(0, 4);
  var html = '<section class="teacher-card-section"><div class="teacher-section-title"><div><h2>Classes</h2><p>Quick access to assigned classrooms</p></div>' + buildSectionGlyphSvg("classes") + '</div>';

  if (classes.length === 0) {
    return html + buildEmptyState("classes", "No classes assigned yet.", "Assigned classes will appear here.") + '</section>';
  }

  html += '<div class="teacher-class-list">';
  classes.forEach(function (classRecord) {
    html += buildCompactClassButton(classRecord);
  });

  return html + '</div></section>';
}

function buildOverviewWorkPanel() {
  return '<section class="teacher-card-section"><div class="teacher-section-title"><div><h2>Today</h2><p>Review and student signals</p></div>' + buildSectionGlyphSvg("reviews") + '</div>'
    + '<div class="teacher-class-list">'
    + buildActionRow("Pending Reviews", countPending(state.submissions), "reviews", "pending")
    + buildActionRow("Needs Work", countNeedsWorkStudents(), "students", "needsWork")
    + buildActionRow("Completed Reviews", countReviewsByStatus("complete"), "reviews", "complete")
    + '</div></section>';
}

function buildActionRow(label, value, targetTab, targetFilter) {
  return '<button type="button" class="teacher-class-card" data-overview-target="' + escapeHtml(targetTab) + '" data-overview-filter="' + escapeHtml(targetFilter || "") + '">'
    + buildClassRouteSvg(label)
    + '<strong>' + escapeHtml(label) + '</strong>'
    + '<span>' + escapeHtml(String(value)) + '</span>'
    + '<small>Open ' + escapeHtml(targetTab) + '</small>'
    + '</button>';
}

function buildClassesTab() {
  return '<section class="teacher-grid">'
    + buildClassCards()
    + buildStudentsView()
    + '</section>';
}

function buildClassCards() {
  var classes = state.classes || [];
  var html = '<section class="teacher-card-section"><div class="teacher-section-title"><div><h2>My Classes</h2><p>Owned classroom groups</p></div>' + buildSectionGlyphSvg("classes") + '</div>';

  if (classes.length === 0) {
    return html + buildEmptyState("classes", "No classes assigned yet.", "Ask an admin to assign this teacher as a primary teacher or assistant.") + '</section>';
  }

  html += '<div class="teacher-class-list"><button type="button" class="teacher-class-card' + (!state.selectedClassId ? " active" : "") + '" data-class-id="">'
    + buildClassRouteSvg("all") + '<strong>All assigned classes</strong><span>' + classes.length + ' classes</span></button>';

  classes.forEach(function (classRecord) {
    html += '<button type="button" class="teacher-class-card' + (state.selectedClassId === classRecord.id ? " active" : "") + '" data-class-id="' + escapeHtml(classRecord.id) + '">'
      + buildClassRouteSvg(classRecord.id || classRecord.name || "class")
      + '<strong>' + escapeHtml(classRecord.name) + '</strong>'
      + '<span>' + escapeHtml(classRecord.locationName || "Assigned location") + '</span>'
      + '<small>' + escapeHtml(classRecord.ownershipRole || "Assigned") + ' | ' + classRecord.studentCount + ' students | ' + classRecord.assignedCoursesCount + ' courses | ' + classRecord.pendingSubmissionsCount + ' pending</small>'
      + '</button>';
  });

  return html + '</div></section>';
}

function buildCompactClassButton(classRecord) {
  return '<button type="button" class="teacher-class-card' + (state.selectedClassId === classRecord.id ? " active" : "") + '" data-class-id="' + escapeHtml(classRecord.id) + '">'
    + buildClassRouteSvg(classRecord.id || classRecord.name || "class")
    + '<strong>' + escapeHtml(classRecord.name || "Class") + '</strong>'
    + '<span>' + escapeHtml(classRecord.locationName || "Assigned location") + '</span>'
    + '<small>' + escapeHtml(classRecord.ownershipRole || "Assigned") + ' | ' + (classRecord.studentCount || 0) + ' students | ' + (classRecord.assignedCoursesCount || 0) + ' courses | ' + (classRecord.pendingSubmissionsCount || 0) + ' pending</small>'
    + '</button>';
}

function buildClassCommandCenter() {
  var classRecord = getSelectedClassRecord();

  if (!classRecord) {
    console.warn("[teacher-class-view:missing-class]", {
      classId: state.selectedClassId || ""
    });

    return '<section class="teacher-class-command">'
      + '<div class="teacher-class-command-header"><div><p>Class Command Center</p><h2>Class not found</h2><span>The selected class is no longer available.</span></div>'
      + '<button type="button" class="teacher-secondary-btn" data-action="back-to-classes">Back</button></div>'
      + '</section>';
  }

  if (state.isClassDetailLoading && !getSelectedClassDetail()) {
    return '<section class="teacher-class-command">'
      + buildClassCommandHeader(classRecord)
      + createLoadingState("Loading class details...", {
        className: "teacher-review-loading",
        beforeHtml: buildSavingSvg()
      })
      + '</section>';
  }

  return '<section class="teacher-class-command">'
    + buildClassCommandHeader(classRecord)
    + buildClassDetailErrors()
    + buildClassSummaryCards(classRecord)
    + '<div class="teacher-class-command-grid">'
    + buildClassStudentsSection()
    + '<aside class="teacher-class-side-panel">'
    + buildMoodSummarySection()
    + buildAssignedCoursesSection()
    + '</aside>'
    + '</div>'
    + '</section>';
}

function buildClassCommandHeader(classRecord) {
  return '<div class="teacher-class-command-header">'
    + '<div><p>Class Command Center</p><h2>' + escapeHtml(classRecord.name || "Class") + '</h2>'
    + '<span>' + escapeHtml(classRecord.locationName || "Assigned location") + ' | ' + getSelectedClassStudents().length + ' students | ' + escapeHtml(formatToday()) + '</span></div>'
    + '<button type="button" class="teacher-secondary-btn" data-action="back-to-classes">Back to Classes</button>'
    + '</div>';
}

function buildClassSummaryCards(classRecord) {
  var students = getSelectedClassStudents();
  var moodCount = countStudentsWithMoodToday(students);
  var courses = getSelectedClassCourses();

  return '<div class="teacher-class-summary">'
    + buildClassSummaryCard("Total students", students.length)
    + buildClassSummaryCard("Present today", countStudentsByAttendance(students, "present"))
    + buildClassSummaryCard("Absent today", countStudentsByAttendance(students, "absent"))
    + buildClassSummaryCard("Check-ins today", moodCount)
    + buildClassSummaryCard("Assigned courses", classRecord.assignedCoursesCount || courses.length || 0)
    + '</div>';
}

function buildClassSummaryCard(label, value) {
  return '<article class="teacher-class-summary-card"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value == null ? 0 : value)) + '</strong></article>';
}

function buildClassStudentsSection() {
  var students = getSelectedClassStudents();
  var errors = getSelectedClassDetailErrors();
  var html = '<section class="teacher-card-section teacher-class-students-section"><div class="teacher-section-title"><div><h2>Students</h2><p>Today signals and course progress</p></div>' + buildSectionGlyphSvg("students") + '</div>';

  if (errors.students) {
    return html + buildClassSectionError("Students could not be loaded.", errors.students) + '</section>';
  }

  if (students.length === 0) {
    return html + buildEmptyState("students", "No students in this class yet.", "Students assigned to this class will appear here.") + '</section>';
  }

  html += '<div class="teacher-class-student-grid">';
  students.forEach(function (student) {
    html += buildClassStudentCard(student);
  });

  return html + '</div></section>';
}

function buildClassStudentCard(student) {
  var statusLabel = readStudentStatusLabel(student);
  var progress = readStudentProgressPercent(student);
  var progressText = progress == null ? "Progress not recorded" : progress + "% complete";

  return '<button type="button" class="teacher-class-student-card" data-action="open-student-profile" data-student-id="' + escapeHtml(student.id || "") + '">'
    + '<div class="teacher-avatar">' + buildStudentAvatar(student) + '</div>'
    + '<div class="teacher-class-student-copy"><strong>' + escapeHtml(student.name || "Student") + '</strong>'
    + '<span>Mood: ' + escapeHtml(readStudentMoodToday(student) || "Not recorded") + '</span>'
    + '<span>Course: ' + escapeHtml(readStudentCourseTitle(student) || "Not assigned") + '</span>'
    + '<span>' + escapeHtml(progressText) + '</span></div>'
    + '<b class="' + escapeHtml(readStudentStatusClass(statusLabel)) + '">' + escapeHtml(statusLabel) + '</b>'
    + '</button>';
}

function buildMoodSummarySection() {
  var distribution = buildMoodDistribution(getSelectedClassStudents());
  var keys = Object.keys(distribution);
  var errors = getSelectedClassDetailErrors();
  var html = '<section class="teacher-class-panel"><div class="teacher-section-title compact"><div><h2>Emotional Check-Ins</h2><p>Today mood distribution</p></div></div>';

  if (errors.emotionalCheckIns) {
    return html + buildClassSectionError("Emotional check-ins could not be loaded.", errors.emotionalCheckIns) + '</section>';
  }

  if (keys.length === 0) {
    return html + '<div class="teacher-empty compact">No emotional check-ins recorded today.</div></section>';
  }

  html += '<div class="teacher-mood-list">';
  keys.forEach(function (key) {
    html += '<div><span>' + escapeHtml(key) + '</span><strong>' + escapeHtml(String(distribution[key])) + '</strong></div>';
  });

  return html + '</div></section>';
}

function buildAssignedCoursesSection() {
  var courses = getSelectedClassCourses();
  var errors = getSelectedClassDetailErrors();
  var html = '<section class="teacher-class-panel"><div class="teacher-section-title compact"><div><h2>Assigned Courses</h2><p>Class course assignments</p></div></div>';

  if (errors.courses) {
    return html + buildClassSectionError("Assigned courses could not be loaded.", errors.courses) + '</section>';
  }

  if (courses.length === 0) {
    return html + '<div class="teacher-empty compact">No courses assigned to this class yet.</div></section>';
  }

  html += '<div class="teacher-class-course-list">';
  courses.forEach(function (course) {
    html += buildAssignedCourseCard(course);
  });

  return html + '</div></section>';
}

function buildAssignedCourseCard(course) {
  return '<article class="teacher-class-course-card">'
    + '<strong>' + escapeHtml(course.courseTitle || course.title || "Untitled Course") + '</strong>'
    + '<span>' + escapeHtml(readCourseModuleLabel(course)) + '</span>'
    + '<span>Status: ' + escapeHtml(formatCourseStatus(course.status || course.readinessStatus || course.publishedStatus || "Not recorded")) + '</span>'
    + '<small>' + escapeHtml(readCourseProgressSummary(course)) + '</small>'
    + '</article>';
}

function buildClassDetailErrors() {
  var errors = getSelectedClassDetailErrors();
  var messages = [];

  addClassErrorMessage(messages, "Class information", errors.classInfo || errors.classDetail);
  addClassErrorMessage(messages, "Students", errors.students);
  addClassErrorMessage(messages, "Assigned courses", errors.courses);
  addClassErrorMessage(messages, "Emotional check-ins", errors.emotionalCheckIns);

  if (messages.length === 0) {
    return "";
  }

  return '<div class="teacher-error">' + messages.map(function (message) {
    return '<div>' + escapeHtml(message) + '</div>';
  }).join("") + '</div>';
}

function addClassErrorMessage(messages, label, errorMessage) {
  if (!errorMessage) {
    return;
  }

  messages.push(label + " failed to load: " + errorMessage);
}

function buildClassSectionError(title, errorMessage) {
  return '<div class="teacher-empty compact"><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(errorMessage || "Try refreshing this class.") + '</span></div>';
}

function buildCourseCards() {
  if (state.selectedCourseId) {
    return buildCourseDetailView();
  }

  var courses = getFilteredCoursesForCoursesTab();
  var html = '<section class="teacher-card-section teacher-wide-section"><div class="teacher-section-title"><div><h2>My Courses</h2><p>Course assignments owned by this teacher</p></div>' + buildSectionGlyphSvg("courses") + '</div>'
    + '<div class="teacher-filters">'
    + '<label>Class<select id="courseClassFilter"><option value="">All classes</option>' + buildClassFilterOptions(state.courseClassFilterId) + '</select></label>'
    + '</div>';

  if (state.isCourseListLoading) {
    return html + createLoadingState("Loading courses...", {
      className: "teacher-review-loading",
      beforeHtml: buildSavingSvg()
    }) + '</section>';
  }

  if (courses.length === 0) {
    return html + buildEmptyState("courses", "No course assignments assigned yet.", "Responsible teacher and assistant course assignments will appear here.") + '</section>';
  }

  html += '<div class="teacher-course-list">';
  courses.forEach(function (course) {
    html += '<button type="button" class="teacher-course-card' + (state.selectedCourseId === course.id ? " active" : "") + '" data-course-assignment-id="' + escapeHtml(course.id) + '" data-course-id="' + escapeHtml(course.courseId || "") + '">'
      + buildCourseBookSvg(course.courseTitle || course.courseId || "course")
      + '<div><strong>' + escapeHtml(course.courseTitle || "Untitled Course") + '</strong>'
      + '<span>' + escapeHtml(readCourseAssignedClassLabel(course)) + '</span></div>'
      + '<b>' + escapeHtml(course.ownershipRole || "Assigned") + '</b>'
      + '<small>' + escapeHtml(readCourseModuleLabel(course)) + ' | ' + course.studentCount + ' students | ' + course.pendingSubmissionsCount + ' pending reviews</small>'
      + '</button>';
  });

  return html + '</div></section>';
}

function buildCourseDetailView() {
  var detail = getSelectedCourseDetail();
  var course = detail && detail.course ? detail.course : findCourseByAssignmentOrCourseId(state.selectedCourseId, "");
  var students = detail && Array.isArray(detail.students) ? detail.students : readStudentsForCourse(course);
  var errors = detail && detail.errors ? detail.errors : {};
  var modules = readCourseModulesFromDetail(detail, course);
  var summary = detail && detail.summary ? detail.summary : createCourseMonitorSummaryFallback(students, modules);
  var courseDescription = course ? (course.description || course.summary || course.overview || "") : "";

  if (state.isCourseDetailLoading && !detail) {
    return '<section class="teacher-class-command">'
      + '<div class="teacher-class-command-header"><div><p>Lesson Monitor</p><h2>Loading course...</h2><span>Fetching course detail on demand.</span></div><button type="button" class="teacher-secondary-btn" data-action="back-to-courses">Back to Courses</button></div>'
      + createLoadingState("Loading course details...", {
        className: "teacher-review-loading",
        beforeHtml: buildSavingSvg()
      })
      + '</section>';
  }

  if (!course) {
    return '<section class="teacher-class-command">'
      + '<div class="teacher-class-command-header"><div><p>Lesson Monitor</p><h2>Course not found</h2><span>This course assignment is no longer available.</span></div><button type="button" class="teacher-secondary-btn" data-action="back-to-courses">Back to Courses</button></div>'
      + '</section>';
  }

  return '<section class="teacher-class-command">'
    + '<div class="teacher-class-command-header"><div><p>Lesson Monitor</p><h2>' + escapeHtml(course.courseTitle || course.title || "Untitled Course") + '</h2><span>' + escapeHtml(readCourseAssignedClassLabel(course)) + ' | ' + escapeHtml(formatCourseStatus(course.status || course.readinessStatus || course.publishedStatus || "Not recorded")) + '</span>' + (courseDescription ? '<small>' + escapeHtml(courseDescription) + '</small>' : "") + '</div><button type="button" class="teacher-secondary-btn" data-action="back-to-courses">Back to Courses</button></div>'
    + (errors.courseDetail ? '<div class="teacher-error">Course detail failed to load: ' + escapeHtml(errors.courseDetail) + '</div>' : "")
    + (students.length === 0 ? '<div class="teacher-empty compact">No students assigned to this course yet.</div>' : "")
    + (modules.length === 0 ? '<div class="teacher-empty compact">No modules found for this course yet.</div>' : "")
    + '<div class="teacher-class-summary">'
    + buildClassSummaryCard("Total Students", summary.totalStudents == null ? students.length : summary.totalStudents)
    + buildClassSummaryCard("Active Now", summary.activeNow || 0)
    + buildClassSummaryCard("Modules", summary.totalModules == null ? modules.length : summary.totalModules)
    + buildClassSummaryCard("Completion Activity", formatMonitorCompletion(summary, course))
    + '</div>'
    + '<div class="teacher-course-monitor-grid">'
    + buildCourseModulesPanel(modules)
    + buildCourseStudentsPanel(students)
    + '</div>'
    + '</section>';
}

function buildCourseModulesPanel(modules) {
  var html = '<section class="teacher-card-section teacher-course-module-panel"><div class="teacher-section-title"><div><h2>Module Progress</h2><p>Course structure and student movement</p></div>' + buildSectionGlyphSvg("courses") + '</div>';

  if (!Array.isArray(modules) || modules.length === 0) {
    return html + buildEmptyState("courses", "No modules found.", "Modules are missing or have not been loaded for this assignment.") + '</section>';
  }

  html += '<div class="teacher-monitor-module-list">';
  modules.forEach(function (moduleRecord) {
    html += '<details class="teacher-monitor-module-card">'
      + '<summary><div><span>Module ' + escapeHtml(String(moduleRecord.order || "")) + '</span><strong>' + escapeHtml(readModuleTitle(moduleRecord)) + '</strong></div><b>' + escapeHtml(formatPercent(moduleRecord.averageCompletionPercent || 0)) + '</b></summary>'
      + '<div class="teacher-monitor-module-metrics">'
      + '<span>Started <strong>' + escapeHtml(String(moduleRecord.studentsStartedCount || 0)) + '</strong></span>'
      + '<span>Completed <strong>' + escapeHtml(String(moduleRecord.studentsCompletedCount || 0)) + '</strong></span>'
      + '<span>Steps <strong>' + escapeHtml(String(moduleRecord.totalStepCount || 0)) + '</strong></span>'
      + '</div>'
      + buildModuleActiveStudentList(moduleRecord)
      + '</details>';
  });

  return html + '</div></section>';
}

function buildCourseStudentsPanel(students) {
  var html = '<section class="teacher-card-section teacher-course-student-panel"><div class="teacher-section-title"><div><h2>Student Monitoring</h2><p>Current activity in this lesson</p></div>' + buildSectionGlyphSvg("students") + '</div>';

  if (!students || students.length === 0) {
    return html + buildEmptyState("students", "No students assigned.", "Students connected through class enrollment, course assignment, or progress records will appear here.") + '</section>';
  }

  html += '<div class="teacher-monitor-table-wrap"><table class="teacher-monitor-table"><thead><tr>'
    + '<th>Student</th>'
    + '<th>Status</th>'
    + '<th>Current Module</th>'
    + '<th>Current Step</th>'
    + '<th>Last Activity</th>'
    + '<th>Modules</th>'
    + '<th>Steps</th>'
    + '<th>Time</th>'
    + '<th>Engagement</th>'
    + '</tr></thead><tbody>';
  students.forEach(function (student) {
    html += buildCourseMonitorStudentRow(student);
  });

  return html + '</tbody></table></div></section>';
}

function buildModuleActiveStudentList(moduleRecord) {
  var students = Array.isArray(moduleRecord.activeStudents) ? moduleRecord.activeStudents : [];
  var html = "";

  if (students.length === 0) {
    return '<div class="teacher-monitor-module-empty">No student progress in this module yet.</div>';
  }

  html += '<div class="teacher-monitor-module-students">';
  students.slice(0, 8).forEach(function (student) {
    html += '<span>' + escapeHtml(student.name || "Student") + ' · ' + escapeHtml(formatPercent(student.progressPercent || 0)) + '</span>';
  });

  if (students.length > 8) {
    html += '<span>+' + escapeHtml(String(students.length - 8)) + ' more</span>';
  }

  return html + '</div>';
}

function buildCourseMonitorStudentRow(student) {
  return '<tr>'
    + '<td><button type="button" class="teacher-monitor-student-link" data-action="open-student-profile" data-student-id="' + escapeHtml(student.id || "") + '"><span class="teacher-avatar">' + buildStudentAvatar(student) + '</span><span><strong>' + escapeHtml(student.name || "Student") + '</strong><small>' + escapeHtml(student.className || readStudentClassName(student) || "Assigned student") + '</small></span></button></td>'
    + '<td>' + buildMonitorBadge(student.courseStatusLabel || "Not Started", student.courseStatus || "notStarted") + '</td>'
    + '<td>' + escapeHtml(student.currentModuleTitle || "Not started") + '</td>'
    + '<td>' + escapeHtml(student.currentStepTitle || "Not available") + '</td>'
    + '<td>' + escapeHtml(formatDate(student.lastActivityAt) || "No progress yet") + '</td>'
    + '<td>' + escapeHtml(student.moduleProgressCount || createProgressCount(student.completedModuleCount, student.totalModuleCount)) + '</td>'
    + '<td>' + escapeHtml(student.stepProgressCount || createProgressCount(student.completedStepCount, student.totalStepCount)) + '</td>'
    + '<td>' + escapeHtml(formatMonitorTime(student.timeOnTaskSeconds)) + '</td>'
    + '<td>' + buildMonitorBadge(student.engagementStatus || "Inactive", normalizeEngagementClass(student.engagementStatus)) + '</td>'
    + '</tr>';
}

function buildMonitorBadge(label, status) {
  return '<span class="teacher-monitor-badge ' + escapeHtml(normalizeMonitorBadgeClass(status)) + '">' + escapeHtml(label || "Not Started") + '</span>';
}

function normalizeMonitorBadgeClass(status) {
  var value = String(status || "").trim().toLowerCase();

  if (value === "active" || value === "active now") return "active";
  if (value === "inprogress" || value === "in-progress" || value === "in progress" || value === "recently active") return "in-progress";
  if (value === "completed") return "completed";
  return "not-started";
}

function normalizeEngagementClass(status) {
  var value = String(status || "").trim().toLowerCase();

  if (value === "active now") return "active";
  if (value === "recently active") return "in-progress";
  return "not-started";
}

function createProgressCount(completed, total) {
  return String(Number(completed) || 0) + "/" + String(Number(total) || 0);
}

function createCourseMonitorSummaryFallback(students, modules) {
  var activeNow = 0;
  var progressTotal = 0;

  (students || []).forEach(function (student) {
    if (student.engagementStatus === "Active Now") {
      activeNow = activeNow + 1;
    }
    progressTotal = progressTotal + (Number(student.progressPercent) || 0);
  });

  return {
    totalStudents: students ? students.length : 0,
    activeNow: activeNow,
    totalModules: modules ? modules.length : 0,
    averageCompletionPercent: students && students.length > 0 ? Math.round(progressTotal / students.length) : 0
  };
}

function formatMonitorCompletion(summary, course) {
  if (summary && typeof summary.averageCompletionPercent === "number") {
    return formatPercent(summary.averageCompletionPercent);
  }

  return readCourseProgressSummary(course);
}

function formatPercent(value) {
  return Math.round(Number(value) || 0) + "%";
}

function formatMonitorTime(seconds) {
  if (!seconds || Number(seconds) <= 0) {
    return "Not tracked";
  }

  return formatDuration(seconds);
}

function buildStudentsView() {
  var students = getStudentsForInlinePanel();
  var html = '<section class="teacher-card-section"><div class="teacher-section-title"><div><h2>Students</h2><p>Progress and review signals</p></div>' + buildSectionGlyphSvg("students") + '</div>';

  if (students.length === 0) {
    return html + buildEmptyState("students", "No students found.", "Students assigned to this class will appear here.") + '</section>';
  }

  html += '<div class="teacher-student-list">';
  students.forEach(function (student) {
    html += buildStudentRow(student);
  });

  return html + '</div></section>';
}

function buildStudentsTab() {
  var students = getFilteredStudentsForStudentsTab();
  var html = '<section class="teacher-card-section teacher-wide-section"><div class="teacher-section-title"><div><h2>Students</h2><p>Filter by class and support status</p></div>' + buildSectionGlyphSvg("students") + '</div>'
    + '<div class="teacher-filters">'
    + '<label>Class<select id="studentClassFilter"><option value="">All classes loaded</option>' + buildClassFilterOptions(state.studentClassFilterId) + '</select></label>'
    + '<label>Status<select id="studentStatusFilter">'
    + buildGenericOption("all", "All Students", state.studentStatusFilter)
    + buildGenericOption("needsWork", "Needs Work", state.studentStatusFilter)
    + buildGenericOption("noProgress", "No Progress", state.studentStatusFilter)
    + buildGenericOption("steady", "Active / Steady", state.studentStatusFilter)
    + '</select></label>'
    + '</div>';

  if (students.length === 0) {
    return html + buildEmptyState("students", "No students match these filters.", "Choose a class filter to load class students, or open a class from the Classes tab.") + '</section>';
  }

  html += '<div class="teacher-student-list">';
  students.forEach(function (student) {
    html += buildStudentRow(student);
  });

  return html + '</div></section>';
}

function buildStudentRow(student) {
  var statusLabel = readStudentStatusLabel(student);
  var className = readStudentClassName(student);
  var pendingCount = student.pendingSubmissionsCount || 0;

  return '<button type="button" class="teacher-student-row" data-action="open-student-profile" data-student-id="' + escapeHtml(student.id || "") + '">'
      + '<div class="teacher-avatar">' + buildStudentAvatar(student) + '</div>'
      + '<div><strong>' + escapeHtml(student.name || "Student") + '</strong><span>' + escapeHtml(className || "Class not recorded") + ' | ' + escapeHtml(student.currentCourseProgress || readStudentProfileProgress(student)) + '</span></div>'
      + buildStudentPulseSvg(pendingCount > 0)
      + '<div><span>' + escapeHtml(formatDate(student.lastActiveAt) || "No recent activity") + '</span><small>' + pendingCount + ' pending</small></div>'
      + '<b class="' + (pendingCount > 0 ? "needs-review" : "steady") + '">' + escapeHtml(statusLabel === "Needs Help" ? "Needs Work" : statusLabel) + '</b>'
      + '</button>';
}

function buildStudentProfileModal() {
  var student = getSelectedStudentRecord();
  var studentCourses = readCoursesForStudent(student);

  if (!student) {
    return "";
  }

  return '<div class="teacher-modal-backdrop" data-student-profile-backdrop role="presentation">'
    + '<section class="teacher-student-modal" role="dialog" aria-modal="true" aria-labelledby="teacherStudentModalTitle">'
    + '<div class="teacher-student-modal-head"><div class="teacher-avatar large">' + buildStudentAvatar(student) + '</div>'
    + '<div><p>Student Profile</p><h2 id="teacherStudentModalTitle">' + escapeHtml(student.name || "Student") + '</h2></div>'
    + '<button type="button" class="teacher-secondary-btn" data-action="close-student-profile">Close</button></div>'
    + '<div class="teacher-student-profile-grid">'
    + buildStudentProfileRow("Class", readStudentClassName(student) || "Not recorded")
    + buildStudentProfileRow("Assigned courses", studentCourses.length > 0 ? studentCourses.map(function (course) { return course.courseTitle || course.title || "Untitled Course"; }).join(", ") : "Not recorded")
    + buildStudentProfileRow("Mood today", readStudentMoodToday(student) || "Not recorded")
    + buildStudentProfileRow("Attendance today", readAttendanceToday(student) || "Not recorded")
    + buildStudentProfileRow("Assigned progress", readStudentProfileProgress(student))
    + buildStudentProfileRow("Intention points", readIntentionPointTotal(student))
    + buildStudentProfileRow("Recent activity", formatDate(student.lastActiveAt) || "No recent activity")
    + '</div>'
    + '</section></div>';
}

function buildStudentProfileRow(label, value) {
  return '<div class="teacher-student-profile-row"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value == null || value === "" ? "Not recorded" : value)) + '</strong></div>';
}

function buildReviewQueue() {
  var submissions = getFilteredReviewSubmissions();
  var html = '<section class="teacher-review-section">'
    + '<div class="teacher-section-title"><div><h2>Review Queue</h2><p>External Task submissions from assigned classes</p></div>' + buildSectionGlyphSvg("reviews") + '</div>'
    + '<div class="teacher-filters">'
    + '<label>Class<select id="reviewClassFilter"><option value="">All classes</option>' + buildClassOptions() + '</select></label>'
    + '<label>Course<select id="reviewCourseFilter"><option value="">All courses</option>' + buildReviewCourseOptions() + '</select></label>'
    + '<label>Module<select id="reviewModuleFilter"><option value="">All modules</option>' + buildReviewModuleOptions() + '</select></label>'
    + '<label>Status<select id="reviewStatusFilter">'
    + buildStatusOption("all", "All")
    + buildStatusOption("pending", "Pending")
    + buildStatusOption("needsWork", "Needs Work")
    + buildStatusOption("complete", "Complete")
    + buildStatusOption("incomplete", "Incomplete")
    + '</select></label>'
    + '<label>Student<input id="reviewStudentSearch" type="search" value="' + escapeHtml(state.reviewStudentSearch || "") + '" placeholder="Search student name"></label>'
    + '</div>';

  if (state.isReviewQueueLoading) {
    return html + createLoadingState("Loading submissions...", {
      className: "teacher-review-loading",
      beforeHtml: buildSavingSvg()
    }) + '</section>';
  }

  if (state.reviewQueueError) {
    return html + buildEmptyState("reviews", "Review tools are not available yet.", "The review queue could not be loaded. Try Refresh when review tools are available.") + '</section>';
  }

  if (submissions.length === 0) {
    return html + buildReviewEmptyState() + '</section>';
  }

  html += '<div class="teacher-review-list">';
  submissions.forEach(function (submission) {
    html += buildSubmissionCard(submission);
  });

  return html + '</div></section>';
}

function buildAnalyticsDashboard() {
  var snapshot = getAnalyticsSnapshot();

  return '<section class="teacher-analytics-shell">'
    + '<div class="teacher-section-title"><div><h2>Analytics</h2><p>Learning, engagement, wellness, and mastery signals from loaded classroom data</p></div>' + buildSectionGlyphSvg("students") + '</div>'
    + buildAnalyticsControls()
    + buildAnalyticsTabs(snapshot)
    + buildAnalyticsActivePanel(snapshot)
    + '</section>';
}

function buildAnalyticsControls() {
  return '<div class="teacher-analytics-controls">'
    + '<label>Range<select id="analyticsRangeFilter">'
    + buildGenericOption("today", "Today", state.analyticsRange)
    + buildGenericOption("week", "This Week", state.analyticsRange)
    + buildGenericOption("month", "This Month", state.analyticsRange)
    + '</select></label>'
    + '<span>Uses existing progress, review, gamification, and check-in records already loaded for this teacher.</span>'
    + '</div>';
}

function buildAnalyticsTabs(snapshot) {
  var tab = state.analyticsTab || "overview";

  return '<nav class="teacher-analytics-tabs" aria-label="Analytics sections">'
    + buildAnalyticsTabButton("overview", "Overview", tab)
    + buildAnalyticsTabButton("students", "Students", tab, snapshot.students.length)
    + buildAnalyticsTabButton("activities", "Activities", tab, snapshot.activities.length)
    + buildAnalyticsTabButton("mood", "Mood & Wellness", tab)
    + buildAnalyticsTabButton("mastery", "Mastery", tab)
    + buildAnalyticsTabButton("engagement", "Engagement", tab)
    + '</nav>';
}

function buildAnalyticsTabButton(tabName, label, currentTab, count) {
  return '<button type="button" class="teacher-analytics-tab' + (currentTab === tabName ? " active" : "") + '" data-analytics-tab="' + escapeHtml(tabName) + '">'
    + '<strong>' + escapeHtml(label) + '</strong>'
    + (typeof count === "number" ? '<span>' + count + '</span>' : "")
    + '</button>';
}

function buildAnalyticsActivePanel(snapshot) {
  if (state.analyticsTab === "student-detail") {
    return buildAnalyticsStudentDetail(snapshot);
  }
  if (state.analyticsTab === "students") {
    return buildAnalyticsStudentsPanel(snapshot);
  }
  if (state.analyticsTab === "activities") {
    return buildAnalyticsActivitiesPanel(snapshot);
  }
  if (state.analyticsTab === "mood") {
    return buildAnalyticsMoodPanel(snapshot);
  }
  if (state.analyticsTab === "mastery") {
    return buildAnalyticsMasteryPanel(snapshot);
  }
  if (state.analyticsTab === "engagement") {
    return buildAnalyticsEngagementPanel(snapshot);
  }

  return buildAnalyticsOverviewPanel(snapshot);
}

function buildAnalyticsOverviewPanel(snapshot) {
  return '<section class="teacher-analytics-panel">'
    + '<div class="teacher-analytics-card-grid">'
    + buildAnalyticsMetric("Class Completion Rate", snapshot.overview.completionRate + "%", "Course and activity completion")
    + buildAnalyticsMetric("Average Accuracy", snapshot.overview.averageAccuracy + "%", "Known scores and review results")
    + buildAnalyticsMetric("Average XP", snapshot.overview.averageXp, "Gamification XP earned")
    + buildAnalyticsMetric("Average Stars", snapshot.overview.averageStars, "Stars earned per student")
    + buildAnalyticsMetric("Mastery Rate", snapshot.overview.masteryRate + "%", "Students at mastery level")
    + buildAnalyticsMetric("Engagement Score", snapshot.overview.engagementScore + "%", "Completion, XP, activity, recency, consistency")
    + '</div>'
    + '<div class="teacher-analytics-grid">'
    + buildAnalyticsTrendCard("Completion Trend", snapshot.trends.completion)
    + buildAnalyticsTrendCard("XP Trend", snapshot.trends.xp)
    + buildAnalyticsTrendCard("Mood Trend", snapshot.trends.mood)
    + buildAnalyticsInsights(snapshot.insights)
    + '</div>'
    + '</section>';
}

function buildAnalyticsMetric(label, value, detail) {
  return '<article class="teacher-analytics-metric"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong><small>' + escapeHtml(detail) + '</small></article>';
}

function buildAnalyticsTrendCard(title, points) {
  return '<article class="teacher-analytics-chart-card"><h3>' + escapeHtml(title) + '</h3>'
    + '<div class="teacher-analytics-bars">' + buildAnalyticsBars(points || []) + '</div></article>';
}

function buildAnalyticsBars(points) {
  var maxValue = Math.max(1, Math.max.apply(null, points.map(function (point) { return Number(point.value) || 0; })));

  return points.map(function (point) {
    var percent = Math.round(((Number(point.value) || 0) / maxValue) * 100);

    return '<div class="teacher-analytics-bar"><span style="height:' + percent + '%"></span><small>' + escapeHtml(point.label) + '</small><b>' + escapeHtml(String(point.value || 0)) + '</b></div>';
  }).join("");
}

function buildAnalyticsInsights(insights) {
  return '<article class="teacher-analytics-chart-card"><h3>Class Insights</h3><div class="teacher-analytics-insights">'
    + (insights || []).map(function (insight) {
      return '<div>' + escapeHtml(insight) + '</div>';
    }).join("")
    + '</div></article>';
}

function buildAnalyticsStudentsPanel(snapshot) {
  var students = sortStudentAnalyticsRows(snapshot.students, state.analyticsStudentSort);
  var html = '<section class="teacher-analytics-panel">'
    + '<div class="teacher-analytics-toolbar"><h3>Students</h3><label>Sort<select id="analyticsStudentSort">'
    + buildGenericOption("highestXp", "Highest XP", state.analyticsStudentSort)
    + buildGenericOption("lowestXp", "Lowest XP", state.analyticsStudentSort)
    + buildGenericOption("highestCompletion", "Highest Completion", state.analyticsStudentSort)
    + buildGenericOption("lowestCompletion", "Lowest Completion", state.analyticsStudentSort)
    + buildGenericOption("mostActive", "Most Active", state.analyticsStudentSort)
    + buildGenericOption("leastActive", "Least Active", state.analyticsStudentSort)
    + '</select></label></div>';

  if (students.length === 0) {
    return html + buildEmptyState("students", "No student analytics yet.", "Analytics will appear once students are loaded or complete work.") + '</section>';
  }

  html += '<div class="teacher-analytics-table teacher-analytics-student-table">'
    + '<div class="teacher-analytics-table-head"><span>Student</span><span>Completion</span><span>XP</span><span>Stars</span><span>Mastery</span><span>Streak</span><span>Last Active</span><span>Mood Trend</span></div>';
  students.forEach(function (student) {
    html += '<button type="button" class="teacher-analytics-table-row" data-analytics-student-id="' + escapeHtml(student.studentId) + '">'
      + '<span><strong>' + escapeHtml(student.name) + '</strong><small>' + escapeHtml(student.className || "Class not recorded") + '</small></span>'
      + '<span>' + student.completionPercent + '%</span>'
      + '<span>' + student.xpEarned + '</span>'
      + '<span>' + student.starsEarned + '</span>'
      + '<span>' + student.masteryPercent + '%</span>'
      + '<span>' + student.currentStreak + '</span>'
      + '<span>' + escapeHtml(formatDate(student.lastActiveAt) || "Not active yet") + '</span>'
      + '<span>' + escapeHtml(student.moodTrend) + '</span>'
      + '</button>';
  });

  return html + '</div></section>';
}

function buildAnalyticsStudentDetail(snapshot) {
  var detail = createStudentAnalyticsDetail(state.selectedAnalyticsStudentId, snapshot);

  if (!detail) {
    return '<section class="teacher-analytics-panel">' + buildEmptyState("students", "Student analytics unavailable.", "Open a student from the Students analytics table.") + '</section>';
  }

  return '<section class="teacher-analytics-panel">'
    + '<div class="teacher-analytics-detail-head"><div><h3>' + escapeHtml(detail.student.name) + '</h3><p>' + escapeHtml(detail.student.className || "Class not recorded") + '</p></div><button type="button" class="teacher-secondary-btn" data-action="close-analytics-student">Back to Students</button></div>'
    + '<div class="teacher-analytics-card-grid compact">'
    + buildAnalyticsMetric("XP Earned", detail.student.xpEarned, "Total known XP")
    + buildAnalyticsMetric("Stars Earned", detail.student.starsEarned, "Total known stars")
    + buildAnalyticsMetric("Current Streak", detail.student.currentStreak, "Consecutive correct answers")
    + buildAnalyticsMetric("Last Active", formatDate(detail.student.lastActiveAt) || "Not active yet", "Recent activity")
    + '</div>'
    + '<div class="teacher-analytics-grid">'
    + buildAnalyticsTrendCard("Completion Over Time", detail.completionTrend)
    + buildAnalyticsTrendCard("Accuracy Over Time", detail.accuracyTrend)
    + buildAnalyticsMoodHistoryCard(detail.moodTrend)
    + buildAnalyticsObservations(detail.observations)
    + '</div>'
    + buildAnalyticsRecentActivities(detail.recentActivities)
    + '</section>';
}

function buildAnalyticsMoodHistoryCard(history) {
  return '<article class="teacher-analytics-chart-card"><h3>Mood Over Time</h3><div class="teacher-analytics-insights">'
    + ((history || []).length === 0 ? '<div>No mood check-ins recorded.</div>' : history.slice(0, 8).map(function (mood) {
      return '<div><strong>' + escapeHtml(mood.label) + '</strong><span>' + escapeHtml(formatDate(mood.millis) || "") + '</span></div>';
    }).join(""))
    + '</div></article>';
}

function buildAnalyticsObservations(observations) {
  return '<article class="teacher-analytics-chart-card"><h3>Support Observations</h3><div class="teacher-analytics-insights">'
    + (observations || []).map(function (observation) {
      return '<div>' + escapeHtml(observation) + '</div>';
    }).join("")
    + '</div></article>';
}

function buildAnalyticsRecentActivities(activities) {
  var html = '<section class="teacher-analytics-subsection"><h3>Recent Activities</h3>';

  if (!activities || activities.length === 0) {
    return html + buildEmptyState("reviews", "No recent activity recorded.", "Completed work will appear here.") + '</section>';
  }

  html += '<div class="teacher-analytics-table compact"><div class="teacher-analytics-table-head"><span>Activity</span><span>Score</span><span>Stars</span><span>Completion Date</span></div>';
  activities.forEach(function (activity) {
    html += '<div class="teacher-analytics-table-row"><span>' + escapeHtml(activity.activity) + '</span><span>' + escapeHtml(String(activity.score == null ? "Not recorded" : activity.score + "%")) + '</span><span>' + activity.stars + '</span><span>' + escapeHtml(formatDate(activity.completedAt) || "Not recorded") + '</span></div>';
  });

  return html + '</div></section>';
}

function buildAnalyticsActivitiesPanel(snapshot) {
  var html = '<section class="teacher-analytics-panel"><div class="teacher-analytics-card-grid compact">'
    + buildAnalyticsMetric("Most Completed", readTopActivity(snapshot.activities, "completedCount", true), "Activity with most completions")
    + buildAnalyticsMetric("Least Completed", readTopActivity(snapshot.activities, "completedCount", false), "Activity with fewest completions")
    + buildAnalyticsMetric("Highest Avg Score", readTopActivity(snapshot.activities, "averageScore", true), "Strongest known score")
    + buildAnalyticsMetric("Lowest Avg Score", readTopActivity(snapshot.activities, "averageScore", false), "May need review")
    + '</div>';

  if (snapshot.activities.length === 0) {
    return html + buildEmptyState("reviews", "No activity performance yet.", "Scores and completion records will appear as students complete work.") + '</section>';
  }

  html += '<div class="teacher-analytics-table"><div class="teacher-analytics-table-head"><span>Activity</span><span>Completion</span><span>Avg Score</span><span>Avg Attempts</span><span>Avg Time</span></div>';
  snapshot.activities.forEach(function (activity) {
    html += '<div class="teacher-analytics-table-row"><span><strong>' + escapeHtml(activity.title) + '</strong><small>' + escapeHtml(activity.type) + '</small></span><span>' + activity.completionRate + '%</span><span>' + activity.averageScore + '%</span><span>' + activity.averageAttempts + '</span><span>' + formatDuration(activity.averageTimeSeconds) + '</span></div>';
  });

  return html + '</div></section>';
}

function buildAnalyticsMoodPanel(snapshot) {
  var labels = Object.keys(snapshot.mood.distribution);
  var html = '<section class="teacher-analytics-panel">'
    + '<div class="teacher-analytics-card-grid compact">'
    + buildAnalyticsMetric("Check-ins", snapshot.mood.totalCheckedIn + " / " + snapshot.mood.totalStudents, "Students with mood data")
    + buildAnalyticsMetric("Check-in Rate", snapshot.mood.checkInRate + "%", "Current mood coverage")
    + '</div>'
    + '<div class="teacher-analytics-grid"><article class="teacher-analytics-chart-card"><h3>Daily Mood Distribution</h3><div class="teacher-analytics-insights mood">';

  if (labels.length === 0) {
    html += '<div>No mood check-ins recorded.</div>';
  } else {
    labels.forEach(function (label) {
      html += '<div><strong>' + escapeHtml(label) + '</strong><span>' + snapshot.mood.distribution[label] + '</span></div>';
    });
  }

  html += '</div></article><article class="teacher-analytics-chart-card"><h3>Student Mood History</h3><div class="teacher-analytics-insights">'
    + (snapshot.mood.histories.length === 0 ? '<div>No individual mood history recorded.</div>' : snapshot.mood.histories.slice(0, 10).map(function (row) {
      return '<div><strong>' + escapeHtml(row.studentName) + '</strong><span>' + escapeHtml(row.history.slice(0, 3).map(function (mood) { return mood.label; }).join(" -> ")) + '</span></div>';
    }).join(""))
    + '</div></article></div></section>';

  return html;
}

function buildAnalyticsMasteryPanel(snapshot) {
  return '<section class="teacher-analytics-panel">'
    + '<div class="teacher-analytics-card-grid compact">'
    + buildAnalyticsMetric("Mastered", snapshot.mastery.mastered, "90%+ score and 3 stars where known")
    + buildAnalyticsMetric("Completed", snapshot.mastery.completed, "Completed but not yet mastered")
    + buildAnalyticsMetric("In Progress", snapshot.mastery.inProgress, "Started but unfinished")
    + buildAnalyticsMetric("Not Started", snapshot.mastery.notStarted, "No progress recorded")
    + '</div>'
    + buildMasteryHeatmap(snapshot.mastery)
    + '</section>';
}

function buildMasteryHeatmap(mastery) {
  var html = '<div class="teacher-mastery-heatmap"><div class="teacher-mastery-row head"><span>Student</span>';
  var labels = mastery.courseLabels.length > 0 ? mastery.courseLabels : ["Overall"];

  labels.forEach(function (label) {
    html += '<span>' + escapeHtml(label) + '</span>';
  });
  html += '</div>';

  mastery.heatmapRows.slice(0, 14).forEach(function (row) {
    html += '<div class="teacher-mastery-row"><span>' + escapeHtml(row.studentName) + '</span>';
    row.cells.forEach(function (cell) {
      html += '<span class="mastery-' + escapeHtml(cell.status) + '">' + escapeHtml(formatMasteryStatus(cell.status)) + '</span>';
    });
    html += '</div>';
  });

  return html + '</div>';
}

function buildAnalyticsEngagementPanel(snapshot) {
  var html = '<section class="teacher-analytics-panel">'
    + '<div class="teacher-analytics-card-grid compact">'
    + buildAnalyticsMetric("Highly Engaged", snapshot.engagement.highlyEngaged, "Strong participation signals")
    + buildAnalyticsMetric("Moderately Engaged", snapshot.engagement.moderatelyEngaged, "Steady participation")
    + buildAnalyticsMetric("Needs Attention", snapshot.engagement.needsAttention, "Supportive follow-up may help")
    + buildAnalyticsMetric("Class Score", snapshot.engagement.averageScore + "%", "Composite engagement score")
    + '</div>';

  html += '<div class="teacher-analytics-table"><div class="teacher-analytics-table-head"><span>Student</span><span>Engagement</span><span>Score</span><span>Completion</span><span>XP</span></div>';
  snapshot.engagement.rows.forEach(function (student) {
    html += '<button type="button" class="teacher-analytics-table-row" data-analytics-student-id="' + escapeHtml(student.studentId) + '"><span>' + escapeHtml(student.name) + '</span><span>' + escapeHtml(student.engagementLabel) + '</span><span>' + student.engagementScore + '%</span><span>' + student.completionPercent + '%</span><span>' + student.xpEarned + '</span></button>';
  });

  return html + '</div></section>';
}

function getAnalyticsSnapshot() {
  return createTeacherAnalyticsSnapshot({
    students: getKnownStudents(),
    courses: getKnownCourses(),
    submissions: state.submissions || [],
    classes: state.classes || [],
    summary: state.summary || {}
  });
}

function readTopActivity(activities, key, descending) {
  if (!activities || activities.length === 0) {
    return "Not recorded";
  }

  var sorted = activities.slice().sort(function (left, right) {
    return descending ? (right[key] || 0) - (left[key] || 0) : (left[key] || 0) - (right[key] || 0);
  });

  return sorted[0].title || "Activity";
}

function formatDuration(seconds) {
  var value = Number(seconds) || 0;

  if (value < 60) {
    return Math.round(value) + "s";
  }

  return Math.round(value / 60) + "m";
}

function formatMasteryStatus(status) {
  if (status === "mastered") return "Mastered";
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In Progress";
  return "Needs Support";
}

function buildActivityTab() {
  var recentItems = readRecentActivityItems();
  var html = '<section class="teacher-card-section teacher-wide-section"><div class="teacher-section-title"><div><h2>Activity</h2><p>Recent classroom activity</p></div>' + buildSectionGlyphSvg("reviews") + '</div>';

  if (recentItems.length === 0) {
    return html + buildEmptyState("reviews", "No recent activity yet.", "Course progress, reviews, and student activity will appear here when available.") + '</section>';
  }

  html += '<div class="teacher-review-list">';
  recentItems.forEach(function (item) {
    html += '<article class="teacher-class-course-card"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.detail) + '</span><small>' + escapeHtml(item.dateLabel) + '</small></article>';
  });

  return html + '</div></section>';
}

function buildScheduleTab() {
  return '<section class="teacher-card-section teacher-wide-section"><div class="teacher-section-title"><div><h2>Schedule</h2><p>Lessons and classroom timing</p></div>' + buildSectionGlyphSvg("classes") + '</div>'
    + buildEmptyState("classes", "Schedule tools are not available yet.", "Class schedules will appear here when schedule data is connected.")
    + '</section>';
}

function buildSubmissionCard(submission) {
  var file = readFirstFile(submission);
  var isPending = state.isReviewing === submission.id;
  var className = resolveSubmissionClassName(submission);
  var courseTitle = submission.courseTitle || submission.courseName || submission.courseId || "Course";
  var moduleTitle = submission.moduleTitle || submission.moduleName || submission.moduleId || "Module";
  var taskTitle = submission.taskTitle || submission.stepTitle || submission.stepId || "External Task";
  var currentStatus = submission.reviewStatus || "pending";

  return '<article class="teacher-submission-card">'
    + buildSubmissionRibbonSvg()
    + '<div class="teacher-submission-head"><div><strong>' + escapeHtml(submission.studentName || submission.studentId || "Student") + '</strong>'
    + '<span>' + escapeHtml(readSubmissionContext(submission)) + '</span></div>'
    + buildReviewStatusBadge(currentStatus) + '</div>'
    + '<div class="teacher-submission-meta">'
    + '<span>Class: ' + escapeHtml(className || "Class") + '</span>'
    + '<span>Course: ' + escapeHtml(courseTitle) + '</span>'
    + '<span>Module: ' + escapeHtml(moduleTitle) + '</span>'
    + '<span>Task: ' + escapeHtml(taskTitle) + '</span>'
    + '<span>Submitted: ' + escapeHtml(formatDate(submission.createdAt) || "Recently") + '</span>'
    + '<span>Attempt: ' + escapeHtml(String(submission.attemptNumber || 1)) + '</span>'
    + '</div>'
    + buildProofPreview(file)
    + '<div class="teacher-submission-notes"><p class="teacher-note"><strong>Student note</strong><span>' + escapeHtml(submission.studentNote || "No student note.") + '</span></p>'
    + '<p class="teacher-note teacher-feedback-note"><strong>Teacher feedback</strong><span>' + escapeHtml(submission.teacherFeedback || "No feedback saved yet.") + '</span></p></div>'
    + '<label class="teacher-feedback-label">Teacher feedback<textarea data-feedback-id="' + escapeHtml(submission.id) + '" rows="3" placeholder="Feedback for the student">' + escapeHtml(submission.teacherFeedback || "") + '</textarea></label>'
    + '<div class="teacher-quick-actions">'
    + buildReviewButton(submission.id, "complete", "Mark Complete", isPending)
    + buildOpenFileAction(file)
    + '<button type="button" class="teacher-secondary-btn" data-action="view-student-history" data-student-id="' + escapeHtml(submission.studentId || "") + '" data-student-name="' + escapeHtml(submission.studentName || "") + '">View student history</button>'
    + '<button type="button" class="teacher-secondary-btn" data-submission-id="' + escapeHtml(submission.id) + '" data-review-status="' + escapeHtml(readFeedbackSaveStatus(submission)) + '"' + disabled(isPending) + '>' + (isPending ? buildSavingSvg() + "Saving..." : "Save Feedback") + '</button>'
    + '</div>'
    + '<div class="teacher-review-actions">'
    + buildReviewButton(submission.id, "complete", "Complete", isPending)
    + buildReviewButton(submission.id, "needsWork", "Needs Work", isPending)
    + buildReviewButton(submission.id, "incomplete", "Incomplete", isPending)
    + '</div>'
    + '</article>';
}

function buildReviewButton(submissionId, status, label, isPending) {
  return '<button type="button" class="teacher-review-btn ' + escapeHtml(status) + '" data-submission-id="' + escapeHtml(submissionId) + '" data-review-status="' + escapeHtml(status) + '"' + disabled(isPending) + '>' + (isPending ? buildSavingSvg() + "Saving..." : buildReviewButtonSvg(status) + label) + '</button>';
}

function buildReviewStatusBadge(status) {
  return createStatusBadge(status || "pending", {
    className: "teacher-status-pill",
    statusClassPrefix: "",
    tagName: "b",
    label: formatReviewStatus(status || "pending")
  });
}

function buildProofPreview(file) {
  if (!file) {
    return '<div class="teacher-proof empty">' + buildFileSvg("empty") + '<span>No uploaded file found.</span></div>';
  }

  if (file.contentType && file.contentType.indexOf("image/") === 0) {
    return '<a class="teacher-proof image" href="' + escapeHtml(file.downloadUrl || "#") + '" target="_blank" rel="noopener">'
      + '<img src="' + escapeHtml(file.downloadUrl || "") + '" alt="' + escapeHtml(file.name || "Uploaded proof") + '">'
      + '<span>' + escapeHtml(file.name || "Open uploaded proof") + '</span></a>';
  }

  return '<a class="teacher-proof file" href="' + escapeHtml(file.downloadUrl || "#") + '" target="_blank" rel="noopener">' + buildFileSvg("file") + '<span>Open uploaded file: ' + escapeHtml(file.name || "proof") + '</span></a>';
}

function buildClassOptions() {
  return (state.classes || []).map(function (classRecord) {
    return '<option value="' + escapeHtml(classRecord.id) + '"' + selected(state.reviewClassId, classRecord.id) + '>' + escapeHtml(classRecord.name) + '</option>';
  }).join("");
}

function buildReviewCourseOptions() {
  var seen = {};
  var options = [];

  (state.courses || []).forEach(function (course) {
    var courseId = course.courseId || course.id || "";
    if (!courseId || seen[courseId]) {
      return;
    }

    seen[courseId] = true;
    options.push({
      id: courseId,
      title: course.courseTitle || course.title || courseId
    });
  });

  (state.submissions || []).forEach(function (submission) {
    var courseId = submission.courseId || "";
    if (!courseId || seen[courseId]) {
      return;
    }

    seen[courseId] = true;
    options.push({
      id: courseId,
      title: submission.courseTitle || submission.courseName || courseId
    });
  });

  return options.map(function (course) {
    return '<option value="' + escapeHtml(course.id) + '"' + selected(state.reviewCourseId, course.id) + '>' + escapeHtml(course.title) + '</option>';
  }).join("");
}

function buildReviewModuleOptions() {
  var seen = {};
  var options = [];

  (state.submissions || []).forEach(function (submission) {
    var moduleId = submission.moduleId || "";
    if (!moduleId || seen[moduleId]) {
      return;
    }

    if (state.reviewCourseId && submission.courseId !== state.reviewCourseId) {
      return;
    }

    seen[moduleId] = true;
    options.push({
      id: moduleId,
      title: submission.moduleTitle || submission.moduleName || moduleId
    });
  });

  return options.sort(function (a, b) {
    return a.title.localeCompare(b.title);
  }).map(function (moduleRecord) {
    return '<option value="' + escapeHtml(moduleRecord.id) + '"' + selected(state.reviewModuleId, moduleRecord.id) + '>' + escapeHtml(moduleRecord.title) + '</option>';
  }).join("");
}

function buildStatusOption(value, label) {
  return '<option value="' + escapeHtml(value) + '"' + selected(state.statusFilter, value) + '>' + escapeHtml(label) + '</option>';
}

function buildReviewEmptyState() {
  var hasRawSubmissions = (state.submissions || []).length > 0;

  if (!hasRawSubmissions && state.statusFilter === "pending") {
    return buildEmptyState("reviews", "No pending reviews.", "Submitted External Task work that needs review will appear here.");
  }

  return buildEmptyState("reviews", "No submissions match these filters.", "Try a different class, course, status, or student search.");
}

function getFilteredReviewSubmissions() {
  var search = String(state.reviewStudentSearch || "").trim().toLowerCase();
  var filtered = (state.submissions || []).filter(function (submission) {
    return matchesReviewStatus(submission)
      && matchesReviewClass(submission)
      && matchesReviewCourse(submission)
      && matchesReviewModule(submission)
      && matchesStudentSearch(submission, search);
  });

  console.info("[teacher-review:filters]", {
    classId: state.reviewClassId || "",
    courseId: state.reviewCourseId || "",
    moduleId: state.reviewModuleId || "",
    status: state.statusFilter || "pending",
    search: search,
    visibleSubmissionCount: filtered.length,
    totalSubmissionCount: (state.submissions || []).length
  });

  return filtered;
}

function matchesReviewStatus(submission) {
  if (state.statusFilter === "all") {
    return true;
  }

  return (submission.reviewStatus || "pending") === (state.statusFilter || "pending");
}

function matchesReviewClass(submission) {
  if (!state.reviewClassId) {
    return true;
  }

  return submission.classId === state.reviewClassId
    || submission.targetId === state.reviewClassId
    || submission.targetClassId === state.reviewClassId;
}

function matchesReviewCourse(submission) {
  if (!state.reviewCourseId) {
    return true;
  }

  return submission.courseId === state.reviewCourseId;
}

function matchesReviewModule(submission) {
  if (!state.reviewModuleId) {
    return true;
  }

  return submission.moduleId === state.reviewModuleId;
}

function matchesStudentSearch(submission, search) {
  if (!search) {
    return true;
  }

  return String(submission.studentName || submission.studentId || "").toLowerCase().indexOf(search) !== -1;
}

function readReviewStatusForQuery() {
  return state.statusFilter === "all" ? "" : state.statusFilter;
}

function buildOpenFileAction(file) {
  if (!file || !file.downloadUrl) {
    return '<button type="button" class="teacher-secondary-btn" disabled>Open file</button>';
  }

  return '<a class="teacher-secondary-btn teacher-open-file-btn" href="' + escapeHtml(file.downloadUrl) + '" target="_blank" rel="noopener">Open file</a>';
}

function readFeedbackSaveStatus(submission) {
  var status = submission.reviewStatus || "";
  if (status === "complete" || status === "needsWork" || status === "incomplete") {
    return status;
  }

  return "needsWork";
}

function buildStatusMessages() {
  var html = "";

  if (state.message) {
    html += '<div class="teacher-message">' + escapeHtml(state.message) + '</div>';
  }

  if (state.error) {
    html += '<div class="teacher-error">' + escapeHtml(state.error) + '</div>';
  }

  return html;
}

function buildClassFilterOptions(selectedClassId) {
  return (state.classes || []).map(function (classRecord) {
    return '<option value="' + escapeHtml(classRecord.id) + '"' + selected(selectedClassId, classRecord.id) + '>' + escapeHtml(classRecord.name || "Class") + '</option>';
  }).join("");
}

function buildGenericOption(value, label, currentValue) {
  return '<option value="' + escapeHtml(value) + '"' + selected(currentValue, value) + '>' + escapeHtml(label) + '</option>';
}

function getStudentsForInlinePanel() {
  if (state.selectedClassId) {
    return getSelectedClassStudents();
  }

  return getKnownStudents().slice(0, 8);
}

function getFilteredStudentsForStudentsTab() {
  var students = state.studentClassFilterId
    ? readStudentsForClassFilter(state.studentClassFilterId)
    : getKnownStudents();

  return students.filter(matchesStudentStatusFilter);
}

function getFilteredCoursesForCoursesTab() {
  if (state.courseClassFilterId) {
    return readCoursesForClassFilter(state.courseClassFilterId);
  }

  return getKnownCourses();
}

function readStudentsForClassFilter(classId) {
  if (!classId) {
    return getKnownStudents();
  }

  if (state.studentsByClassId && Array.isArray(state.studentsByClassId[classId])) {
    return state.studentsByClassId[classId];
  }

  return filterStudentsForClass(state.students || [], classId);
}

function readCoursesForClassFilter(classId) {
  if (!classId) {
    return getKnownCourses();
  }

  if (state.coursesByClassId && Array.isArray(state.coursesByClassId[classId])) {
    return state.coursesByClassId[classId];
  }

  return filterCoursesForClass(state.courses || [], classId);
}

function getKnownStudents() {
  var students = [];
  appendUniqueRecords(students, state.allStudents || []);
  appendUniqueRecords(students, state.students || []);
  Object.keys(state.studentsByClassId || {}).forEach(function (classId) {
    appendUniqueRecords(students, state.studentsByClassId[classId] || []);
  });
  return students;
}

function getKnownCourses() {
  var courses = [];
  appendUniqueRecords(courses, state.allCourses || []);
  appendUniqueRecords(courses, state.courses || []);
  Object.keys(state.coursesByClassId || {}).forEach(function (classId) {
    appendUniqueRecords(courses, state.coursesByClassId[classId] || []);
  });
  return courses;
}

function countKnownStudents() {
  return getKnownStudents().length;
}

function countKnownCourses() {
  return getKnownCourses().length;
}

function countNeedsWorkStudents() {
  return getKnownStudents().filter(function (student) {
    return matchesStudentStatus(student, "needsWork");
  }).length;
}

function countReviewsByStatus(status) {
  return (state.submissions || []).filter(function (submission) {
    return (submission.reviewStatus || "pending") === status;
  }).length;
}

function matchesStudentStatusFilter(student) {
  return matchesStudentStatus(student, state.studentStatusFilter || "all");
}

function matchesStudentStatus(student, filter) {
  var progress = readStudentProgressPercent(student);
  var statusLabel = readStudentStatusLabel(student).toLowerCase();

  if (!filter || filter === "all") {
    return true;
  }

  if (filter === "needsWork") {
    return (student.pendingSubmissionsCount || 0) > 0 || statusLabel.indexOf("needs") !== -1;
  }

  if (filter === "noProgress") {
    return progress === 0 || student.currentCourseProgress === "No progress yet";
  }

  if (filter === "steady") {
    return statusLabel === "online" || statusLabel === "steady" || statusLabel === "unknown";
  }

  return true;
}

function appendUniqueRecords(target, records) {
  (records || []).forEach(function (record) {
    if (!record || !record.id) {
      return;
    }

    if (!target.some(function (item) { return item && item.id === record.id; })) {
      target.push(record);
    }
  });
}

function buildStudentsByClassId(students) {
  var byClassId = {};

  (students || []).forEach(function (student) {
    (student.classIds || [student.classId || ""]).forEach(function (classId) {
      if (!classId) {
        return;
      }

      if (!byClassId[classId]) {
        byClassId[classId] = [];
      }

      byClassId[classId].push(student);
    });
  });

  return byClassId;
}

function buildCoursesByClassId(courses) {
  var byClassId = {};

  (courses || []).forEach(function (course) {
    var classId = course.classId || course.targetId || course.targetClassId || "";

    if (!classId) {
      return;
    }

    if (!byClassId[classId]) {
      byClassId[classId] = [];
    }

    byClassId[classId].push(course);
  });

  return byClassId;
}

function createSingleClassRecord(classId, records) {
  var result = {};
  result[classId] = records || [];
  return result;
}

function getSelectedCourseDetail() {
  if (!state.selectedCourseId || !state.courseDetailsById) {
    return null;
  }

  return state.courseDetailsById[state.selectedCourseId] || null;
}

function findCourseByAssignmentOrCourseId(assignmentId, courseId) {
  var courses = getKnownCourses();

  return courses.find(function (course) {
    return course && (
      (assignmentId && course.id === assignmentId)
      || (assignmentId && course.assignmentId === assignmentId)
      || (assignmentId && course.courseAssignmentId === assignmentId)
      || (courseId && course.courseId === courseId)
      || (courseId && course.id === courseId)
    );
  }) || null;
}

function readStudentsForCourse(course) {
  if (!course) {
    return [];
  }

  if (course.classId || course.targetId || course.targetClassId) {
    return readStudentsForClassFilter(course.classId || course.targetId || course.targetClassId);
  }

  return [];
}

function readCoursesForStudent(student) {
  if (!student) {
    return [];
  }

  var classId = student.classId || (student.classIds && student.classIds[0]) || "";

  if (!classId) {
    return [];
  }

  return readCoursesForClassFilter(classId);
}

function readCourseModulesFromDetail(detail, course) {
  if (detail && Array.isArray(detail.modules)) {
    return detail.modules;
  }

  if (detail && detail.course && Array.isArray(detail.course.modules)) {
    return detail.course.modules;
  }

  if (course && Array.isArray(course.modules)) {
    return course.modules;
  }

  return [];
}

function readModuleTitle(moduleRecord) {
  return readFirstText(moduleRecord, ["title", "name", "displayName"]) || "Module";
}

function readCourseAssignedClassLabel(course) {
  var classRecord = findClassForCourse(course);
  return course && (course.targetName || course.className) ? (course.targetName || course.className) : (classRecord ? classRecord.name : "Assigned class");
}

function findClassForCourse(course) {
  var classId = course ? (course.classId || course.targetId || course.targetClassId || "") : "";

  if (!classId) {
    return null;
  }

  return (state.classes || []).find(function (classRecord) {
    return classRecord && classRecord.id === classId;
  }) || null;
}

function readStudentClassName(student) {
  var classId = student ? (student.classId || (student.classIds && student.classIds[0]) || "") : "";
  var classRecord = (state.classes || []).find(function (item) {
    return item && item.id === classId;
  }) || null;

  return student && (student.className || student.classLabel) ? (student.className || student.classLabel) : (classRecord ? classRecord.name : "");
}

function readRecentActivityItems() {
  return getKnownStudents().filter(function (student) {
    return readMillis(student.lastActiveAt) > 0;
  }).sort(function (left, right) {
    return readMillis(right.lastActiveAt) - readMillis(left.lastActiveAt);
  }).slice(0, 8).map(function (student) {
    return {
      title: student.name || "Student",
      detail: student.currentCourseProgress || "Student activity",
      dateLabel: formatDate(student.lastActiveAt) || "Recently"
    };
  });
}

function getSelectedClassRecord() {
  var detail = getSelectedClassDetail();

  if (detail && detail.classRecord) {
    return detail.classRecord;
  }

  return (state.classes || []).find(function (classRecord) {
    return classRecord && classRecord.id === state.selectedClassId;
  }) || null;
}

function getSelectedClassDetail() {
  if (!state.selectedClassId || !state.classDetailsById) {
    return null;
  }

  return state.classDetailsById[state.selectedClassId] || null;
}

function getSelectedClassDetailErrors() {
  var detail = getSelectedClassDetail();

  if (!detail || !detail.errors || typeof detail.errors !== "object") {
    return {};
  }

  return detail.errors;
}

function getSelectedStudentRecord() {
  var detailStudents = getSelectedClassStudents();
  var detailStudent = detailStudents.find(function (student) {
    return student && student.id === state.selectedStudentId;
  }) || null;

  if (detailStudent) {
    return detailStudent;
  }

  return (state.students || []).find(function (student) {
    return student && student.id === state.selectedStudentId;
  }) || null;
}

function getSelectedClassStudents() {
  var detail = getSelectedClassDetail();

  if (detail && Array.isArray(detail.students)) {
    return detail.students;
  }

  if (!state.selectedClassId) {
    return [];
  }

  return filterStudentsForSelectedClass(state.students || []);
}

function getSelectedClassCourses() {
  var detail = getSelectedClassDetail();

  if (detail && Array.isArray(detail.courses)) {
    return detail.courses;
  }

  if (!state.selectedClassId) {
    return [];
  }

  return filterCoursesForClass(state.courses || [], state.selectedClassId);
}

function filterCoursesForClass(courses, classId) {
  return (courses || []).filter(function (course) {
    return course.classId === classId
      || course.targetId === classId
      || course.targetClassId === classId;
  });
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function countStudentsWithMoodToday(students) {
  var count = 0;
  var index = 0;

  while (index < students.length) {
    if (readStudentMoodToday(students[index])) {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}

function countStudentsByAttendance(students, expectedStatus) {
  var count = 0;
  var index = 0;

  while (index < students.length) {
    if (readAttendanceToday(students[index]).toLowerCase() === expectedStatus) {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}

function buildMoodDistribution(students) {
  var distribution = {};
  var index = 0;

  while (index < students.length) {
    var label = normalizeMoodLabel(readStudentMoodToday(students[index]));
    if (label) {
      distribution[label] = (distribution[label] || 0) + 1;
    }
    index = index + 1;
  }

  return distribution;
}

function readStudentMoodToday(student) {
  return readFirstText(student, [
    "moodToday",
    "todayMood",
    "currentMood",
    "mood",
    "emotionalState",
    "emotionalCheckInMood"
  ]) || readNestedMood(student);
}

function readNestedMood(student) {
  var checkIn = student && (student.todayCheckIn || student.latestCheckIn || student.emotionalCheckIn) ? (student.todayCheckIn || student.latestCheckIn || student.emotionalCheckIn) : null;

  if (!checkIn || typeof checkIn !== "object") {
    return "";
  }

  return readFirstText(checkIn, ["mood", "moodLabel", "feeling", "state"]);
}

function readAttendanceToday(student) {
  var value = readFirstText(student, [
    "attendanceToday",
    "todayAttendance",
    "attendanceStatus",
    "statusToday"
  ]);

  if (!value && typeof (student && student.presentToday) === "boolean") {
    value = student.presentToday ? "present" : "absent";
  }

  if (!value) {
    return "Not recorded";
  }

  return formatTitle(value);
}

function readStudentCourseTitle(student) {
  return readFirstText(student, [
    "currentCourseTitle",
    "currentCourseName",
    "recentCourseTitle",
    "latestCourseTitle"
  ]) || readFirstSelectedClassCourseTitle();
}

function readFirstSelectedClassCourseTitle() {
  var courses = getSelectedClassCourses();

  if (courses.length === 0) {
    return "";
  }

  return courses[0].courseTitle || courses[0].title || "";
}

function readStudentProgressPercent(student) {
  var value = readFirstNumber(student, [
    "progressPercent",
    "currentCourseProgressPercent",
    "courseProgressPercent",
    "overallProgressPercent"
  ]);

  if (value == null) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function readStudentProfileProgress(student) {
  var progress = readStudentProgressPercent(student);
  var course = readStudentCourseTitle(student);

  if (progress == null && !course) {
    return student.currentCourseProgress || "Not recorded";
  }

  if (progress == null) {
    return course + " | Progress not recorded";
  }

  return (course || "Assigned course") + " | " + progress + "% complete";
}

function readStudentStatusLabel(student) {
  var rawStatus = readFirstText(student, ["todayStatus", "presenceStatus", "onlineStatus", "status"]);
  var normalizedStatus = normalizeStatus(rawStatus);
  var progress = readStudentProgressPercent(student);

  if ((student.pendingSubmissionsCount || 0) > 0) {
    return "Needs Help";
  }

  if (normalizedStatus) {
    return normalizedStatus;
  }

  if (progress === 0 || student.currentCourseProgress === "No progress yet") {
    return "Not Started";
  }

  return "Unknown";
}

function normalizeStatus(status) {
  var value = String(status || "").trim().toLowerCase();

  if (value === "online" || value === "active") return "Online";
  if (value === "idle" || value === "away") return "Idle";
  if (value === "needshelp" || value === "needs_help" || value === "needs help") return "Needs Help";
  if (value === "notstarted" || value === "not_started" || value === "not started") return "Not Started";
  if (value === "unknown") return "Unknown";
  return "";
}

function readStudentStatusClass(statusLabel) {
  var value = String(statusLabel || "").toLowerCase().replace(/\s+/g, "-");
  return "status-" + (value || "unknown");
}

function normalizeMoodLabel(mood) {
  var value = String(mood || "").trim().toLowerCase();

  if (!value) return "";
  if (value === "happy" || value === "good" || value === "great") return "Happy";
  if (value === "neutral" || value === "okay" || value === "ok") return "Neutral";
  if (value === "tired" || value === "sleepy") return "Tired";
  if (value === "worried" || value === "anxious" || value === "nervous") return "Worried";
  if (value === "overloaded" || value === "overwhelmed") return "Overloaded";
  return formatTitle(value);
}

function readCourseModuleLabel(course) {
  var moduleCount = readFirstNumber(course, ["moduleCount", "modulesCount", "totalModules"]);

  if (moduleCount == null && Array.isArray(course.modules)) {
    moduleCount = course.modules.length;
  }

  if (moduleCount == null) {
    return "Modules not recorded";
  }

  return moduleCount + " module" + (moduleCount === 1 ? "" : "s");
}

function readCourseProgressSummary(course) {
  var progress = readFirstNumber(course, ["progressPercent", "overallProgressPercent", "averageProgressPercent"]);

  if (progress != null) {
    return Math.round(progress) + "% average progress";
  }

  if ((course.pendingSubmissionsCount || 0) > 0) {
    return course.pendingSubmissionsCount + " pending review" + (course.pendingSubmissionsCount === 1 ? "" : "s");
  }

  if ((course.studentCount || 0) > 0) {
    return course.studentCount + " student" + (course.studentCount === 1 ? "" : "s") + " assigned";
  }

  return "Progress not recorded";
}

function formatCourseStatus(status) {
  var value = String(status || "").trim();

  if (!value) {
    return "Not recorded";
  }

  if (value === "active") return "Ready";
  if (value === "published") return "Published";
  return formatTitle(value);
}

function readIntentionPointTotal(student) {
  var directValue = readFirstNumber(student, ["intentionPoints", "points", "pointBalance", "totalPoints"]);

  if (directValue != null) {
    return directValue;
  }

  if (!student || typeof student.intentionPoints !== "object") {
    return "Not recorded";
  }

  return Object.keys(student.intentionPoints).reduce(function (total, key) {
    return total + (Number(student.intentionPoints[key]) || 0);
  }, 0);
}

function readFirstText(source, keys) {
  var index = 0;

  while (source && index < keys.length) {
    if (typeof source[keys[index]] === "string" && source[keys[index]].trim()) {
      return source[keys[index]].trim();
    }
    index = index + 1;
  }

  return "";
}

function readFirstNumber(source, keys) {
  var index = 0;

  while (source && index < keys.length) {
    if (typeof source[keys[index]] === "number" && Number.isFinite(source[keys[index]])) {
      return source[keys[index]];
    }

    if (typeof source[keys[index]] === "string" && source[keys[index]].trim() && Number.isFinite(Number(source[keys[index]]))) {
      return Number(source[keys[index]]);
    }

    index = index + 1;
  }

  return null;
}

function formatTitle(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
}

function filterStudentsForSelectedClass(students) {
  if (!state.selectedClassId) {
    return students;
  }

  return filterStudentsForClass(students, state.selectedClassId);
}

function filterStudentsForClass(students, classId) {
  return (students || []).filter(function (student) {
    return (student.classIds || []).indexOf(classId) !== -1 || student.classId === classId;
  });
}

function readSubmissionContext(submission) {
  var parts = [];
  addPart(parts, "Class", resolveSubmissionClassName(submission) || submission.classId);
  addPart(parts, "Course", submission.courseTitle || submission.courseId);
  addPart(parts, "Module", submission.moduleTitle || submission.moduleId);
  return parts.join(" | ") || "External Task";
}

function resolveSubmissionClassName(submission) {
  var classId = submission.classId || submission.targetClassId || submission.targetId || "";
  var classRecord = (state.classes || []).find(function (item) {
    return item.id === classId;
  });

  return submission.className || submission.targetName || (classRecord ? classRecord.name : "");
}

function readFirstFile(submission) {
  return submission && Array.isArray(submission.files) && submission.files.length > 0 ? submission.files[0] : null;
}

function buildStudentAvatar(student) {
  if (student.photoUrl) {
    return '<img src="' + escapeHtml(student.photoUrl) + '" alt="">';
  }

  return escapeHtml((student.name || "S").slice(0, 1).toUpperCase());
}

function addPart(parts, label, value) {
  if (value) {
    parts.push(label + " " + value);
  }
}

function countPending(submissions) {
  return (submissions || []).filter(function (submission) {
    return submission.reviewStatus === "pending";
  }).length;
}

function formatReviewStatus(status) {
  if (status === "complete") return "Complete";
  if (status === "needsWork") return "Needs Work";
  if (status === "incomplete") return "Incomplete";
  return "Pending";
}

function formatDate(value) {
  var millis = readMillis(value);

  if (!millis) {
    return "";
  }

  return new Date(millis).toLocaleString();
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

function isUnauthorizedError(error) {
  var message = error && error.message ? error.message.toLowerCase() : "";
  return message.indexOf("not authorized") !== -1
    || message.indexOf("teacher") !== -1
    || message.indexOf("role") !== -1;
}

function readLoginMessage() {
  if (!window.sessionStorage) {
    return "";
  }

  var message = window.sessionStorage.getItem("oquwayTeacherLoginMessage") || "";
  window.sessionStorage.removeItem("oquwayTeacherLoginMessage");
  return message;
}

function disabled(value) {
  return value ? " disabled" : "";
}

function selected(currentValue, optionValue) {
  return currentValue === optionValue ? " selected" : "";
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value || "");
  }

  return String(value || "").replace(/"/g, '\\"');
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

render();


