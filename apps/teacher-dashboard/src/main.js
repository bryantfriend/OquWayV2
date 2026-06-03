import { teacherDashboardService } from "./ui/services/teacherDashboardService.js?v=1.1.40-teacher-profile-admin-fix";

var app = document.getElementById("app");
var state = {
  authReady: false,
  isLoading: true,
  isLoggingIn: false,
  isResetting: false,
  isReviewing: "",
  teacher: null,
  classes: [],
  students: [],
  submissions: [],
  summary: null,
  selectedClassId: "",
  statusFilter: "pending",
  message: "",
  error: "",
  unauthorized: false
};

if (app) {
  app.addEventListener("submit", handleSubmit);
  app.addEventListener("click", handleClick);
  app.addEventListener("change", handleChange);
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
      reviewStatus: state.statusFilter,
      classId: state.selectedClassId
    });

    setState({
      isLoading: false,
      isLoggingIn: false,
      teacher: data.teacher,
      classes: data.classes || [],
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
    message: "Refreshing review queue...",
    error: ""
  });

  try {
    var data = await teacherDashboardService.loadReviewQueue({
      reviewStatus: state.statusFilter,
      classId: state.selectedClassId
    });

    setState({
      submissions: data.submissions || [],
      message: "",
      error: ""
    });
  } catch (error) {
    setState({
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
  var email = form.querySelector("[name=resetEmail]").value;

  setState({
    isResetting: true,
    error: "",
    message: "Sending reset email..."
  });

  try {
    await teacherDashboardService.sendPasswordReset(email);
    setState({
      isResetting: false,
      message: "Password reset email sent.",
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
  var classButton = event.target.closest("[data-class-id]");
  var reviewButton = event.target.closest("[data-review-status]");

  if (logoutButton) {
    await teacherDashboardService.logout();
    return;
  }

  if (refreshButton) {
    await loadDashboard();
    return;
  }

  if (classButton) {
    setState({
      selectedClassId: classButton.getAttribute("data-class-id") || ""
    });
    await loadDashboard();
    return;
  }

  if (reviewButton) {
    await reviewSubmission(reviewButton);
  }
}

async function handleChange(event) {
  var statusSelect = event.target.closest("#reviewStatusFilter");
  var classSelect = event.target.closest("#reviewClassFilter");

  if (!statusSelect && !classSelect) {
    return;
  }

  if (statusSelect) {
    state.statusFilter = statusSelect.value;
  }

  if (classSelect) {
    state.selectedClassId = classSelect.value;
  }

  await loadDashboard();
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
    await loadDashboard();
    setState({
      isReviewing: "",
      message: "Review saved."
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

function buildLoadingView() {
  return '<main class="teacher-shell teacher-center">'
    + '<div class="teacher-loader" aria-hidden="true"><span></span><span></span><span></span></div>'
    + '<h1>Opening your classroom...</h1>'
    + '<p>' + escapeHtml(state.message || "Loading Teacher Dashboard.") + '</p>'
    + '</main>';
}

function buildLoginView() {
  return '<main class="teacher-login-shell">'
    + '<section class="teacher-login-panel">'
    + '<div class="teacher-brand"><span>OquWay</span><strong>Teacher Dashboard</strong></div>'
    + '<h1>Classroom command center</h1>'
    + '<p>Sign in with your teacher email to review student work and manage assigned classes.</p>'
    + buildStatusMessages()
    + '<form id="teacherLoginForm" class="teacher-form">'
    + '<label>Email<input name="email" type="email" autocomplete="email" required></label>'
    + '<label>Password<input name="password" type="password" autocomplete="current-password" required></label>'
    + '<button type="submit"' + disabled(state.isLoggingIn) + '>' + (state.isLoggingIn ? "Signing in..." : "Sign In") + '</button>'
    + '</form>'
    + '<form id="teacherResetForm" class="teacher-reset-form">'
    + '<label>Forgot password?<input name="resetEmail" type="email" placeholder="teacher@email.com"></label>'
    + '<button type="submit"' + disabled(state.isResetting) + '>' + (state.isResetting ? "Sending..." : "Send Reset Email") + '</button>'
    + '</form>'
    + '</section>'
    + '<aside class="teacher-login-aside">'
    + '<div><strong>Review-ready MVP</strong><span>Classes, students, and External Task submissions in one focused view.</span></div>'
    + '<div><strong>Teacher scoped</strong><span>Teachers see assigned classes only. Admin roles keep broader access.</span></div>'
    + '</aside>'
    + '</main>';
}

function buildDashboardView() {
  return '<main class="teacher-dashboard-shell">'
    + buildHeader()
    + buildStatusMessages()
    + buildMetrics()
    + '<section class="teacher-grid">'
    + buildClassCards()
    + buildStudentsView()
    + '</section>'
    + buildReviewQueue()
    + '</main>';
}

function buildHeader() {
  var teacher = state.teacher || {};

  return '<header class="teacher-header">'
    + '<div><p>Teacher Dashboard</p><h1>' + escapeHtml(teacher.name || "Teacher") + '</h1>'
    + '<span>' + escapeHtml(teacher.locationName || "Assigned school") + '</span></div>'
    + '<div class="teacher-header-actions"><span class="teacher-role-badge">' + escapeHtml(teacher.roleLabel || "Teacher") + '</span>'
    + '<button type="button" class="teacher-secondary-btn" data-action="refresh">Refresh</button>'
    + '<button type="button" class="teacher-secondary-btn" data-action="logout">Sign Out</button></div>'
    + '</header>';
}

function buildMetrics() {
  var summary = state.summary || {};

  return '<section class="teacher-metrics">'
    + buildMetricCard(summary.classCount || state.classes.length, "Classes")
    + buildMetricCard(summary.studentCount || state.students.length, "Students")
    + buildMetricCard(summary.pendingSubmissionsCount || countPending(state.submissions), "Pending Reviews")
    + '</section>';
}

function buildMetricCard(value, label) {
  return '<article class="teacher-metric"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></article>';
}

function buildClassCards() {
  var classes = state.classes || [];
  var html = '<section class="teacher-card-section"><div class="teacher-section-title"><h2>Classes</h2><p>Assigned classroom groups</p></div>';

  if (classes.length === 0) {
    return html + '<div class="teacher-empty"><strong>No classes assigned to this teacher.</strong><span>Ask an admin to add class IDs to this teacher profile.</span></div></section>';
  }

  html += '<div class="teacher-class-list"><button type="button" class="teacher-class-card' + (!state.selectedClassId ? " active" : "") + '" data-class-id="">'
    + '<strong>All assigned classes</strong><span>' + classes.length + ' classes</span></button>';

  classes.forEach(function (classRecord) {
    html += '<button type="button" class="teacher-class-card' + (state.selectedClassId === classRecord.id ? " active" : "") + '" data-class-id="' + escapeHtml(classRecord.id) + '">'
      + '<strong>' + escapeHtml(classRecord.name) + '</strong>'
      + '<span>' + escapeHtml(classRecord.locationName || "Assigned location") + '</span>'
      + '<small>' + classRecord.studentCount + ' students | ' + classRecord.assignedCoursesCount + ' courses | ' + classRecord.pendingSubmissionsCount + ' pending</small>'
      + '</button>';
  });

  return html + '</div></section>';
}

function buildStudentsView() {
  var students = filterStudentsForSelectedClass(state.students || []);
  var html = '<section class="teacher-card-section"><div class="teacher-section-title"><h2>Students</h2><p>Progress and review signals</p></div>';

  if (students.length === 0) {
    return html + '<div class="teacher-empty"><strong>No students found.</strong><span>Students assigned to this class will appear here.</span></div></section>';
  }

  html += '<div class="teacher-student-list">';
  students.forEach(function (student) {
    html += '<article class="teacher-student-row">'
      + '<div class="teacher-avatar">' + buildStudentAvatar(student) + '</div>'
      + '<div><strong>' + escapeHtml(student.name) + '</strong><span>' + escapeHtml(student.currentCourseProgress || "No progress yet") + '</span></div>'
      + '<div><span>' + escapeHtml(formatDate(student.lastActiveAt) || "No recent activity") + '</span><small>' + student.pendingSubmissionsCount + ' pending</small></div>'
      + '<b class="' + (student.pendingSubmissionsCount > 0 ? "needs-review" : "steady") + '">' + (student.pendingSubmissionsCount > 0 ? "Needs review" : "Steady") + '</b>'
      + '</article>';
  });

  return html + '</div></section>';
}

function buildReviewQueue() {
  var submissions = state.submissions || [];
  var html = '<section class="teacher-review-section">'
    + '<div class="teacher-section-title"><h2>Review Queue</h2><p>External Task submissions from assigned classes</p></div>'
    + '<div class="teacher-filters">'
    + '<label>Class<select id="reviewClassFilter"><option value="">All assigned classes</option>' + buildClassOptions() + '</select></label>'
    + '<label>Status<select id="reviewStatusFilter">'
    + buildStatusOption("pending", "Pending")
    + buildStatusOption("complete", "Complete")
    + buildStatusOption("needsWork", "Needs Work")
    + buildStatusOption("incomplete", "Incomplete")
    + '</select></label>'
    + '</div>';

  if (submissions.length === 0) {
    return html + '<div class="teacher-empty"><strong>No pending submissions yet.</strong><span>External Task uploads for this filter will appear here.</span></div></section>';
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

  return '<article class="teacher-submission-card">'
    + '<div class="teacher-submission-head"><div><strong>' + escapeHtml(submission.studentName || submission.studentId || "Student") + '</strong>'
    + '<span>' + escapeHtml(readSubmissionContext(submission)) + '</span></div>'
    + '<b class="teacher-status-pill">' + escapeHtml(formatReviewStatus(submission.reviewStatus)) + '</b></div>'
    + '<div class="teacher-submission-meta">'
    + '<span>Task: ' + escapeHtml(submission.taskTitle || submission.stepId || "External Task") + '</span>'
    + '<span>Submitted: ' + escapeHtml(formatDate(submission.createdAt) || "Recently") + '</span>'
    + '</div>'
    + buildProofPreview(file)
    + '<p class="teacher-note">' + escapeHtml(submission.studentNote || "No student note.") + '</p>'
    + '<label class="teacher-feedback-label">Teacher feedback<textarea data-feedback-id="' + escapeHtml(submission.id) + '" rows="3" placeholder="Feedback for the student">' + escapeHtml(submission.teacherFeedback || "") + '</textarea></label>'
    + '<div class="teacher-review-actions">'
    + buildReviewButton(submission.id, "complete", "Complete", isPending)
    + buildReviewButton(submission.id, "needsWork", "Needs Work", isPending)
    + buildReviewButton(submission.id, "incomplete", "Incomplete", isPending)
    + '</div>'
    + '</article>';
}

function buildReviewButton(submissionId, status, label, isPending) {
  return '<button type="button" class="teacher-review-btn ' + escapeHtml(status) + '" data-submission-id="' + escapeHtml(submissionId) + '" data-review-status="' + escapeHtml(status) + '"' + disabled(isPending) + '>' + (isPending ? "Saving..." : label) + '</button>';
}

function buildProofPreview(file) {
  if (!file) {
    return '<div class="teacher-proof empty">No uploaded file found.</div>';
  }

  if (file.contentType && file.contentType.indexOf("image/") === 0) {
    return '<a class="teacher-proof image" href="' + escapeHtml(file.downloadUrl || "#") + '" target="_blank" rel="noopener">'
      + '<img src="' + escapeHtml(file.downloadUrl || "") + '" alt="' + escapeHtml(file.name || "Uploaded proof") + '">'
      + '<span>' + escapeHtml(file.name || "Open uploaded proof") + '</span></a>';
  }

  return '<a class="teacher-proof file" href="' + escapeHtml(file.downloadUrl || "#") + '" target="_blank" rel="noopener">Open uploaded file: ' + escapeHtml(file.name || "proof") + '</a>';
}

function buildClassOptions() {
  return (state.classes || []).map(function (classRecord) {
    return '<option value="' + escapeHtml(classRecord.id) + '"' + selected(state.selectedClassId, classRecord.id) + '>' + escapeHtml(classRecord.name) + '</option>';
  }).join("");
}

function buildStatusOption(value, label) {
  return '<option value="' + escapeHtml(value) + '"' + selected(state.statusFilter, value) + '>' + escapeHtml(label) + '</option>';
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
  addPart(parts, "Class", submission.classId);
  addPart(parts, "Course", submission.courseTitle || submission.courseId);
  addPart(parts, "Module", submission.moduleTitle || submission.moduleId);
  return parts.join(" | ") || "External Task";
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

