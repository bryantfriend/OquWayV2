import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../packages/firebase/auth/index.js?v=1.1.79-user-command-center";
import { PracticeModePlayer } from "../../../packages/shared/player/index.js?v=1.1.79-user-command-center";
import {
  calculateCourseCompletion as calculateSharedCourseCompletion,
  countCourseCompletedSteps as countSharedCourseCompletedSteps,
  countCourseSteps as countSharedCourseSteps,
  countModuleCompletedSteps as countSharedModuleCompletedSteps,
  countModuleSteps as countSharedModuleSteps,
  countSessionCompletedSteps as countSharedSessionCompletedSteps,
  countSessionSteps as countSharedSessionSteps,
  readCourseLearningStatus,
  readModuleLearningStatus,
  readSessionLearningStatus
} from "../../../packages/domain/progress/index.js?v=1.1.79-user-command-center";
import {
  createEmptyState,
  createErrorState,
  createLoadingState,
  createStatusBadge,
  formatStatusLabel
} from "../../../packages/ui/index.js?v=1.1.79-user-command-center";
import { studentDashboardStore } from "./ui/state/studentDashboardState.js?v=1.1.79-user-command-center";
import { studentDashboardService } from "./ui/services/studentDashboardService.js?v=1.1.79-user-command-center";

var appElement = document.getElementById("app");
var authInitialized = false;
var practiceModePlayer = null;
var practiceModePlayerSignature = "";

studentDashboardStore.subscribe(function (state) {
  render(state);
});

if (appElement) {
  appElement.addEventListener("click", handleAppClick);
}

onAuthStateChanged(auth, function (user) {
  handleStartupAuth(user);
});

async function handleStartupAuth(user) {
  if (authInitialized) {
    return;
  }

  authInitialized = true;
  logStartupAuthUser(user);

  if (isPreviewMode()) {
    studentDashboardService.loadDashboard();
    return;
  }

  if (!user) {
    redirectToStudentLogin("Please log in before opening your dashboard.");
    return;
  }

  if (user.isAnonymous) {
    redirectToStudentLogin("Please use your student login before opening your dashboard.");
    return;
  }

  var profile = await studentDashboardService.loadVerifiedStudentProfile();

  if (!profile) {
    await clearStudentSessionAndRedirect("We could not verify an active student profile for this account.");
    return;
  }

  if (!hasConfirmedStudentSession(user.uid)) {
    await clearStudentSessionAndRedirect("Please choose your student card and enter your fruit password.");
    return;
  }

  studentDashboardService.loadDashboard(profile);
}

function isPreviewMode() {
  return window.location.search.indexOf("preview=1") !== -1;
}

function redirectToStudentLogin(message) {
  if (message && window.sessionStorage) {
    window.sessionStorage.setItem("oquwayStudentLoginMessage", message);
  }

  window.location.href = "../student-login/index.html";
}

async function clearStudentSessionAndRedirect(message) {
  clearStudentSessionMarker();

  if (auth.currentUser) {
    await signOut(auth);
  }

  redirectToStudentLogin(message);
}

function hasConfirmedStudentSession(uid) {
  if (!window.sessionStorage || !uid) {
    return false;
  }

  return window.sessionStorage.getItem("oquwayStudentSessionUid") === uid;
}

function clearStudentSessionMarker() {
  if (!window.sessionStorage) {
    return;
  }

  window.sessionStorage.removeItem("oquwayStudentSessionUid");
  window.sessionStorage.removeItem("oquwayStudentSessionStartedAt");
}

function logStartupAuthUser(user) {
  if (!isDevelopmentHost()) {
    return;
  }

  if (!user) {
    console.log("[Startup] auth user", {
      uid: "",
      isAnonymous: false
    });
    return;
  }

  console.log("[Startup] auth user", {
    uid: user.uid,
    isAnonymous: user.isAnonymous
  });
}

function isDevelopmentHost() {
  return window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
    || window.location.hostname === "";
}

async function resetStudentLogin() {
  await clearStudentSessionAndRedirect("Choose your student card to start again.");
}

window.goStudentLogin = resetStudentLogin;
window.resetStudentLogin = resetStudentLogin;

function render(state) {
  if (!appElement) {
    return;
  }

  if (state.isLoading) {
    appElement.innerHTML = buildLoadingView();
    return;
  }

  if (state.isCourseOpening) {
    appElement.innerHTML = buildCourseOpeningView();
    return;
  }

  if (state.playerMode) {
    appElement.innerHTML = buildPlayerView(state);
    mountPracticeModePlayer(state);
    return;
  }

  resetPracticeModePlayer();
  appElement.innerHTML = buildDashboardView(state);
}

function handleAppClick(event) {
  var courseButton = event.target.closest(".student-course-card");
  var moduleButton = event.target.closest(".student-module-card");
  var sessionButton = event.target.closest(".student-session-card");
  var practiceModeButton = event.target.closest(".student-practice-mode-card");
  var backButton = event.target.closest(".student-back-dashboard-btn");
  var previousButton = event.target.closest(".student-player-prev-btn");
  var nextButton = event.target.closest(".student-player-next-btn");
  var completeButton = event.target.closest(".student-complete-step-btn");
  var playerCompleteButton = event.target.closest(".oqu-player-complete-btn");
  var reloadButton = event.target.closest(".student-reload-btn");
  var switchStudentButton = event.target.closest(".student-switch-student-btn");
  var continueButton = event.target.closest(".student-continue-learning-btn");
  var courseActionButton = event.target.closest(".student-course-open-btn");
  var bonusButton = event.target.closest(".student-bonus-claim-btn");

  if (switchStudentButton) {
    resetStudentLogin();
    return;
  }

  if (reloadButton) {
    studentDashboardService.loadDashboard();
    return;
  }

  if (bonusButton) {
    studentDashboardService.claimDailyBonus();
    return;
  }

  if (continueButton) {
    continueLearning();
    return;
  }

  if (courseActionButton) {
    openStudentCourse(courseActionButton.getAttribute("data-course-id"));
    return;
  }

  if (courseButton) {
    openStudentCourse(courseButton.getAttribute("data-course-id"));
    return;
  }

  if (moduleButton) {
    selectModule(moduleButton.getAttribute("data-module-id"));
    return;
  }

  if (sessionButton) {
    selectSession(sessionButton.getAttribute("data-module-id"), sessionButton.getAttribute("data-session-id"));
    return;
  }

  if (practiceModeButton) {
    openPracticeMode(
      practiceModeButton.getAttribute("data-course-id"),
      practiceModeButton.getAttribute("data-module-id"),
      practiceModeButton.getAttribute("data-session-id"),
      practiceModeButton.getAttribute("data-practice-mode-key")
    );
    return;
  }

  if (backButton) {
    studentDashboardStore.setState({
      playerMode: false,
      currentStepIndex: 0,
      practiceModeFinished: false,
      statusMessage: ""
    });
    return;
  }

  if (previousButton) {
    movePlayerStep(-1);
    return;
  }

  if (nextButton) {
    movePlayerStep(1);
    return;
  }

  if (completeButton || playerCompleteButton) {
    completeCurrentStep();
  }
}

