import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.86-dev-workflow";
import { teacherDashboardService } from "./ui/services/teacherDashboardService.js?v=1.1.117-student-identity-binding";
import {
  createEmptyState,
  createLoadingState,
  createStatusBadge
} from "../../../packages/ui/index.js?v=1.1.117-student-identity-binding";

var app = document.getElementById("app");
var state = {
  authReady: false,
  isLoading: true,
  isLoggingIn: false,
  isResetting: false,
  isReviewing: "",
  teacher: null,
  classes: [],
  courses: [],
  students: [],
  submissions: [],
  summary: null,
  selectedClassId: "",
  selectedCourseId: "",
  activeTab: "classes",
  reviewClassId: "",
  reviewCourseId: "",
  reviewModuleId: "",
  statusFilter: "pending",
  reviewStudentSearch: "",
  isReviewQueueLoading: false,
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
      teacher: null,
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
      reviewStatus: readReviewStatusForQuery() || "pending",
      classId: state.selectedClassId
    });

    setState({
      isLoading: false,
      isLoggingIn: false,
      teacher: data.teacher,
      classes: data.classes || [],
      courses: data.courses || [],
      students: data.students || [],
      submissions: data.submissions || [],
      summary: data.summary || null,
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
      courses: [],
      students: [],
      submissions: [],
      summary: null,
      error: error.message,
      message: ""
    });
  }
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
      message: "",
      error: ""
    });
  } catch (error) {
    setState({
      isReviewQueueLoading: false,
      error: error.message,
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
  var studentHistoryButton = event.target.closest("[data-action=view-student-history]");
  var classButton = event.target.closest("[data-class-id]");
  var courseButton = event.target.closest("[data-course-assignment-id]");
  var tabButton = event.target.closest("[data-teacher-tab]");
  var reviewButton = event.target.closest("[data-review-status]");

  if (logoutButton) {
    await teacherDashboardService.logout();
    return;
  }

  if (refreshButton) {
    await loadDashboard();
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

  if (tabButton) {
    setState({
      activeTab: tabButton.getAttribute("data-teacher-tab") || "classes"
    });
    return;
  }

  if (classButton) {
    setState({
      selectedClassId: classButton.getAttribute("data-class-id") || "",
      activeTab: "classes"
    });
    await loadDashboard();
    return;
  }

  if (courseButton) {
    setState({
      selectedCourseId: courseButton.getAttribute("data-course-assignment-id") || "",
      activeTab: "courses"
    });
    return;
  }

  if (reviewButton) {
    await reviewSubmission(reviewButton);
  }
}

async function handleChange(event) {
  var statusSelect = event.target.closest("#reviewStatusFilter");
  var classSelect = event.target.closest("#reviewClassFilter");
  var courseSelect = event.target.closest("#reviewCourseFilter");
  var moduleSelect = event.target.closest("#reviewModuleFilter");

  if (!statusSelect && !classSelect && !courseSelect && !moduleSelect) {
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
    + buildMetrics()
    + buildTeacherTabs()
    + buildActiveTeacherTab()
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
    + buildMetricCard(summary.classCount || state.classes.length, "My Classes", "classes")
    + buildMetricCard(summary.courseCount || state.courses.length, "My Courses", "courses")
    + buildMetricCard(summary.pendingSubmissionsCount || countPending(state.submissions), "Pending Reviews", "reviews")
    + buildMetricCard(summary.studentCount || state.students.length, "Students", "students")
    + '</section>';
}

function buildMetricCard(value, label, tone) {
  return '<article class="teacher-metric teacher-metric-' + escapeHtml(tone) + '">'
    + buildMetricSvg(tone)
    + '<strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></article>';
}

function buildTeacherTabs() {
  return '<nav class="teacher-tabs" aria-label="Teacher dashboard sections">'
    + buildTeacherTabButton("classes", "Classes", state.classes.length)
    + buildTeacherTabButton("courses", "Courses", state.courses.length)
    + buildTeacherTabButton("reviews", "Reviews", countPending(state.submissions))
    + '</nav>';
}

function buildTeacherTabButton(tabName, label, count) {
  return '<button type="button" class="teacher-tab' + (state.activeTab === tabName ? " active" : "") + '" data-teacher-tab="' + escapeHtml(tabName) + '">'
    + '<strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(String(count)) + '</span></button>';
}

function buildActiveTeacherTab() {
  if (state.activeTab === "courses") {
    return buildCourseCards();
  }

  if (state.activeTab === "reviews") {
    return buildReviewQueue();
  }

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

function buildCourseCards() {
  var courses = state.courses || [];
  var html = '<section class="teacher-card-section teacher-wide-section"><div class="teacher-section-title"><div><h2>My Courses</h2><p>Course assignments owned by this teacher</p></div>' + buildSectionGlyphSvg("courses") + '</div>';

  if (courses.length === 0) {
    return html + buildEmptyState("courses", "No course assignments assigned yet.", "Responsible teacher and assistant course assignments will appear here.") + '</section>';
  }

  html += '<div class="teacher-course-list">';
  courses.forEach(function (course) {
    html += '<button type="button" class="teacher-course-card' + (state.selectedCourseId === course.id ? " active" : "") + '" data-course-assignment-id="' + escapeHtml(course.id) + '">'
      + buildCourseBookSvg(course.courseTitle || course.courseId || "course")
      + '<div><strong>' + escapeHtml(course.courseTitle || "Untitled Course") + '</strong>'
      + '<span>' + escapeHtml(course.targetName || "Assigned target") + '</span></div>'
      + '<b>' + escapeHtml(course.ownershipRole || "Assigned") + '</b>'
      + '<small>' + course.studentCount + ' students | ' + course.pendingSubmissionsCount + ' pending reviews</small>'
      + '</button>';
  });

  return html + '</div></section>';
}

function buildStudentsView() {
  var students = filterStudentsForSelectedClass(state.students || []);
  var html = '<section class="teacher-card-section"><div class="teacher-section-title"><div><h2>Students</h2><p>Progress and review signals</p></div>' + buildSectionGlyphSvg("students") + '</div>';

  if (students.length === 0) {
    return html + buildEmptyState("students", "No students found.", "Students assigned to this class will appear here.") + '</section>';
  }

  html += '<div class="teacher-student-list">';
  students.forEach(function (student) {
    html += '<article class="teacher-student-row">'
      + '<div class="teacher-avatar">' + buildStudentAvatar(student) + '</div>'
      + '<div><strong>' + escapeHtml(student.name) + '</strong><span>' + escapeHtml(student.currentCourseProgress || "No progress yet") + '</span></div>'
      + buildStudentPulseSvg(student.pendingSubmissionsCount > 0)
      + '<div><span>' + escapeHtml(formatDate(student.lastActiveAt) || "No recent activity") + '</span><small>' + student.pendingSubmissionsCount + ' pending</small></div>'
      + '<b class="' + (student.pendingSubmissionsCount > 0 ? "needs-review" : "steady") + '">' + (student.pendingSubmissionsCount > 0 ? "Needs review" : "Steady") + '</b>'
      + '</article>';
  });

  return html + '</div></section>';
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

  if (submissions.length === 0) {
    return html + buildReviewEmptyState() + '</section>';
  }

  html += '<div class="teacher-review-list">';
  submissions.forEach(function (submission) {
    html += buildSubmissionCard(submission);
  });

  return html + '</div></section>';
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

function filterStudentsForSelectedClass(students) {
  if (!state.selectedClassId) {
    return students;
  }

  return students.filter(function (student) {
    return (student.classIds || []).indexOf(state.selectedClassId) !== -1 || student.classId === state.selectedClassId;
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