function selectCourse(courseId) {
  studentDashboardStore.setState({
    selectedCourseId: courseId,
    selectedModuleId: null,
    selectedSessionId: null,
    selectedPracticeModeKey: "beforeClass",
    statusMessage: ""
  });
}

async function openStudentCourse(courseId) {
  var openResult = null;
  var target = null;

  if (!courseId) {
    studentDashboardStore.setState({
      error: "We could not identify that course. Please refresh and try again."
    });
    return;
  }

  openResult = await studentDashboardService.openCourse(courseId);

  if (!openResult || !openResult.course) {
    return;
  }

  target = openResult.openTarget || {};
  applyOpenedCourseResult(openResult);

  if (openResult.hasActivity === true && target.moduleId && target.sessionId) {
    await openPracticeMode(
      openResult.course.id,
      target.moduleId,
      target.sessionId,
      target.practiceModeKey || "beforeClass"
    );
    return;
  }

  studentDashboardStore.setState({
    isCourseOpening: false,
    playerMode: false,
    statusMessage: openResult.emptyCourseState && openResult.emptyCourseState.message
      ? openResult.emptyCourseState.message
      : "Course opened. Choose an available module to begin."
  });
}

function applyOpenedCourseResult(openResult) {
  var target = openResult.openTarget || {};

  studentDashboardStore.setState({
    isCourseOpening: false,
    courses: mergeOpenedCourse(studentDashboardStore.getState().courses || [], openResult.course),
    selectedCourseId: openResult.course.id,
    selectedModuleId: target.moduleId || null,
    selectedSessionId: target.sessionId || null,
    selectedPracticeModeKey: target.practiceModeKey || "beforeClass",
    currentStepIndex: 0,
    practiceModeFinished: false,
    error: null,
    statusMessage: ""
  });
}

async function continueLearning() {
  var state = studentDashboardStore.getState();
  var recommendation = await studentDashboardService.continueLearning(state.courses || []);

  if (!recommendation || !recommendation.courseId) {
    return;
  }

  studentDashboardStore.setState({
    selectedCourseId: recommendation.courseId,
    selectedModuleId: recommendation.moduleId || null,
    selectedSessionId: recommendation.sessionId || null,
    selectedPracticeModeKey: "beforeClass",
    statusMessage: ""
  });
}

function selectModule(moduleId) {
  studentDashboardStore.setState({
    selectedModuleId: moduleId,
    selectedSessionId: null,
    selectedPracticeModeKey: "beforeClass",
    statusMessage: ""
  });
}

function selectSession(moduleId, sessionId) {
  studentDashboardStore.setState({
    selectedModuleId: moduleId,
    selectedSessionId: sessionId,
    selectedPracticeModeKey: "beforeClass",
    statusMessage: ""
  });
}

async function openPracticeMode(courseId, moduleId, sessionId, practiceModeKey) {
  var result = await studentDashboardService.startPracticeMode(courseId, moduleId, sessionId, practiceModeKey);

  if (!result) {
    return;
  }

  studentDashboardStore.setState({
    isPlayerLoading: false,
    selectedCourseId: courseId,
    selectedModuleId: moduleId,
    selectedSessionId: sessionId,
    selectedPracticeModeKey: practiceModeKey,
    currentStepIndex: readFirstIncompleteStepIndex(result.practiceMode, result.practiceModeProgress),
    playerMode: true,
    practiceModeFinished: false,
    statusMessage: ""
  });
}

function movePlayerStep(direction) {
  var state = studentDashboardStore.getState();
  var practiceMode = readSelectedPracticeMode(state);
  var steps = readSortedSteps(practiceMode ? practiceMode.steps : []);

  if (steps.length === 0) {
    return;
  }

  studentDashboardStore.setState({
    currentStepIndex: clampNumber(state.currentStepIndex + direction, 0, steps.length - 1),
    practiceModeFinished: false
  });
}

async function completeCurrentStep(stepId, completionResult, snapshot) {
  var state = studentDashboardStore.getState();
  var course = readSelectedCourse(state);
  var module = readSelectedModule(state);
  var session = readSelectedSession(state);
  var practiceMode = readSelectedPracticeMode(state);
  var steps = readSortedSteps(practiceMode ? practiceMode.steps : []);

  if (!course || !module || !session || !practiceMode || steps.length === 0) {
    return;
  }

  var currentIndex = snapshot && typeof snapshot.currentStepIndex === "number"
    ? snapshot.currentStepIndex
    : clampNumber(state.currentStepIndex, 0, steps.length - 1);
  var safeStepId = typeof stepId === "string" && stepId.length > 0
    ? stepId
    : readStepId(steps[currentIndex], "");
  var stepResult = await studentDashboardService.completeStep(
    course.id,
    module.id,
    session.id,
    practiceMode.key,
    safeStepId,
    completionResult
  );

  if (!stepResult) {
    return;
  }

  applyProgressResult(stepResult);

  if (snapshot && snapshot.isComplete) {
    var modeResult = await studentDashboardService.completePracticeMode(course.id, module.id, session.id, practiceMode.key);
    if (modeResult) {
      applyProgressResult(modeResult);
    }
    studentDashboardStore.setState({
      isSavingProgress: false,
      practiceModeFinished: true,
      statusMessage: "Practice mode complete."
    });
    return;
  }

  studentDashboardStore.setState({
    isSavingProgress: false,
    currentStepIndex: snapshot && typeof snapshot.currentStepIndex === "number" ? snapshot.currentStepIndex : currentIndex,
    statusMessage: "Progress saved."
  });
}

function applyProgressResult(progressResult) {
  var state = studentDashboardStore.getState();
  var courses = updateCourseProgress(state.courses, progressResult);

  studentDashboardStore.setState({
    courses: courses
  });
}

function mergeOpenedCourse(courses, openedCourse) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var mergedCourses = [];
  var courseIndex = 0;
  var replaced = false;

  while (courseIndex < safeCourses.length) {
    if (safeCourses[courseIndex] && safeCourses[courseIndex].id === openedCourse.id) {
      mergedCourses.push(openedCourse);
      replaced = true;
    } else {
      mergedCourses.push(safeCourses[courseIndex]);
    }

    courseIndex = courseIndex + 1;
  }

  if (!replaced) {
    mergedCourses.push(openedCourse);
  }

  return mergedCourses;
}

function buildLoadingView() {
  return createLoadingState("Loading courses...", {
    className: "student-loading-card",
    titleTag: "h1",
    beforeHtml: '<div class="student-spinner"></div>',
    note: "Preparing your classroom learning path."
  });
}

function buildCourseOpeningView() {
  return createLoadingState("Loading course...", {
    className: "student-loading-card",
    titleTag: "h1",
    beforeHtml: '<div class="student-spinner"></div>',
    note: "Finding your next activity."
  });
}

function buildDashboardView(state) {
  var courses = state.courses || [];
  var selectedCourse = readSelectedCourse(state);
  var studentName = readStudentName(state.student);
  var overallProgress = state.progressSummary && typeof state.progressSummary.overallProgressPercent === "number"
    ? state.progressSummary.overallProgressPercent
    : readOverallProgressPercent(courses);
  var html = "";

  html += '<section class="student-hero student-hero-v2">';
  html += '<div class="student-avatar-wrap">' + buildStudentAvatar(state.student, studentName) + '</div>';
  html += '<div class="student-hero-copy">';
  html += '<p class="student-eyebrow">Student Dashboard</p>';
  html += '<h1>Welcome back, ' + escapeHtml(studentName) + '</h1>';
  html += '<p>' + escapeHtml(readMotivationalMessage(overallProgress)) + '</p>';
  html += '<div class="student-profile-meta"><span>' + escapeHtml(readStudentClassLabel(state.student)) + '</span><span>' + escapeHtml(readStudentLocationLabel(state.student)) + '</span></div>';
  html += '</div>';
  html += '<div class="student-hero-actions"><div class="student-hero-progress">' + overallProgress + '% complete</div><button type="button" class="student-reload-btn">Refresh</button><button type="button" class="student-switch-student-btn">Switch Student</button></div>';
  html += '</section>';

  if (state.actorIsPreview) {
    html += '<div class="student-warning">You are viewing in preview mode. Sign in as a student to save progress to Firestore.</div>';
  }

  if (state.error) {
    html += createErrorState(state.error, "", {
      className: "student-error",
      titleTag: "span"
    });
  }

  if (state.statusMessage) {
    html += '<div class="student-status">' + escapeHtml(state.statusMessage) + '</div>';
  }

  if (courses.length === 0) {
    html += createEmptyState("No assigned courses yet", "No courses assigned yet.", {
      className: "student-empty",
      beforeHtml: '<img class="student-empty-illustration" src="./src/assets/empty-courses.svg" alt="">',
      afterHtml: buildDailyBonusCard(state.dailyBonus, true) + buildIntentionPoints(state.intentionPoints)
    });
    return html;
  }

  html += '<section class="student-dashboard-v2-grid">';
  html += '<div class="student-dashboard-main-stack">';
  html += buildContinueLearningCard(state.continueLearning, selectedCourse);
  html += '<section class="student-panel student-my-courses-panel"><div class="student-section-head"><div><p class="student-eyebrow">My Courses</p><h2>Assigned Courses</h2></div><span>' + courses.length + ' course' + (courses.length === 1 ? "" : "s") + '</span></div>';
  html += buildCourseCards(courses, state.selectedCourseId);
  html += '</section>';
  html += '<section class="student-panel student-main-panel">';
  html += buildCourseDetail(selectedCourse, state);
  html += '</section>';
  html += '</div>';
  html += '<aside class="student-dashboard-side-stack">';
  html += buildProgressCard(state.progressSummary, overallProgress);
  html += buildDailyBonusCard(state.dailyBonus, false);
  html += buildIntentionPoints(state.intentionPoints);
  html += '</aside>';
  html += '</section>';

  return html;
}

function buildCourseCards(courses, selectedCourseId) {
  var html = "";
  var courseIndex = 0;

  html += '<div class="student-course-grid">';

  while (courseIndex < courses.length) {
    var course = courses[courseIndex];
    var activeClass = selectedCourseId === course.id ? " student-course-card-active" : "";
    var progressPercent = readCourseProgressPercent(course);
    var moduleCount = readCourseModuleCount(course);
    var completedModuleCount = countCompletedModules(course);
    var status = readCourseLearningStatus(course);
    var title = readLocalizedText(course.title, "Untitled Course");
    html += '<article class="student-course-card' + activeClass + '" data-course-id="' + escapeHtml(course.id) + '">';
    html += '<div class="student-course-art"><img src="./src/assets/course-illustration.svg" alt=""></div>';
    html += '<div class="student-course-card-copy">' + buildStudentStatusBadge(status) + '<strong>' + escapeHtml(title) + '</strong><p>' + escapeHtml(readLocalizedText(course.description, "Practice activities are ready when your teacher assigns sessions.")) + '</p></div>';
    html += '<div class="student-course-meta"><span>' + completedModuleCount + ' / ' + moduleCount + ' modules</span><span>' + progressPercent + '% complete</span></div>';
    html += '<div class="student-progress-bar"><span style="width:' + progressPercent + '%"></span></div>';
    html += '<button type="button" class="student-course-open-btn" data-course-id="' + escapeHtml(course.id) + '">' + (progressPercent > 0 ? "Continue" : "Start") + '</button>';
    html += '</article>';
    courseIndex = courseIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildContinueLearningCard(continueLearning, selectedCourse) {
  var recommendation = continueLearning || {};
  var courseTitle = recommendation.courseTitle || (selectedCourse ? readLocalizedText(selectedCourse.title, "Untitled Course") : "Start your first course");
  var moduleTitle = recommendation.moduleTitle || "First module";
  var progressPercent = typeof recommendation.progressPercent === "number" ? recommendation.progressPercent : 0;
  var actionLabel = recommendation.actionLabel || (progressPercent > 0 ? "Continue" : "Start Learning");

  return '<section class="student-continue-card">'
    + '<div class="student-continue-copy"><p class="student-eyebrow">Continue Learning</p><h2>' + escapeHtml(courseTitle) + '</h2><p>' + escapeHtml(moduleTitle) + '</p><small>' + escapeHtml(readLastOpenedLabel(recommendation.lastOpenedAt)) + '</small><div class="student-progress-bar"><span style="width:' + progressPercent + '%"></span></div></div>'
    + '<div class="student-continue-action"><strong>' + progressPercent + '%</strong><button type="button" class="student-continue-learning-btn">' + escapeHtml(actionLabel) + '</button></div>'
    + '</section>';
}

function buildProgressCard(progressSummary, overallProgress) {
  var summary = progressSummary || {};

  return '<section class="student-panel student-progress-card"><p class="student-eyebrow">Progress</p><h2>' + overallProgress + '%</h2><p>Overall learning progress</p><div class="student-progress-ring" style="--progress:' + overallProgress + '%"><span>' + overallProgress + '%</span></div><div class="student-progress-mini"><span>' + (summary.inProgressCourses || 0) + ' in progress</span><span>' + (summary.completedCourses || 0) + ' completed</span></div></section>';
}

function buildDailyBonusCard(dailyBonus, compact) {
  var bonus = dailyBonus || {};
  var available = bonus.available !== false && bonus.claimed !== true;
  var cardClass = compact ? " student-daily-bonus-compact" : "";

  return '<section class="student-panel student-daily-bonus' + cardClass + '"><img src="./src/assets/daily-bonus.svg" alt=""><div><p class="student-eyebrow">Daily Bonus</p><h2>' + (available ? "Ready to claim" : "Claimed today") + '</h2><p>' + escapeHtml(bonus.countdownLabel || (available ? "Ready now" : "Available again tomorrow")) + '</p><strong>+' + (bonus.rewardXp || 10) + ' XP</strong></div><button type="button" class="student-bonus-claim-btn"' + disabled(!available) + '>' + (available ? "Claim" : "Claimed") + '</button></section>';
}

function buildIntentionPoints(points) {
  var safePoints = points || {};

  return '<section class="student-panel student-points-card"><p class="student-eyebrow">Intention Points</p><h2>Rewards</h2><div class="student-points-grid">'
    + buildPointBalance("Blue", "Cognitive", safePoints.cognitive || 0, "blue")
    + buildPointBalance("Green", "Physical", safePoints.physical || 0, "green")
    + buildPointBalance("Orange", "Creative", safePoints.creative || 0, "orange")
    + buildPointBalance("Purple", "Social", safePoints.social || 0, "purple")
    + '</div></section>';
}

function buildPointBalance(colorLabel, label, value, tone) {
  return '<div class="student-point-balance student-point-' + tone + '"><span>' + escapeHtml(colorLabel) + '</span><strong>' + escapeHtml(String(value)) + '</strong><small>' + escapeHtml(label) + '</small></div>';
}

function buildStudentAvatar(student, studentName) {
  var imageUrl = readStudentAvatarUrl(student);

  if (imageUrl) {
    return '<img class="student-avatar-img" src="' + escapeHtml(imageUrl) + '" alt="">';
  }

  return '<div class="student-avatar-fallback">' + escapeHtml(readInitials(studentName)) + '</div>';
}

function readStudentAvatarUrl(student) {
  if (!student || typeof student !== "object") {
    return "";
  }

  if (typeof student.avatarUrl === "string" && student.avatarUrl.length > 0) {
    return student.avatarUrl;
  }

  if (typeof student.photoURL === "string" && student.photoURL.length > 0) {
    return student.photoURL;
  }

  if (typeof student.photoUrl === "string" && student.photoUrl.length > 0) {
    return student.photoUrl;
  }

  return "";
}

function readInitials(name) {
  var words = typeof name === "string" ? name.trim().split(/\s+/) : [];
  var initials = "";
  var wordIndex = 0;

  while (wordIndex < words.length && initials.length < 2) {
    if (words[wordIndex].length > 0) {
      initials += words[wordIndex].charAt(0).toUpperCase();
    }

    wordIndex = wordIndex + 1;
  }

  return initials || "OW";
}

function readMotivationalMessage(overallProgress) {
  if (overallProgress >= 100) {
    return "Beautiful work. You completed everything assigned so far.";
  }

  if (overallProgress >= 60) {
    return "You are building strong momentum. Keep going with the next activity.";
  }

  if (overallProgress > 0) {
    return "Your learning path is underway. A few focused minutes can move it forward.";
  }

  return "Pick a course and begin your first practice step.";
}

function readStudentClassLabel(student) {
  if (!student || typeof student !== "object") {
    return "Class not set";
  }

  if (typeof student.className === "string" && student.className.length > 0) {
    return "Class " + student.className;
  }

  if (typeof student.classLabel === "string" && student.classLabel.length > 0) {
    return student.classLabel;
  }

  if (typeof student.classId === "string" && student.classId.length > 0) {
    return "Class " + student.classId;
  }

  if (Array.isArray(student.classIds) && student.classIds.length > 0) {
    return "Class " + student.classIds[0];
  }

  return "Class not set";
}

function readStudentLocationLabel(student) {
  if (!student || typeof student !== "object") {
    return "Location not set";
  }

  if (typeof student.locationName === "string" && student.locationName.length > 0) {
    return student.locationName;
  }

  if (typeof student.schoolName === "string" && student.schoolName.length > 0) {
    return student.schoolName;
  }

  if (typeof student.locationId === "string" && student.locationId.length > 0) {
    return student.locationId;
  }

  if (typeof student.schoolId === "string" && student.schoolId.length > 0) {
    return student.schoolId;
  }

  return "Location not set";
}

function readLastOpenedLabel(lastOpenedAt) {
  var timestamp = typeof lastOpenedAt === "number" ? lastOpenedAt : 0;

  if (timestamp <= 0) {
    return "Ready when you are";
  }

  var elapsedMs = Date.now() - timestamp;
  var elapsedDays = Math.floor(elapsedMs / 86400000);

  if (elapsedDays <= 0) {
    return "Last opened today";
  }

  if (elapsedDays === 1) {
    return "Last opened yesterday";
  }

  return "Last opened " + elapsedDays + " days ago";
}

function readLearningStatusLabel(status) {
  return formatStatusLabel(status || "notStarted");
}

function buildStudentStatusBadge(status) {
  return createStatusBadge(status || "notStarted", {
    className: "student-course-status",
    statusClassPrefix: "student-course-status-"
  });
}

function buildStudentModuleActionBadge(status, label) {
  return createStatusBadge(status || "notStarted", {
    className: "student-module-action",
    statusClassPrefix: "student-module-action-",
    tagName: "b",
    label: label
  });
}

function readModuleActionLabel(status, completedSteps) {
  if (status === "complete") {
    return "Review";
  }

  if (status === "needsWork") {
    return "Needs Work";
  }

  if (status === "pendingReview") {
    return "Waiting";
  }

  if (completedSteps > 0) {
    return "Continue";
  }

  return "Start";
}

function readModuleLastActivityLabel(module) {
  return readLastOpenedLabel(readModuleLastOpenedAt(module));
}

function disabled(value) {
  return value ? " disabled" : "";
}

function readCourseModuleCount(course) {
  return Array.isArray(course && course.modules) ? course.modules.length : 0;
}

function countCompletedModules(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var count = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (readModuleLearningStatus(modules[moduleIndex]) === "complete") {
      count = count + 1;
    }
    moduleIndex = moduleIndex + 1;
  }

  return count;
}

function buildCourseDetail(course, state) {
  var html = "";

  if (!course) {
    return createEmptyState("Select a course", "Pick a course from the left to begin.", {
      className: "student-empty"
    });
  }

  html += '<div class="student-course-heading">';
  html += '<div>';
  html += '<p class="student-eyebrow">Course</p>';
  html += '<h2>' + escapeHtml(readLocalizedText(course.title, "Untitled Course")) + '</h2>';
  html += '<p>' + escapeHtml(readLocalizedText(course.description, "Practice activities are ready when your teacher assigns sessions.")) + '</p>';
  html += '<div class="student-course-detail-meta"><span>' + escapeHtml(readLearningStatusLabel(readCourseLearningStatus(course))) + '</span><span>' + countCompletedModules(course) + ' / ' + readCourseModuleCount(course) + ' modules</span></div>';
  html += '</div>';
  html += '<div class="student-big-progress">' + readCourseProgressPercent(course) + '%</div>';
  html += '</div>';

  html += buildModules(course, state);
  return html;
}

function buildModules(course, state) {
  var modules = Array.isArray(course.modules) ? course.modules : [];
  var html = "";
  var moduleIndex = 0;

  if (modules.length === 0) {
    return createEmptyState("No modules ready yet", "This course does not have modules yet.", {
      className: "student-empty"
    });
  }

  while (moduleIndex < modules.length) {
    var module = modules[moduleIndex];
    var activeClass = state.selectedModuleId === module.id ? " student-module-active" : "";
    var moduleStatus = readModuleLearningStatus(module);
    var completedSteps = countModuleCompletedSteps(module);
    var totalSteps = countModuleSteps(module);
    html += '<article class="student-module">';
    html += '<button type="button" class="student-module-card' + activeClass + '" data-module-id="' + escapeHtml(module.id) + '">';
    html += '<span>' + escapeHtml(readLocalizedText(module.title, "Module")) + '</span>';
    html += '<small>' + escapeHtml(readLearningStatusLabel(moduleStatus)) + ' - ' + completedSteps + ' / ' + totalSteps + ' steps</small>';
    html += '<small>' + escapeHtml(readModuleLastActivityLabel(module)) + '</small>';
    html += buildStudentModuleActionBadge(moduleStatus, readModuleActionLabel(moduleStatus, completedSteps));
    html += '</button>';
    html += buildSessions(course, module, state);
    html += '</article>';
    moduleIndex = moduleIndex + 1;
  }

  return html;
}

function buildSessions(course, module, state) {
  var sessions = Array.isArray(module.sessions) ? module.sessions : [];
  var html = "";
  var sessionIndex = 0;

  if (sessions.length === 0) {
    return '<div class="student-session-empty">This module does not have steps yet.</div>';
  }

  if (countModuleSteps(module) === 0) {
    return '<div class="student-session-empty">This module does not have steps yet.</div>';
  }

  html += '<div class="student-session-list">';

  while (sessionIndex < sessions.length) {
    var session = sessions[sessionIndex];
    var activeClass = state.selectedSessionId === session.id ? " student-session-active" : "";
    var sessionStatus = readSessionLearningStatus(session);
    html += '<div class="student-session-card-shell">';
    html += '<button type="button" class="student-session-card' + activeClass + '" data-module-id="' + escapeHtml(module.id) + '" data-session-id="' + escapeHtml(session.id) + '">';
    html += '<span>' + escapeHtml(readLocalizedText(session.title, "Session")) + '</span>';
    html += '<small>' + escapeHtml(readLearningStatusLabel(sessionStatus)) + ' - ' + readSessionCompletionPercent(session) + '% complete</small>';
    html += '</button>';
    html += buildPracticeModeCards(course, module, session);
    html += '</div>';
    sessionIndex = sessionIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildPracticeModeCards(course, module, session) {
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var keys = createPracticeModeKeys();
  var html = '<div class="student-practice-grid">';
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    var key = keys[keyIndex];
    var mode = practiceModes[key];
    var steps = readSortedSteps(mode.steps);
    var progress = readPracticeModeProgress(session.progress, key);
    var completedCount = countCompletedSteps(steps, progress.completedStepIds);
    var completionPercent = calculatePercent(completedCount, steps.length);
    var emptyClass = steps.length === 0 ? " student-practice-empty-mode" : "";
    var completeText = progress.completed ? "Complete" : completionPercent + "% complete";

    html += '<button type="button" class="student-practice-mode-card' + emptyClass + '"';
    html += ' data-course-id="' + escapeHtml(course.id) + '"';
    html += ' data-module-id="' + escapeHtml(module.id) + '"';
    html += ' data-session-id="' + escapeHtml(session.id) + '"';
    html += ' data-practice-mode-key="' + escapeHtml(key) + '">';
    html += '<strong>' + escapeHtml(readLocalizedText(mode.title, "Practice Mode")) + '</strong>';
    html += '<span>' + escapeHtml(mode.purpose) + '</span>';
    html += '<small>' + escapeHtml(completeText) + ' - ' + completedCount + ' / ' + steps.length + ' steps</small>';
    html += '</button>';

    keyIndex = keyIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildPlayerView(state) {
  var course = readSelectedCourse(state);
  var module = readSelectedModule(state);
  var session = readSelectedSession(state);
  var practiceMode = readSelectedPracticeMode(state);
  var steps = readSortedSteps(practiceMode ? practiceMode.steps : []);
  var html = "";

  html += '<section class="student-player-shell">';

  if (state.error) {
    html += '<div class="student-error">' + escapeHtml(state.error) + '</div>';
  }

  if (state.statusMessage) {
    html += '<div class="student-status">' + escapeHtml(state.statusMessage) + '</div>';
  }

  if (!course || !module || !session || !practiceMode || steps.length === 0) {
    html += '<div class="student-player-empty">';
    html += '<div class="student-empty-icon">🔒</div>';
    html += '<h2>No activities available yet</h2>';
    html += '<p>This practice mode is empty. Your teacher may add activities later.</p>';
    html += '</div>';
    html += '</section>';
    return html;
  }

  html += '<div id="student-practice-player-root" class="student-practice-player-root"></div>';
  html += '</section>';

  return html;
}

function mountPracticeModePlayer(state) {
  var target = document.getElementById("student-practice-player-root");
  var course = readSelectedCourse(state);
  var module = readSelectedModule(state);
  var session = readSelectedSession(state);
  var practiceMode = readSelectedPracticeMode(state);
  var steps = readSortedSteps(practiceMode ? practiceMode.steps : []);
  var progress = readPracticeModeProgress(session ? session.progress : null, state.selectedPracticeModeKey || "beforeClass");
  var signature = "";

  if (!target || !course || !module || !session || !practiceMode) {
    return;
  }

  signature = createPracticeModePlayerSignature(course.id, module.id, session.id, state.selectedPracticeModeKey || "beforeClass", steps, progress);

  if (!practiceModePlayer || practiceModePlayerSignature !== signature) {
    resetPracticeModePlayer();
    practiceModePlayer = new PracticeModePlayer({
      courseId: course.id,
      moduleId: module.id,
      sessionId: session.id,
      practiceModeKey: state.selectedPracticeModeKey || "beforeClass",
      practiceMode: practiceMode,
      steps: steps,
      actor: readStudentActor(state),
      mode: "student",
      initialStepIndex: state.currentStepIndex,
      initialCompletedStepIds: progress.completedStepIds,
      initialCompletionResults: progress.completionResults,
      initialCompleted: progress.completed,
      onBack: function () {
        resetPracticeModePlayer();
        studentDashboardStore.setState({
          playerMode: false,
          currentStepIndex: 0,
          practiceModeFinished: false,
          statusMessage: ""
        });
      },
      onStepComplete: function (step, completionResult, snapshot) {
        savePlayerStepCompletion(step, completionResult, snapshot);
      },
      onExternalTaskLoad: function (step, snapshot) {
        return loadExternalTaskStepStatus(step, snapshot);
      },
      onExternalTaskSubmit: function (step, submissionRequest, snapshot) {
        return submitExternalTaskStep(step, submissionRequest, snapshot);
      },
      onStateChange: function (snapshot) {
        studentDashboardStore.setState({
          currentStepIndex: snapshot.currentStepIndex,
          practiceModeFinished: snapshot.isComplete
        });
      }
    });
    practiceModePlayerSignature = signature;
  }

  practiceModePlayer.mount(target);
}

function resetPracticeModePlayer() {
  if (practiceModePlayer) {
    practiceModePlayer.destroy();
  }

  practiceModePlayer = null;
  practiceModePlayerSignature = "";
}

function savePlayerStepCompletion(step, completionResult, snapshot) {
  completeCurrentStep(readStepId(step, ""), completionResult, snapshot);
}

async function loadExternalTaskStepStatus(step, snapshot) {
  var state = studentDashboardStore.getState();
  var course = readSelectedCourse(state);
  var module = readSelectedModule(state);

  return studentDashboardService.loadExternalTaskStep({
    courseId: course ? course.id : snapshot.courseId,
    assignmentId: course ? (course.assignmentId || course.courseAssignmentId || "") : "",
    courseAssignmentId: course ? (course.courseAssignmentId || course.assignmentId || "") : "",
    moduleId: module ? module.id : snapshot.moduleId,
    stepId: readStepId(step, "")
  });
}

async function submitExternalTaskStep(step, submissionRequest, snapshot) {
  var state = studentDashboardStore.getState();
  var course = readSelectedCourse(state);
  var module = readSelectedModule(state);
  var session = readSelectedSession(state);
  var config = submissionRequest && submissionRequest.config ? submissionRequest.config : {};
  var result = null;

  result = await studentDashboardService.submitExternalTask({
    courseId: course ? course.id : snapshot.courseId,
    assignmentId: course ? (course.assignmentId || course.courseAssignmentId || "") : "",
    courseAssignmentId: course ? (course.courseAssignmentId || course.assignmentId || "") : "",
    moduleId: module ? module.id : snapshot.moduleId,
    sessionId: session ? session.id : snapshot.sessionId,
    practiceModeKey: snapshot.practiceModeKey,
    modeId: snapshot.practiceModeKey,
    stepId: readStepId(step, ""),
    taskTitle: readExternalTaskTitle(step, config),
    checklistSnapshot: readExternalTaskChecklist(config),
    studentNote: submissionRequest ? submissionRequest.studentNote : "",
    files: submissionRequest ? submissionRequest.files : [],
    previousSubmissionId: submissionRequest && submissionRequest.previousSubmissionId ? submissionRequest.previousSubmissionId : "",
    isResubmission: Boolean(submissionRequest && submissionRequest.isResubmission),
    maxFileSizeMb: config.maxFileSizeMb || 10,
    classId: state.student ? state.student.classId : "",
    locationId: state.student ? (state.student.locationId || state.student.primaryLocationId) : ""
  });

  if (result && result.submission) {
    applyExternalTaskSubmissionResult(result.submission);
  }

  return result;
}

function applyExternalTaskSubmissionResult(submission) {
  var state = studentDashboardStore.getState();

  studentDashboardStore.setState({
    courses: updateCoursesWithExternalTaskSubmission(state.courses || [], submission)
  });
}

function updateCoursesWithExternalTaskSubmission(courses, submission) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var courseIndex = 0;
  var updatedCourses = [];

  while (courseIndex < safeCourses.length) {
    updatedCourses.push(updateCourseWithExternalTaskSubmission(safeCourses[courseIndex], submission));
    courseIndex = courseIndex + 1;
  }

  return updatedCourses;
}

function updateCourseWithExternalTaskSubmission(course, submission) {
  if (!course || !submission || course.id !== submission.courseId) {
    return course;
  }

  return Object.assign({}, course, {
    modules: updateModulesWithExternalTaskSubmission(course.modules, submission)
  });
}

function updateModulesWithExternalTaskSubmission(modules, submission) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var updatedModules = [];
  var moduleIndex = 0;

  while (moduleIndex < safeModules.length) {
    updatedModules.push(updateModuleWithExternalTaskSubmission(safeModules[moduleIndex], submission));
    moduleIndex = moduleIndex + 1;
  }

  return updatedModules;
}

function updateModuleWithExternalTaskSubmission(module, submission) {
  if (!module || module.id !== submission.moduleId) {
    return module;
  }

  return Object.assign({}, module, {
    sessions: updateSessionsWithExternalTaskSubmission(module.sessions, submission)
  });
}

function updateSessionsWithExternalTaskSubmission(sessions, submission) {
  var safeSessions = Array.isArray(sessions) ? sessions : [];
  var updatedSessions = [];
  var sessionIndex = 0;

  while (sessionIndex < safeSessions.length) {
    updatedSessions.push(updateSessionWithExternalTaskSubmission(safeSessions[sessionIndex], submission));
    sessionIndex = sessionIndex + 1;
  }

  return updatedSessions;
}

function updateSessionWithExternalTaskSubmission(session, submission) {
  var practiceModes = session && session.practiceModes && typeof session.practiceModes === "object" ? session.practiceModes : {};
  var keys = Object.keys(practiceModes);
  var updatedPracticeModes = Object.assign({}, practiceModes);
  var keyIndex = 0;

  while (keyIndex < keys.length) {
    updatedPracticeModes[keys[keyIndex]] = updatePracticeModeWithExternalTaskSubmission(practiceModes[keys[keyIndex]], submission);
    keyIndex = keyIndex + 1;
  }

  return Object.assign({}, session, {
    practiceModes: updatedPracticeModes
  });
}

function updatePracticeModeWithExternalTaskSubmission(practiceMode, submission) {
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps : [];
  var updatedSteps = [];
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    if (steps[stepIndex] && steps[stepIndex].id === submission.stepId) {
      updatedSteps.push(Object.assign({}, steps[stepIndex], {
        latestExternalTaskSubmission: submission,
        externalTaskReviewStatus: submission.reviewStatus || "pending"
      }));
    } else {
      updatedSteps.push(steps[stepIndex]);
    }
    stepIndex = stepIndex + 1;
  }

  return Object.assign({}, practiceMode, {
    steps: updatedSteps
  });
}

function updateCourseProgress(courses, progressResult) {
  var updatedCourses = [];
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    updatedCourses.push(updateCourseProgressEntry(courses[courseIndex], progressResult));
    courseIndex = courseIndex + 1;
  }

  return updatedCourses;
}

function updateCourseProgressEntry(course, progressResult) {
  if (!course || course.id !== progressResult.courseId) {
    return course;
  }

  return Object.assign({}, course, {
    modules: updateModuleProgressList(course.modules, progressResult)
  });
}

function updateModuleProgressList(modules, progressResult) {
  var updatedModules = [];
  var moduleIndex = 0;
  var safeModules = Array.isArray(modules) ? modules : [];

  while (moduleIndex < safeModules.length) {
    updatedModules.push(updateModuleProgressEntry(safeModules[moduleIndex], progressResult));
    moduleIndex = moduleIndex + 1;
  }

  return updatedModules;
}

function updateModuleProgressEntry(module, progressResult) {
  if (!module || module.id !== progressResult.moduleId) {
    return module;
  }

  return Object.assign({}, module, {
    sessions: updateSessionProgressList(module.sessions, progressResult)
  });
}

function updateSessionProgressList(sessions, progressResult) {
  var updatedSessions = [];
  var sessionIndex = 0;
  var safeSessions = Array.isArray(sessions) ? sessions : [];

  while (sessionIndex < safeSessions.length) {
    updatedSessions.push(updateSessionProgressEntry(safeSessions[sessionIndex], progressResult));
    sessionIndex = sessionIndex + 1;
  }

  return updatedSessions;
}

function updateSessionProgressEntry(session, progressResult) {
  var practiceModes = {};
  var existingProgress = null;

  if (!session || session.id !== progressResult.sessionId) {
    return session;
  }

  existingProgress = session.progress || createDefaultProgress(progressResult.courseId, progressResult.moduleId, progressResult.sessionId);
  practiceModes = Object.assign({}, existingProgress.practiceModes || {});
  practiceModes[progressResult.practiceModeKey] = {
    completedStepIds: progressResult.completedStepIds || [],
    completionResults: progressResult.completionResults || {},
    completed: progressResult.completed === true,
    updatedAt: Date.now()
  };

  return Object.assign({}, session, {
    progress: Object.assign({}, existingProgress, {
      practiceModes: practiceModes,
      updatedAt: Date.now()
    })
  });
}

function readSelectedCourse(state) {
  var courses = state.courses || [];
  var courseId = state.selectedCourseId || readFirstId(courses);
  var courseIndex = 0;

  while (courseIndex < courses.length) {
    if (courses[courseIndex].id === courseId) {
      return courses[courseIndex];
    }

    courseIndex = courseIndex + 1;
  }

  return null;
}

function readSelectedModule(state) {
  var course = readSelectedCourse(state);
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var moduleId = state.selectedModuleId || readFirstId(modules);
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (modules[moduleIndex].id === moduleId) {
      return modules[moduleIndex];
    }

    moduleIndex = moduleIndex + 1;
  }

  return null;
}

function readSelectedSession(state) {
  var module = readSelectedModule(state);
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var sessionId = state.selectedSessionId || readFirstId(sessions);
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    if (sessions[sessionIndex].id === sessionId) {
      return sessions[sessionIndex];
    }

    sessionIndex = sessionIndex + 1;
  }

  return null;
}

function readSelectedPracticeMode(state) {
  var session = readSelectedSession(state);
  var practiceModes = normalizePracticeModes(session ? session.practiceModes : null);
  var practiceMode = practiceModes[state.selectedPracticeModeKey || "beforeClass"];

  if (practiceMode) {
    return practiceMode;
  }

  return practiceModes.beforeClass;
}

function readFirstId(items) {
  if (Array.isArray(items) && items.length > 0) {
    return items[0].id;
  }

  return null;
}

function readFirstIncompleteStepIndex(practiceMode, progress) {
  var steps = readSortedSteps(practiceMode ? practiceMode.steps : []);
  var completedStepIds = progress && Array.isArray(progress.completedStepIds) ? progress.completedStepIds : [];
  var stepIndex = 0;

  while (stepIndex < steps.length) {
    if (completedStepIds.indexOf(readStepId(steps[stepIndex], "")) === -1) {
      return stepIndex;
    }

    stepIndex = stepIndex + 1;
  }

  return 0;
}

function createPracticeModePlayerSignature(courseId, moduleId, sessionId, practiceModeKey, steps, progress) {
  var signature = courseId + "|" + moduleId + "|" + sessionId + "|" + practiceModeKey;
  var stepIndex = 0;
  var completedStepIds = progress && Array.isArray(progress.completedStepIds) ? progress.completedStepIds : [];

  while (stepIndex < steps.length) {
    signature += "|" + readStepId(steps[stepIndex], "") + ":" + readStepOrder(steps[stepIndex]);
    stepIndex = stepIndex + 1;
  }

  signature += "|completed:" + completedStepIds.join(",");
  signature += "|done:" + (progress && progress.completed === true ? "true" : "false");
  return signature;
}

function readStudentActor(state) {
  var student = state.student;

  if (student && typeof student.id === "string" && student.id.length > 0) {
    return {
      id: student.id,
      role: "student"
    };
  }

  return {
    id: "preview-student",
    role: "student"
  };
}

function readCourseProgressPercent(course) {
  return calculateSharedCourseCompletion(course);
}

function readOverallProgressPercent(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var total = 0;
  var complete = 0;
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    total = total + countCourseSteps(safeCourses[courseIndex]);
    complete = complete + countCourseCompletedSteps(safeCourses[courseIndex]);
    courseIndex = courseIndex + 1;
  }

  return calculatePercent(complete, total);
}

function countCourseSteps(course) {
  return countSharedCourseSteps(course);
}

function countCourseCompletedSteps(course) {
  return countSharedCourseCompletedSteps(course);
}

function readStudentName(student) {
  if (!student || typeof student !== "object") {
    return "Your practice path";
  }

  if (typeof student.displayName === "string" && student.displayName.length > 0) {
    return student.displayName;
  }

  if (typeof student.name === "string" && student.name.length > 0) {
    return student.name;
  }

  if (typeof student.fullName === "string" && student.fullName.length > 0) {
    return student.fullName;
  }

  return "Your practice path";
}

function readModuleProgressPercent(module) {
  return calculatePercent(countModuleCompletedSteps(module), countModuleSteps(module));
}

function readSessionCompletionPercent(session) {
  return calculatePercent(countSessionCompletedSteps(session), countSessionSteps(session));
}

function countModuleSteps(module) {
  return countSharedModuleSteps(module);
}

function countModuleCompletedSteps(module) {
  return countSharedModuleCompletedSteps(module);
}

function countSessionSteps(session) {
  return countSharedSessionSteps(session);
}

function countSessionCompletedSteps(session) {
  return countSharedSessionCompletedSteps(session);
}

function countCompletedSteps(steps, completedStepIds) {
  var count = 0;
  var stepIndex = 0;
  var safeCompletedStepIds = Array.isArray(completedStepIds) ? completedStepIds : [];

  while (stepIndex < steps.length) {
    if (isStepCompleteForDisplay(steps[stepIndex], safeCompletedStepIds)) {
      count = count + 1;
    }

    stepIndex = stepIndex + 1;
  }

  return count;
}

function isStepCompleteForDisplay(step, completedStepIds) {
  if (isExternalTaskStep(step)) {
    return readStepExternalTaskReviewStatus(step) === "complete";
  }

  return completedStepIds.indexOf(readStepId(step, "")) !== -1;
}

function isExternalTaskStep(step) {
  var type = step && typeof step.type === "string" ? step.type : "";
  return type === "externalTask" || type === "ExternalTaskStep";
}

function readStepExternalTaskReviewStatus(step) {
  var submission = step && (step.latestExternalTaskSubmission || step.externalTaskSubmission) ? (step.latestExternalTaskSubmission || step.externalTaskSubmission) : null;

  if (!submission) {
    return "";
  }

  return submission.reviewStatus || "pending";
}

function readPracticeModeProgress(progress, practiceModeKey) {
  if (!progress || !progress.practiceModes || !progress.practiceModes[practiceModeKey]) {
    return {
      completedStepIds: [],
      completionResults: {},
      completed: false
    };
  }

  return {
    completedStepIds: Array.isArray(progress.practiceModes[practiceModeKey].completedStepIds)
      ? progress.practiceModes[practiceModeKey].completedStepIds
      : [],
    completionResults: readCompletionResults(progress.practiceModes[practiceModeKey].completionResults),
    completed: progress.practiceModes[practiceModeKey].completed === true
  };
}

function readCompletionResults(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.assign({}, value);
}

function createDefaultProgress(courseId, moduleId, sessionId) {
  return {
    courseId: courseId,
    moduleId: moduleId,
    sessionId: sessionId,
    practiceModes: {},
    updatedAt: null
  };
}

function readSortedSteps(steps) {
  var safeSteps = Array.isArray(steps) ? steps.slice() : [];
  safeSteps.sort(function (a, b) {
    return readStepOrder(a) - readStepOrder(b);
  });
  return safeSteps;
}

function readStepOrder(step) {
  if (!step || typeof step.order !== "number") {
    return 0;
  }

  return step.order;
}

function readStepId(step, fallbackValue) {
  if (!step || typeof step.id !== "string" || step.id.length === 0) {
    return fallbackValue;
  }

  return step.id;
}

function readStepType(step) {
  if (!step || typeof step.type !== "string") {
    return "";
  }

  return step.type;
}

function readStepConfig(step) {
  if (!step || !step.config || typeof step.config !== "object" || Array.isArray(step.config)) {
    return {};
  }

  return step.config;
}

function readExternalTaskTitle(step, config) {
  if (config && typeof config.title === "string" && config.title.length > 0) {
    return config.title;
  }

  return readLocalizedText(step ? step.title : "", "External Task");
}

function readExternalTaskChecklist(config) {
  if (config && Array.isArray(config.checklist)) {
    return config.checklist.slice();
  }

  if (config && typeof config.checklist === "string") {
    return config.checklist.split(/\r?\n|,/).map(function (item) {
      return item.trim();
    }).filter(Boolean);
  }

  return [];
}

function calculatePlayerProgress(stepIndex, stepCount) {
  if (stepCount <= 0) {
    return 0;
  }

  return Math.round(((stepIndex + 1) / stepCount) * 100);
}

function calculatePercent(completedCount, totalCount) {
  if (totalCount <= 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}

function clampNumber(value, minimumValue, maximumValue) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return minimumValue;
  }

  if (value < minimumValue) {
    return minimumValue;
  }

  if (value > maximumValue) {
    return maximumValue;
  }

  return value;
}

function createPracticeModeKeys() {
  return ["beforeClass", "classroomLesson", "afterClass", "dailyPractice"];
}

function normalizePracticeModes(practiceModes) {
  var defaults = createDefaultPracticeModes();

  return {
    beforeClass: normalizePracticeMode(defaults.beforeClass, readPracticeMode(practiceModes, "beforeClass")),
    classroomLesson: normalizePracticeMode(defaults.classroomLesson, readPracticeMode(practiceModes, "classroomLesson")),
    afterClass: normalizePracticeMode(defaults.afterClass, readPracticeMode(practiceModes, "afterClass")),
    dailyPractice: normalizePracticeMode(defaults.dailyPractice, readPracticeMode(practiceModes, "dailyPractice"))
  };
}

function createDefaultPracticeModes() {
  return {
    beforeClass: createPracticeMode("beforeClass", "Before Class", "Prepare students before the live lesson.", 1),
    classroomLesson: createPracticeMode("classroomLesson", "Classroom Lesson", "Reserve space for teacher-led lesson notes and in-person activities.", 2),
    afterClass: createPracticeMode("afterClass", "After Class", "Reinforce what students practiced during class.", 3),
    dailyPractice: createPracticeMode("dailyPractice", "Five Minute Daily Practice", "Give students short daily review practice between lessons.", 4)
  };
}

function createPracticeMode(key, title, purpose, order) {
  return {
    key: key,
    title: {
      en: title,
      ru: "",
      ky: ""
    },
    purpose: purpose,
    status: "shell",
    enabled: true,
    steps: [],
    order: order
  };
}

function readPracticeMode(practiceModes, practiceModeKey) {
  if (!practiceModes || typeof practiceModes !== "object" || Array.isArray(practiceModes)) {
    return null;
  }

  if (!practiceModes[practiceModeKey] || typeof practiceModes[practiceModeKey] !== "object") {
    return null;
  }

  return practiceModes[practiceModeKey];
}

function normalizePracticeMode(defaultMode, existingMode) {
  if (!existingMode) {
    return defaultMode;
  }

  return {
    key: defaultMode.key,
    title: readPracticeModeTitle(existingMode.title, defaultMode.title),
    purpose: typeof existingMode.purpose === "string" ? existingMode.purpose : defaultMode.purpose,
    status: typeof existingMode.status === "string" ? existingMode.status : defaultMode.status,
    enabled: typeof existingMode.enabled === "boolean" ? existingMode.enabled : defaultMode.enabled,
    steps: Array.isArray(existingMode.steps) ? existingMode.steps.slice() : [],
    order: defaultMode.order
  };
}

function readPracticeModeTitle(title, fallbackTitle) {
  if (typeof title === "string") {
    return {
      en: title,
      ru: "",
      ky: ""
    };
  }

  if (!title || typeof title !== "object" || Array.isArray(title)) {
    return fallbackTitle;
  }

  return {
    en: typeof title.en === "string" ? title.en : fallbackTitle.en,
    ru: typeof title.ru === "string" ? title.ru : fallbackTitle.ru,
    ky: typeof title.ky === "string" ? title.ky : fallbackTitle.ky
  };
}

function readLocalizedText(value, fallbackText) {
  if (typeof value === "string") {
    return value || fallbackText;
  }

  if (!value || typeof value !== "object") {
    return fallbackText;
  }

  if (typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }

  if (typeof value.ru === "string" && value.ru.length > 0) {
    return value.ru;
  }

  if (typeof value.ky === "string" && value.ky.length > 0) {
    return value.ky;
  }

  return fallbackText;
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
