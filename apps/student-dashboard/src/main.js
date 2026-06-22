import { onAuthStateChanged, signOut } from "firebase/auth";
import { OQUWAY_BUILD_VERSION } from "../../../packages/shared/version.js?v=1.1.209-open-integrations";
import { auth } from "../../../packages/firebase/auth/index.js?v=1.1.209-open-integrations";
import { PracticeModePlayer } from "../../../packages/shared/player/index.js?v=1.1.209-open-integrations";
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
} from "../../../packages/domain/progress/index.js?v=1.1.201-course-creator-stability-followup";
import {
  createEmptyState,
  createErrorState,
  createStatusBadge,
  formatStatusLabel,
  renderEmotionalCheckInGate
} from "../../../packages/ui/index.js?v=1.1.209-open-integrations";
import { emotionalCheckInService } from "../../../packages/shared/emotionalCheckIns/index.js?v=1.1.209-open-integrations";
import { studentDashboardStore } from "./ui/state/studentDashboardState.js?v=1.1.209-open-integrations";
import { studentDashboardService } from "./ui/services/studentDashboardService.js?v=1.1.209-open-integrations";
import {
  STUDENT_PROFILE_AVATARS,
  createStudentProfileSnapshot,
  readAvatarById,
  readStudentProfilePreferences,
  saveStudentProfilePreferences
} from "./ui/services/profileService.js?v=1.1.209-open-integrations";

var appElement = document.getElementById("app");
var authInitialized = false;
var practiceModePlayer = null;
var practiceModePlayerSignature = "";

console.log("[oquway-build]", OQUWAY_BUILD_VERSION);

studentDashboardStore.subscribe(function (state) {
  render(state);
});

render(studentDashboardStore.getState());

if (appElement) {
  appElement.addEventListener("click", handleAppClick);
  appElement.addEventListener("change", handleAppChange);
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

  studentDashboardService.loadDashboard(profile);
}

function isPreviewMode() {
  return window.location.search.indexOf("preview=1") !== -1;
}

function redirectToStudentLogin(message) {
  if (message && window.sessionStorage) {
    window.sessionStorage.setItem("oquwayStudentLoginMessage", message);
  }

  window.location.href = "../student-login/index.html?cb=" + encodeURIComponent(OQUWAY_BUILD_VERSION);
}

async function clearStudentSessionAndRedirect(message) {
  clearStudentSessionMarker();

  if (auth.currentUser) {
    await signOut(auth);
  }

  redirectToStudentLogin(message);
}

function clearStudentSessionMarker() {
  if (!window.sessionStorage) {
    return;
  }

  window.sessionStorage.removeItem("oquwayStudentSessionUid");
  window.sessionStorage.removeItem("oquwayStudentSessionStartedAt");
  window.sessionStorage.removeItem("oquwayStudentClassId");
  window.sessionStorage.removeItem("oquwayStudentClassName");
  window.sessionStorage.removeItem("oquwayStudentLocationId");
  window.sessionStorage.removeItem("oquwayStudentProfile");
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

  if (state.isPlayerLoading) {
    appElement.innerHTML = buildActivityLoadingView();
    return;
  }

  if (state.playerMode) {
    if (appElement.querySelector("#student-practice-player-root") && practiceModePlayer) {
      updatePlayerStatusChrome(state);
      return;
    }

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
  var courseFocusContinueButton = event.target.closest(".course-focus-continue-btn");
  var courseFocusRetryButton = event.target.closest(".course-focus-retry-btn");
  var courseJourneyButton = event.target.closest(".course-journey-node");
  var journeyScrollButton = event.target.closest(".course-journey-scroll-btn");
  var activityScrollButton = event.target.closest(".course-activity-scroll-btn");
  var bonusButton = event.target.closest(".student-bonus-claim-btn");
  var sectionButton = event.target.closest("[data-student-section]");
  var profileTabButton = event.target.closest("[data-profile-tab]");
  var profileAvatarButton = event.target.closest("[data-profile-avatar-id]");
  var profileTitleButton = event.target.closest("[data-profile-title-id]");

  if (sectionButton) {
    showStudentSection(sectionButton.getAttribute("data-student-section"));
    return;
  }

  if (profileTabButton) {
    studentDashboardStore.setState({
      profileTab: profileTabButton.getAttribute("data-profile-tab") || "overview",
      statusMessage: ""
    });
    return;
  }

  if (profileAvatarButton) {
    selectProfileAvatar(profileAvatarButton.getAttribute("data-profile-avatar-id"));
    return;
  }

  if (profileTitleButton) {
    selectProfileTitle(profileTitleButton.getAttribute("data-profile-title-id"));
    return;
  }

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

  if (courseFocusContinueButton) {
    continueCourseFocus();
    return;
  }

  if (courseFocusRetryButton) {
    openCourseFocusMode(courseFocusRetryButton.getAttribute("data-course-id"));
    return;
  }

  if (courseActionButton) {
    openCourseFocusMode(courseActionButton.getAttribute("data-course-id"));
    return;
  }

  if (courseButton) {
    openCourseFocusMode(courseButton.getAttribute("data-course-id"));
    return;
  }

  if (courseJourneyButton) {
    selectModule(courseJourneyButton.getAttribute("data-module-id"));
    return;
  }

  if (journeyScrollButton) {
    scrollNearestCourseStrip(journeyScrollButton, ".course-journey-track");
    return;
  }

  if (activityScrollButton) {
    scrollNearestCourseStrip(activityScrollButton, ".course-activity-strip");
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
    closeCourseFocusMode();
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

function handleAppChange(event) {
  var historyRangeSelect = event.target.closest("[data-profile-history-range]");

  if (historyRangeSelect) {
    studentDashboardStore.setState({
      activityHistoryRange: historyRangeSelect.value || "30"
    });
  }
}

function showStudentSection(sectionName) {
  var safeSection = sectionName === "profile" || sectionName === "courses" ? sectionName : "home";

  studentDashboardStore.setState({
    activeStudentSection: safeSection,
    courseFocusActive: false,
    playerMode: false,
    statusMessage: ""
  });
}

function selectProfileAvatar(avatarId) {
  var state = studentDashboardStore.getState();
  var avatar = readAvatarById(avatarId);
  var snapshot = createStudentProfileSnapshot({
    student: state.student,
    courses: state.courses,
    progressSummary: state.progressSummary
  });
  var student = Object.assign({}, state.student || {}, {
    avatarId: avatar.id
  });

  saveStudentProfilePreferences(student, {
    avatarId: avatar.id,
    activeTitleId: state.student && state.student.activeTitleId ? state.student.activeTitleId : snapshot.preferences.activeTitleId
  });

  studentDashboardStore.setState({
    student: student,
    statusMessage: "Avatar updated."
  });
}

function selectProfileTitle(titleId) {
  var state = studentDashboardStore.getState();
  var snapshot = createStudentProfileSnapshot({
    student: state.student,
    courses: state.courses,
    progressSummary: state.progressSummary
  });
  var title = snapshot.titles.find(function (item) {
    return item.id === titleId;
  });

  if (!title || !title.unlocked) {
    studentDashboardStore.setState({
      statusMessage: "This title unlocks through learning progress."
    });
    return;
  }

  var student = Object.assign({}, state.student || {}, {
    activeTitleId: title.id
  });

  saveStudentProfilePreferences(student, {
    avatarId: state.student && state.student.avatarId ? state.student.avatarId : snapshot.preferences.avatarId,
    activeTitleId: title.id
  });

  studentDashboardStore.setState({
    student: student,
    statusMessage: "Title updated."
  });
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

async function openCourseFocusMode(courseId) {
  var openResult = null;

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

  if (await runStudentCourseCheckInGate(openResult, function () {
    enterCourseFocusMode(openResult);
  })) {
    return;
  }

  enterCourseFocusMode(openResult);
}

function enterCourseFocusMode(openResult) {
  var target = openResult.openTarget || {};

  applyOpenedCourseResult(openResult);

  studentDashboardStore.setState({
    courseFocusActive: true,
    isCourseOpening: false,
    playerMode: false,
    selectedModuleId: target.moduleId || readFirstPlayableModuleId(openResult.course) || readFirstId(openResult.course.modules || []),
    selectedSessionId: target.sessionId || null,
    selectedPracticeModeKey: target.practiceModeKey || "beforeClass",
    statusMessage: openResult.emptyCourseState && openResult.emptyCourseState.message
      ? openResult.emptyCourseState.message
      : ""
  });
}

async function runStudentCourseCheckInGate(openResult, onContinue) {
  var checkInContext = buildStudentCourseCheckInContext(openResult);
  var visibility = null;

  if (isPreviewMode() || !checkInContext) {
    return false;
  }

  try {
    visibility = await emotionalCheckInService.shouldShowCheckIn(checkInContext);

    if (!visibility || visibility.shouldShow !== true) {
      return false;
    }

    showStudentCourseCheckInGate(checkInContext, openResult, onContinue, "");
    return true;
  } catch (error) {
    showStudentCourseCheckInGate(
      checkInContext,
      openResult,
      onContinue,
      "We could not check whether you already checked in. You can try again or continue without checking in."
    );
    return true;
  }
}

function showStudentCourseCheckInGate(checkInContext, openResult, onContinue, initialError) {
  var gateController = null;

  studentDashboardStore.setState({
    isCourseOpening: false,
    statusMessage: "",
    error: null
  });

  gateController = renderEmotionalCheckInGate(appElement, checkInContext, {
    initialError: initialError,
    onSave: function (emotionKey) {
      return emotionalCheckInService.recordCheckIn(checkInContext, emotionKey);
    },
    onContinue: onContinue,
    onContinueWithoutCheckIn: onContinue,
    onRetry: function () {
      if (gateController && typeof gateController.destroy === "function") {
        gateController.destroy();
      }

      runStudentCourseCheckInGate(openResult, onContinue).then(function (handled) {
        if (!handled && typeof onContinue === "function") {
          onContinue();
        }
      });
    }
  });
}

function buildStudentCourseCheckInContext(openResult) {
  var state = studentDashboardStore.getState();
  var student = openResult.student || state.student || {};
  var course = openResult.course || {};
  var target = openResult.openTarget || {};
  var participantUserId = readStudentAuthId(student);
  var programId = readText(course.id || openResult.courseId);
  var classId = readText(student.classId || student.primaryClassId || course.classId);

  if (!participantUserId || !programId) {
    return null;
  }

  // TODO: Reuse this context builder for teacher, admin, monitor, practice, and adult program entry points.
  return emotionalCheckInService.buildContext({
    participantUserId: participantUserId,
    participantProfileId: readText(student.id || student.studentId || student.userId || participantUserId),
    participantRole: "student",
    schoolId: readText(student.schoolId || student.locationId || student.primaryLocationId),
    locationId: readText(student.locationId || student.primaryLocationId),
    classId: classId,
    primaryClassId: readText(student.primaryClassId),
    className: readText(student.className),
    timezone: readText(student.timezone || student.locationTimezone || student.schoolTimezone)
  }, {
    schoolId: readText(student.schoolId || student.locationId || student.primaryLocationId),
    locationId: readText(student.locationId || student.primaryLocationId),
    programId: programId,
    programType: "course",
    programName: readLocalizedText(course.title || course.name, "Course"),
    classId: classId,
    className: readText(course.className || student.className),
    courseId: programId,
    courseName: readLocalizedText(course.title || course.name, "Course"),
    moduleId: readText(target.moduleId),
    moduleName: readSelectedTargetModuleName(course, target.moduleId),
    classSessionId: readText(course.classSessionId || target.classSessionId),
    programSessionId: readText(course.programSessionId || target.programSessionId),
    scheduledLessonId: readText(course.scheduledLessonId || target.scheduledLessonId),
    courseSessionId: readText(course.courseSessionId || target.courseSessionId),
    contextScope: classId ? "class-session" : "course-entry",
    checkInSource: "student_panel",
    timezone: readText(student.timezone || student.locationTimezone || student.schoolTimezone || course.timezone)
  });
}

function readStudentAuthId(student) {
  var currentUser = auth.currentUser;

  if (currentUser && currentUser.uid) {
    return currentUser.uid;
  }

  return readText(student.authUid || student.uid || student.userId || student.id || student.studentId);
}

function readSelectedTargetModuleName(course, moduleId) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var index = 0;

  while (index < modules.length) {
    if (modules[index] && modules[index].id === moduleId) {
      return readLocalizedText(modules[index].title || modules[index].name, "");
    }

    index += 1;
  }

  return "";
}

function applyOpenedCourseResult(openResult) {
  var target = openResult.openTarget || {};
  var selectedCourseId = readOpenedDashboardCourseId(openResult);

  studentDashboardStore.setState({
    isCourseOpening: false,
    courses: mergeOpenedCourse(studentDashboardStore.getState().courses || [], openResult.course, selectedCourseId),
    selectedCourseId: selectedCourseId,
    selectedModuleId: target.moduleId || null,
    selectedSessionId: target.sessionId || null,
    selectedPracticeModeKey: target.practiceModeKey || "beforeClass",
    courseFocusActive: true,
    currentStepIndex: 0,
    practiceModeFinished: false,
    error: null,
    statusMessage: ""
  });
}

function closeCourseFocusMode() {
  studentDashboardStore.setState({
    courseFocusActive: false,
    playerMode: false,
    currentStepIndex: 0,
    practiceModeFinished: false,
    statusMessage: ""
  });
}

async function continueCourseFocus() {
  var state = studentDashboardStore.getState();
  var course = readSelectedCourse(state);
  var nextAction = getNextCourseAction(course);

  if (!nextAction || !nextAction.isPlayable) {
    studentDashboardStore.setState({
      statusMessage: nextAction && nextAction.message ? nextAction.message : "This course does not have a playable activity yet."
    });
    return;
  }

  await openPracticeMode(
    nextAction.courseId,
    nextAction.moduleId,
    nextAction.sessionId,
    nextAction.practiceModeKey
  );
}

async function continueLearning() {
  var state = studentDashboardStore.getState();
  var recommendation = await studentDashboardService.continueLearning(state.courses || []);

  if (!recommendation || !recommendation.courseId) {
    return;
  }

  await openCourseFocusMode(recommendation.courseId);
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
  var course = readCourseById(studentDashboardStore.getState().courses || [], courseId);
  var result = await studentDashboardService.startPracticeMode(courseId, moduleId, sessionId, practiceModeKey, course ? course.courseRecordSource : "");

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
    throw new Error("Progress could not be saved. Try again.");
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

function mergeOpenedCourse(courses, openedCourse, requestedCourseId) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var mergedCourses = [];
  var courseIndex = 0;
  var replaced = false;
  var replacementId = readText(requestedCourseId || openedCourse.id);

  while (courseIndex < safeCourses.length) {
    if (courseMatchesOpenedCourse(safeCourses[courseIndex], openedCourse, replacementId)) {
      mergedCourses.push(Object.assign({}, openedCourse, {
        id: safeCourses[courseIndex].id || replacementId,
        courseId: safeCourses[courseIndex].courseId || openedCourse.courseId || replacementId,
        assignmentId: openedCourse.assignmentId || safeCourses[courseIndex].assignmentId || "",
        courseAssignmentId: openedCourse.courseAssignmentId || safeCourses[courseIndex].courseAssignmentId || safeCourses[courseIndex].assignmentId || ""
      }));
      replaced = true;
    } else {
      mergedCourses.push(safeCourses[courseIndex]);
    }

    courseIndex = courseIndex + 1;
  }

  if (!replaced && isPreviewMode()) {
    mergedCourses.push(openedCourse);
  }

  return mergedCourses;
}

function updatePlayerStatusChrome(state) {
  var errorElement = document.getElementById("student-player-error-region");
  var statusElement = document.getElementById("student-player-status-region");

  if (errorElement) {
    errorElement.innerHTML = state.error ? escapeHtml(state.error) : "";
    errorElement.style.display = state.error ? "" : "none";
  }

  if (statusElement) {
    statusElement.innerHTML = state.statusMessage ? escapeHtml(state.statusMessage) : "";
    statusElement.style.display = state.statusMessage ? "" : "none";
  }
}

function readOpenedDashboardCourseId(openResult) {
  var course = openResult && openResult.course ? openResult.course : {};

  return readText(openResult && (openResult.dashboardCourseId || openResult.requestedCourseId))
    || readText(course.id || course.courseId || course.moduleCourseId || course.canonicalCourseId);
}

function courseMatchesOpenedCourse(course, openedCourse, requestedCourseId) {
  if (!course || !openedCourse) {
    return false;
  }

  return courseHasIdentity(course, requestedCourseId)
    || courseHasIdentity(course, openedCourse.id)
    || courseHasIdentity(course, openedCourse.courseId)
    || courseHasIdentity(course, openedCourse.moduleCourseId)
    || courseHasIdentity(course, openedCourse.canonicalCourseId)
    || courseHasIdentity(openedCourse, course.id)
    || courseHasIdentity(openedCourse, course.courseId)
    || courseHasIdentity(openedCourse, course.moduleCourseId)
    || courseHasIdentity(openedCourse, course.canonicalCourseId);
}

function courseHasIdentity(course, courseId) {
  var safeCourseId = readText(courseId);

  if (!course || !safeCourseId) {
    return false;
  }

  return course.id === safeCourseId
    || course.courseId === safeCourseId
    || course.moduleCourseId === safeCourseId
    || course.canonicalCourseId === safeCourseId
    || course.catalogCourseId === safeCourseId
    || course.sourceCourseId === safeCourseId
    || course.publishedCourseId === safeCourseId
    || course.targetCourseId === safeCourseId;
}

function buildLoadingView() {
  return buildStudentLaunchLoading("Loading courses...", "Preparing your classroom learning path.", "📚");
}

function buildCourseOpeningView() {
  return buildStudentLaunchLoading("Opening course...", "Finding your next activity.", "🚀");
}

function buildActivityLoadingView() {
  return buildStudentLaunchLoading("Launching activity...", "Warming up your learning workspace.", "⭐");
}

function buildStudentLaunchLoading(title, note, icon) {
  return '<section class="student-launch-loading" role="status" aria-live="polite">'
    + '<div class="student-launch-card">'
    + '<div class="student-launch-orbit" aria-hidden="true"><span>' + escapeHtml(icon) + '</span><i></i><b></b></div>'
    + '<p class="student-eyebrow">OquWay is getting ready</p>'
    + '<h1>' + escapeHtml(title) + '</h1>'
    + '<p>' + escapeHtml(note) + '</p>'
    + '<div class="student-launch-dots" aria-hidden="true"><span></span><span></span><span></span></div>'
    + '</div>'
    + '</section>';
}

function buildDashboardView(state) {
  var courses = state.courses || [];
  var selectedCourse = readSelectedCourse(state);
  var studentName = readStudentName(state.student);
  var activeSection = state.activeStudentSection || "home";
  var overallProgress = state.progressSummary && typeof state.progressSummary.overallProgressPercent === "number"
    ? state.progressSummary.overallProgressPercent
    : readOverallProgressPercent(courses);
  var html = "";

  if (state.courseFocusActive) {
    return buildCourseFocusView(state);
  }

  html += '<main class="student-home-shell">';
  html += renderStudentHomeSidebar(state, courses, overallProgress);
  html += '<section class="student-home-workspace">';
  html += '<section class="student-hero student-hero-v2">';
  html += '<div class="student-avatar-wrap">' + buildStudentAvatar(state.student, studentName) + '</div>';
  html += '<div class="student-hero-copy">';
  html += '<p class="student-eyebrow">Student Dashboard</p>';
  html += '<h1>Welcome back, ' + escapeHtml(studentName) + '</h1>';
  html += '<p>' + escapeHtml(readMotivationalMessage(overallProgress)) + '</p>';
  html += '<div class="student-profile-meta"><span>' + escapeHtml(readStudentClassLabel(state.student)) + '</span><span>' + escapeHtml(readStudentLocationLabel(state.student)) + '</span></div>';
  html += '</div>';
  html += '<div class="student-hero-mascot" aria-hidden="true">' + renderSvgIcon("robot") + '</div>';
  html += '<div class="student-hero-actions"><div class="student-hero-progress">' + overallProgress + '% complete</div><button type="button" class="student-reload-btn">Refresh</button><button type="button" class="student-switch-student-btn">Switch Student</button></div>';
  html += '</section>';

  if (state.actorIsPreview) {
    html += '<div class="student-warning">You are viewing in preview mode. Sign in as a student to save progress to Firestore.</div>';
  }

  if (state.error) {
    html += buildStudentDashboardErrorState(state.error);
  }

  if (state.statusMessage) {
    html += '<div class="student-status">' + escapeHtml(state.statusMessage) + '</div>';
  }

  html += buildStudentDebugPanel(state.assignmentDebug);

  if (activeSection === "profile") {
    html += buildStudentProfileCenter(state);
    html += '</section></main>';
    return html;
  }

  if (courses.length === 0) {
    html += '<section class="student-dashboard-v2-grid student-dashboard-empty-grid">';
    html += '<div class="student-dashboard-main-stack">';
    html += createEmptyState("No courses are ready yet", "Your teacher will assign learning soon.", {
      className: "student-empty student-home-empty",
      beforeHtml: '<div class="student-empty-illustration student-empty-svg">' + renderSvgIcon("book") + '</div>'
    });
    html += '</div><aside class="student-dashboard-side-stack">';
    html += buildProgressCard(state.progressSummary, overallProgress);
    html += buildDailyBonusCard(state.dailyBonus, false);
    html += buildIntentionPoints(state.intentionPoints);
    html += '</aside></section></section></main>';
    return html;
  }

  if (activeSection === "courses") {
    html += buildStudentCoursesCenter(state, courses, selectedCourse, overallProgress);
    html += '</section></main>';
    return html;
  }

  html += '<section class="student-dashboard-v2-grid">';
  html += '<div class="student-dashboard-main-stack">';
  html += buildContinueLearningCard(state.continueLearning, selectedCourse);
  html += '<section class="student-panel student-my-courses-panel"><div class="student-section-head"><div><p class="student-eyebrow">My Courses</p><h2>Assigned Courses</h2></div><span>' + courses.length + ' course' + (courses.length === 1 ? "" : "s") + '</span></div>';
  html += buildCourseCards(courses, state.selectedCourseId);
  html += '</section>';
  html += '</div>';
  html += '<aside class="student-dashboard-side-stack">';
  html += buildUpcomingActivityCard(state.continueLearning, selectedCourse);
  html += buildProgressCard(state.progressSummary, overallProgress);
  html += buildDailyBonusCard(state.dailyBonus, false);
  html += buildIntentionPoints(state.intentionPoints);
  html += '</aside>';
  html += '</section>';
  html += '</section></main>';

  return html;
}

function renderStudentHomeSidebar(state, courses, overallProgress) {
  var studentName = readStudentName(state.student);
  var courseCount = Array.isArray(courses) ? courses.length : 0;
  var activeSection = state.activeStudentSection || "home";

  return '<aside class="course-focus-sidebar student-home-sidebar">'
    + '<div class="course-focus-brand"><span>' + renderSvgIcon("oquway") + '</span><strong>OquWay</strong></div>'
    + '<nav class="course-focus-nav" aria-label="Student dashboard navigation">'
    + buildStudentSectionNavItem("home", "home", "Home", activeSection)
    + buildStudentSectionNavItem("book", "courses", "Courses", activeSection)
    + buildStudentSectionNavItem("trophy", "profile", "Profile", activeSection)
    + '</nav>'
    + '<div class="course-focus-profile student-home-profile">'
    + buildStudentAvatar(state.student, studentName)
    + '<strong>' + escapeHtml(studentName) + '</strong>'
    + '<span>' + escapeHtml(readStudentClassLabel(state.student)) + '</span>'
    + '<div class="student-progress-bar"><span style="width:' + overallProgress + '%"></span></div>'
    + '<small>' + overallProgress + '% overall</small>'
    + '<small>' + courseCount + ' assigned course' + (courseCount === 1 ? "" : "s") + '</small>'
    + '</div>'
    + '</aside>';
}

function buildStudentSectionNavItem(iconName, sectionName, label, activeSection) {
  var activeClass = activeSection === sectionName ? " course-focus-nav-item-active" : "";

  return '<button type="button" class="course-focus-nav-item student-section-nav-item' + activeClass + '" data-student-section="' + escapeHtml(sectionName) + '">' + renderSvgIcon(iconName) + '<span>' + escapeHtml(label) + '</span></button>';
}

function buildStudentDashboardErrorState(message) {
  return '<section class="student-error-wrap">'
    + createErrorState(message, "Use Refresh to try again. If this keeps happening, ask your teacher to check your course assignment.", {
      className: "student-error",
      titleTag: "span"
    })
    + '<button type="button" class="student-reload-btn student-error-retry-btn">Retry</button>'
    + '</section>';
}

function buildStudentCoursesCenter(state, courses, selectedCourse, overallProgress) {
  return '<section class="student-dashboard-v2-grid">'
    + '<div class="student-dashboard-main-stack">'
    + '<section class="student-panel student-my-courses-panel"><div class="student-section-head"><div><p class="student-eyebrow">Courses</p><h2>Assigned Courses</h2></div><span>' + courses.length + ' course' + (courses.length === 1 ? "" : "s") + '</span></div>'
    + buildCourseCards(courses, state.selectedCourseId)
    + '</section>'
    + '</div>'
    + '<aside class="student-dashboard-side-stack">'
    + buildDashboardCourseOverview(courses, selectedCourse)
    + buildProgressCard(state.progressSummary, overallProgress)
    + '</aside>'
    + '</section>';
}

function buildStudentProfileCenter(state) {
  var snapshot = createStudentProfileSnapshot({
    student: state.student,
    courses: state.courses,
    progressSummary: state.progressSummary
  });
  var activeTab = state.profileTab || "overview";
  var tabContent = "";

  if (activeTab === "achievements") {
    tabContent = buildProfileAchievementsTab(snapshot);
  } else if (activeTab === "journey") {
    tabContent = buildProfileJourneyTab(snapshot);
  } else if (activeTab === "skills") {
    tabContent = buildProfileSkillsTab(snapshot);
  } else if (activeTab === "history") {
    tabContent = buildProfileHistoryTab(snapshot, state.activityHistoryRange || "30");
  } else {
    tabContent = buildProfileOverviewTab(snapshot);
  }

  return '<section class="student-profile-center">'
    + buildProfileHeader(snapshot)
    + buildProfileTabs(activeTab)
    + tabContent
    + '</section>';
}

function buildProfileHeader(snapshot) {
  var studentName = readStudentName(snapshot.student);
  var title = snapshot.activeTitle && snapshot.activeTitle.label ? snapshot.activeTitle.label : "Learner";
  var level = snapshot.level;

  return '<section class="student-profile-hero-card">'
    + '<div class="student-profile-avatar-large">' + buildStudentAvatar(snapshot.student, studentName) + '</div>'
    + '<div class="student-profile-hero-copy"><p class="student-eyebrow">Learning Profile</p><h2>' + escapeHtml(studentName) + '</h2><p>' + escapeHtml(title) + '</p>'
    + '<div class="student-profile-level-line"><strong>Level ' + level.level + '</strong><span>' + level.progressPercent + '% to Level ' + level.nextLevel + '</span></div>'
    + '<div class="student-profile-level-bar"><span style="width:' + level.progressPercent + '%"></span></div>'
    + '<small>' + level.xpToNextLevel + ' XP to Level ' + level.nextLevel + '</small></div>'
    + '<div class="student-profile-hero-stats">'
    + buildProfileMiniStat("XP", snapshot.metrics.xpEarned)
    + buildProfileMiniStat("Stars", snapshot.metrics.starsEarned)
    + buildProfileMiniStat("Achievements", snapshot.metrics.achievementsEarned)
    + '</div>'
    + '</section>';
}

function buildProfileMiniStat(label, value) {
  return '<span><strong>' + escapeHtml(String(value)) + '</strong>' + escapeHtml(label) + '</span>';
}

function buildProfileTabs(activeTab) {
  return '<div class="student-profile-tabs" role="tablist" aria-label="Profile sections">'
    + buildProfileTabButton("overview", "Overview", activeTab)
    + buildProfileTabButton("achievements", "Achievements", activeTab)
    + buildProfileTabButton("journey", "Learning Journey", activeTab)
    + buildProfileTabButton("skills", "Skills & Mastery", activeTab)
    + buildProfileTabButton("history", "Activity History", activeTab)
    + '</div>';
}

function buildProfileTabButton(tabName, label, activeTab) {
  var activeClass = activeTab === tabName ? " student-profile-tab-active" : "";
  var selected = activeTab === tabName ? "true" : "false";

  return '<button type="button" class="student-profile-tab' + activeClass + '" role="tab" aria-selected="' + selected + '" data-profile-tab="' + escapeHtml(tabName) + '">' + escapeHtml(label) + '</button>';
}

function buildProfileOverviewTab(snapshot) {
  var metrics = snapshot.metrics;

  return '<section class="student-profile-grid">'
    + '<div class="student-profile-main-stack">'
    + '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Overview</p><h2>Your progress</h2></div><span>Level ' + snapshot.level.level + '</span></div>'
    + '<div class="student-profile-summary-grid">'
    + buildProfileSummaryCard("XP Earned", metrics.xpEarned)
    + buildProfileSummaryCard("Stars Earned", metrics.starsEarned)
    + buildProfileSummaryCard("Activities Completed", metrics.activitiesCompleted)
    + buildProfileSummaryCard("Modules Completed", metrics.modulesCompleted)
    + buildProfileSummaryCard("Achievements Earned", metrics.achievementsEarned)
    + buildProfileSummaryCard("Current Streak", metrics.currentStreak)
    + buildProfileSummaryCard("Longest Streak", metrics.longestStreak)
    + '</div></section>'
    + buildAvatarPicker(snapshot)
    + '</div>'
    + '<aside class="student-profile-side-stack">'
    + buildTitlePicker(snapshot)
    + buildProfileRecentAchievements(snapshot)
    + '</aside>'
    + '</section>';
}

function buildProfileSummaryCard(label, value) {
  return '<div class="student-profile-summary-card"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}

function buildAvatarPicker(snapshot) {
  var html = '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Avatar</p><h2>Choose your look</h2></div><span>' + STUDENT_PROFILE_AVATARS.length + ' options</span></div><div class="student-avatar-picker">';
  var index = 0;

  while (index < STUDENT_PROFILE_AVATARS.length) {
    var avatar = STUDENT_PROFILE_AVATARS[index];
    var selectedClass = snapshot.avatar.id === avatar.id ? " student-avatar-option-selected" : "";
    html += '<button type="button" class="student-avatar-option student-built-avatar-' + escapeHtml(avatar.tone) + selectedClass + '" data-profile-avatar-id="' + escapeHtml(avatar.id) + '" aria-label="' + escapeHtml("Select " + avatar.label + " avatar") + '"><span>' + escapeHtml(avatar.initials) + '</span><small>' + escapeHtml(avatar.label) + '</small></button>';
    index = index + 1;
  }

  return html + '</div></section>';
}

function buildTitlePicker(snapshot) {
  var html = '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Title</p><h2>Active title</h2></div><span>' + escapeHtml(snapshot.activeTitle.label) + '</span></div><div class="student-title-list">';
  var index = 0;

  while (index < snapshot.titles.length) {
    var title = snapshot.titles[index];
    var className = "student-title-option" + (title.active ? " student-title-option-active" : "") + (!title.unlocked ? " student-title-option-locked" : "");
    html += '<button type="button" class="' + className + '" data-profile-title-id="' + escapeHtml(title.id) + '"' + disabled(!title.unlocked) + '><strong>' + escapeHtml(title.label) + '</strong><span>' + escapeHtml(title.unlocked ? title.description : "Locked") + '</span></button>';
    index = index + 1;
  }

  return html + '</div></section>';
}

function buildProfileRecentAchievements(snapshot) {
  var earned = snapshot.achievements.filter(function (achievement) { return achievement.earned; }).slice(0, 3);
  var html = '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Recently earned</p><h2>Achievements</h2></div></div>';

  if (earned.length === 0) {
    return html + '<p class="student-profile-muted">Complete your first activity to start earning achievements.</p></section>';
  }

  html += '<div class="student-achievement-mini-list">';
  earned.forEach(function (achievement) {
    html += '<div><span>' + renderSvgIcon("trophy") + '</span><strong>' + escapeHtml(achievement.name) + '</strong><small>' + escapeHtml(achievement.category) + '</small></div>';
  });

  return html + '</div></section>';
}

function buildProfileAchievementsTab(snapshot) {
  var categories = ["Learning", "Participation", "Mastery", "Consistency", "Exploration"];
  var html = '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Achievements</p><h2>Growth milestones</h2></div><span>' + snapshot.metrics.achievementsEarned + ' earned</span></div>';

  categories.forEach(function (category) {
    var items = snapshot.achievements.filter(function (achievement) { return achievement.category === category; });
    html += '<div class="student-achievement-category"><h3>' + escapeHtml(category) + '</h3><div class="student-achievement-grid">';
    items.forEach(function (achievement) {
      var className = achievement.earned ? "student-achievement-card" : "student-achievement-card student-achievement-locked";
      html += '<article class="' + className + '"><span class="student-achievement-icon">' + renderSvgIcon(achievement.earned ? "trophy" : "lock") + '</span><strong>' + escapeHtml(achievement.name) + '</strong><p>' + escapeHtml(achievement.description) + '</p><div class="student-progress-bar"><span style="width:' + achievement.progressPercent + '%"></span></div><small>' + escapeHtml(achievement.earned ? (formatProfileDate(achievement.dateEarned) || "Earned") : achievement.progress + " / " + achievement.threshold) + '</small></article>';
    });
    html += '</div></div>';
  });

  return html + '</section>';
}

function buildProfileJourneyTab(snapshot) {
  var html = '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Learning Journey</p><h2>Course roadmap</h2></div><span>' + snapshot.journey.courses.length + ' course' + (snapshot.journey.courses.length === 1 ? "" : "s") + '</span></div>';

  if (snapshot.journey.courses.length === 0) {
    return html + '<p class="student-profile-muted">Your assigned course journey will appear here.</p></section>';
  }

  snapshot.journey.courses.forEach(function (course) {
    html += '<article class="student-journey-course"><div class="student-journey-course-head"><strong>' + escapeHtml(course.title) + '</strong><span>' + course.progressPercent + '%</span></div><div class="student-progress-bar"><span style="width:' + course.progressPercent + '%"></span></div><div class="student-journey-module-list">';
    course.modules.forEach(function (module) {
      html += '<button type="button" class="student-journey-module student-journey-' + escapeHtml(module.status) + '" data-student-section="courses"><span>' + renderJourneyStatusIcon(module) + '</span><strong>' + escapeHtml(module.title) + '</strong><small>' + module.completedSteps + ' / ' + module.totalSteps + ' learning activities</small></button>';
    });
    html += '</div></article>';
  });

  return html + '</section>';
}

function renderJourneyStatusIcon(module) {
  if (module.mastered) {
    return renderSvgIcon("trophy");
  }

  if (module.status === "completed") {
    return renderSvgIcon("check");
  }

  if (module.status === "inProgress") {
    return renderSvgIcon("play");
  }

  if (module.status === "locked") {
    return renderSvgIcon("lock");
  }

  return renderSvgIcon("book");
}

function buildProfileSkillsTab(snapshot) {
  var html = '<section class="student-profile-card"><div class="student-section-head"><div><p class="student-eyebrow">Skills & Mastery</p><h2>Learning areas</h2></div><span>' + snapshot.skills.length + ' skills</span></div>';

  if (snapshot.skills.length === 0) {
    return html + '<p class="student-profile-muted">Skill progress will appear as you complete activities.</p></section>';
  }

  html += '<div class="student-skill-list">';
  snapshot.skills.forEach(function (skill) {
    html += '<article class="student-skill-card"><div><strong>' + escapeHtml(skill.name) + '</strong><span>' + skill.progressPercent + '% complete</span></div><div class="student-progress-bar"><span style="width:' + skill.progressPercent + '%"></span></div><footer><span>Mastered ' + skill.mastered + '</span><span>Completed ' + skill.completed + '</span><span>In progress ' + skill.inProgress + '</span></footer></article>';
  });

  return html + '</div></section>';
}

function buildProfileHistoryTab(snapshot, range) {
  var filteredActivities = filterProfileActivities(snapshot.activities, range);
  var html = '<section class="student-profile-card"><div class="student-section-head student-profile-history-head"><div><p class="student-eyebrow">Activity History</p><h2>Recent learning</h2></div><label><span>Show</span><select data-profile-history-range><option value="7"' + selected(range === "7") + '>Last 7 days</option><option value="30"' + selected(range === "30") + '>Last 30 days</option><option value="all"' + selected(range === "all") + '>All time</option></select></label></div>';

  if (filteredActivities.length === 0) {
    return html + '<p class="student-profile-muted">Completed activity history will appear here.</p></section>';
  }

  html += '<div class="student-history-table"><div class="student-history-head"><span>Activity</span><span>Date</span><span>Score</span><span>Stars</span><span>XP</span></div>';
  filteredActivities.forEach(function (activity) {
    html += '<div class="student-history-row"><span><strong>' + escapeHtml(activity.activity) + '</strong><small>' + escapeHtml(activity.courseTitle) + ' - ' + escapeHtml(activity.moduleTitle) + '</small></span><span>' + escapeHtml(formatProfileDate(activity.date) || "Recent") + '</span><span>' + activity.score + '%</span><span>' + buildStarText(activity.starsEarned) + '</span><span>+' + activity.xpEarned + '</span></div>';
  });

  return html + '</div></section>';
}

function filterProfileActivities(activities, range) {
  var safeActivities = Array.isArray(activities) ? activities : [];
  var days = range === "7" ? 7 : (range === "all" ? 0 : 30);
  var cutoff = days > 0 ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;

  return safeActivities.filter(function (activity) {
    if (!activity.completed) {
      return false;
    }

    if (!cutoff || !activity.date) {
      return true;
    }

    return readProfileDateMs(activity.date) >= cutoff;
  }).slice(0, 25);
}

function buildStarText(starCount) {
  var count = Math.max(0, Math.round(Number(starCount) || 0));
  return count + " star" + (count === 1 ? "" : "s");
}

function selected(value) {
  return value ? " selected" : "";
}

function formatProfileDate(value) {
  var ms = readProfileDateMs(value);

  if (!ms) {
    return "";
  }

  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function readProfileDateMs(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value && typeof value.seconds === "number") {
    return value.seconds * 1000;
  }

  var parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function buildStudentDebugPanel(assignmentDebug) {
  if (!isStudentDebugEnabled()) {
    return "";
  }

  return '<pre class="student-debug-panel" data-student-debug="assignment">' + escapeHtml(JSON.stringify(assignmentDebug || {}, null, 2)) + '</pre>';
}

function isStudentDebugEnabled() {
  return window.location.search.indexOf("debug=true") !== -1;
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
    var activityCount = readCourseActivityCount(course);
    var completedModuleCount = countCompletedModules(course);
    var status = readCourseLearningStatus(course);
    var title = readLocalizedText(course.title, "Untitled Course");
    html += '<article class="student-course-card' + activeClass + '" data-course-id="' + escapeHtml(course.id) + '">';
    html += renderDashboardCourseArt(course, "student-course-art");
    html += '<div class="student-course-card-copy">' + buildStudentStatusBadge(status) + '<strong>' + escapeHtml(title) + '</strong><p>' + escapeHtml(readLocalizedText(course.description, "Practice activities are ready when your teacher assigns sessions.")) + '</p></div>';
    html += '<div class="student-course-meta"><span>' + completedModuleCount + ' / ' + moduleCount + ' modules</span><span>' + activityCount + ' learning activities</span><span>' + progressPercent + '% complete</span></div>';
    html += '<div class="student-progress-bar"><span style="width:' + progressPercent + '%"></span></div>';
    html += '<button type="button" class="student-course-open-btn" data-course-id="' + escapeHtml(course.id) + '">' + (progressPercent > 0 ? "Continue" : "Start") + '</button>';
    html += '</article>';
    courseIndex = courseIndex + 1;
  }

  html += '</div>';
  return html;
}

function renderDashboardCourseArt(course, className) {
  var imageUrl = readImageUrl(course && (course.heroImageUrl || course.iconUrl || course.imageUrl || course.thumbnailUrl));

  if (imageUrl) {
    return '<div class="' + escapeHtml(className || "student-course-art") + '"><img src="' + escapeHtml(imageUrl) + '" alt=""></div>';
  }

  return '<div class="' + escapeHtml(className || "student-course-art") + ' student-course-art-fallback">' + renderSvgIcon("computer") + '</div>';
}

function buildDashboardCourseOverview(courses, selectedCourse) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var course = selectedCourse || (safeCourses.length > 0 ? safeCourses[0] : null);
  var progressPercent = course ? readCourseProgressPercent(course) : 0;

  if (!course) {
    return createEmptyState("Choose a course", "Assigned courses will appear here when your teacher adds them.", {
      className: "student-empty"
    });
  }

  return '<div class="student-course-heading student-dashboard-course-overview">'
    + '<div><p class="student-eyebrow">Ready to learn</p><h2>' + escapeHtml(readLocalizedText(course.title, "Untitled Course")) + '</h2><p>Open a course to focus on one learning path, see what is next, and choose a module.</p><div class="student-course-detail-meta"><span>' + safeCourses.length + ' assigned course' + (safeCourses.length === 1 ? "" : "s") + '</span><span>' + progressPercent + '% on selected course</span></div></div>'
    + '<div class="student-big-progress">' + progressPercent + '%</div>'
    + '<button type="button" class="student-course-open-btn" data-course-id="' + escapeHtml(course.id) + '">Open Course Focus</button>'
    + '</div>';
}

function buildContinueLearningCard(continueLearning, selectedCourse) {
  var recommendation = continueLearning || {};
  var courseTitle = recommendation.courseTitle || (selectedCourse ? readLocalizedText(selectedCourse.title, "Untitled Course") : "Start your first course");
  var moduleTitle = recommendation.moduleTitle || "First module";
  var progressPercent = typeof recommendation.progressPercent === "number" ? recommendation.progressPercent : 0;
  var actionLabel = recommendation.actionLabel || (progressPercent > 0 ? "Continue" : "Start Learning");

  return '<section class="student-continue-card">'
    + renderDashboardCourseArt(selectedCourse, "student-continue-art")
    + '<div class="student-continue-copy"><p class="student-eyebrow">Continue Learning</p><h2>' + escapeHtml(courseTitle) + '</h2><p>' + escapeHtml(moduleTitle) + '</p><small>' + escapeHtml(readLastOpenedLabel(recommendation.lastOpenedAt)) + '</small><div class="student-progress-bar"><span style="width:' + progressPercent + '%"></span></div></div>'
    + '<div class="student-continue-action"><strong>' + progressPercent + '%</strong><button type="button" class="student-continue-learning-btn">' + escapeHtml(actionLabel) + '</button></div>'
    + '</section>';
}

function buildUpcomingActivityCard(continueLearning, selectedCourse) {
  var recommendation = continueLearning || {};
  var courseTitle = recommendation.courseTitle || (selectedCourse ? readLocalizedText(selectedCourse.title, "Course") : "");
  var moduleTitle = recommendation.moduleTitle || "";

  if (!courseTitle && !moduleTitle) {
    return "";
  }

  return '<section class="student-panel student-upcoming-card">'
    + '<div class="student-upcoming-icon">' + renderSvgIcon("calendar") + '</div>'
    + '<div><p class="student-eyebrow">Next Activity</p><h2>' + escapeHtml(moduleTitle || "Ready to learn") + '</h2><p>' + escapeHtml(courseTitle) + '</p><small>' + escapeHtml(readLastOpenedLabel(recommendation.lastOpenedAt)) + '</small></div>'
    + '</section>';
}

function buildCourseFocusView(state) {
  var course = readSelectedCourse(state);
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var progress = readCourseFocusProgress(course);
  var nextAction = getNextCourseAction(course);
  var selectedModule = readSelectedFocusModule(state, course, nextAction);
  var html = "";

  html += '<main class="course-focus-shell course-focus-active">';

  if (state.error) {
    html += createErrorState(state.error, "", {
      className: "student-error",
      titleTag: "span"
    });
  }

  if (state.statusMessage) {
    html += '<div class="student-status">' + escapeHtml(state.statusMessage) + '</div>';
  }

  if (!course) {
    html += '<section class="course-focus-empty student-empty"><h2>Course unavailable</h2><p>We could not find this course in your assigned course list.</p><button type="button" class="student-back-dashboard-btn">Back to Dashboard</button></section>';
    html += '</main>';
    return html;
  }

  html += renderCourseFocusSidebar(state, course, progress);
  html += '<section class="course-focus-workspace">';
  html += renderCourseRibbon(course, progress, nextAction);
  html += '<section class="course-focus-main">';
  html += '<div class="course-focus-primary">';
  html += renderCourseHero(course, progress);
  html += renderCourseModules(course, modules, {
    selectedModuleId: selectedModule ? selectedModule.id : state.selectedModuleId,
    progress: progress
  });
  html += renderModuleActivities(course, selectedModule, state);
  html += renderSelectedModulePanel(course, selectedModule, state);
  html += '</div>';
  html += '<aside class="course-focus-right-rail">';
  html += renderNextUpCard(nextAction);
  html += renderClassChatPanel(state);
  html += '</aside>';
  html += '</section>';
  html += '</section>';
  html += '</main>';

  return html;
}

function renderCourseFocusSidebar(state, course, progress) {
  var studentName = readStudentName(state.student);
  var courseCount = Array.isArray(state.courses) ? state.courses.length : 0;

  return '<aside class="course-focus-sidebar">'
    + '<div class="course-focus-brand"><span>' + renderSvgIcon("oquway") + '</span><strong>OquWay</strong></div>'
    + '<nav class="course-focus-nav" aria-label="Course focus navigation">'
    + '<button type="button" class="course-focus-nav-item student-section-nav-item" data-student-section="home">' + renderSvgIcon("home") + '<span>Home</span></button>'
    + '<button type="button" class="course-focus-nav-item student-section-nav-item course-focus-nav-item-active" data-student-section="courses">' + renderSvgIcon("book") + '<span>Courses</span></button>'
    + '<button type="button" class="course-focus-nav-item student-section-nav-item" data-student-section="profile">' + renderSvgIcon("trophy") + '<span>Achievements</span></button>'
    + '<button type="button" class="course-focus-nav-item student-section-nav-item" data-student-section="profile">' + renderSvgIcon("gift") + '<span>Rewards</span></button>'
    + '</nav>'
    + '<div class="course-focus-profile">'
    + buildStudentAvatar(state.student, studentName)
    + '<strong>' + escapeHtml(studentName) + '</strong>'
    + '<span>' + escapeHtml(readStudentClassLabel(state.student)) + '</span>'
    + '<div class="student-progress-bar"><span style="width:' + progress.percent + '%"></span></div>'
    + '<small>' + progress.percent + '% on this course</small>'
    + '<small>' + courseCount + ' assigned course' + (courseCount === 1 ? "" : "s") + '</small>'
    + '</div>'
    + '</aside>';
}

function renderCourseRibbon(course, progress, nextAction) {
  var continueDisabled = !nextAction || !nextAction.isPlayable;

  return '<section class="course-focus-ribbon">'
    + '<button type="button" class="student-back-dashboard-btn course-focus-back-btn">' + renderSvgIcon("arrowLeft") + '<span>Back</span></button>'
    + '<div class="course-focus-ribbon-title">' + renderCourseIcon(course, "course-focus-course-icon") + '<strong>' + escapeHtml(readLocalizedText(course.title, "Untitled Course")) + '</strong><span class="course-focus-course-caret">v</span></div>'
    + '<div class="course-focus-ribbon-stat">' + renderSvgIcon("star") + '<strong>' + progress.percent + '%</strong><span>Course Progress</span></div>'
    + '<div class="course-focus-ribbon-stat">' + renderSvgIcon("check") + '<strong>' + progress.completedModules + ' / ' + progress.totalModules + '</strong><span>Milestones</span></div>'
    + '<div class="course-focus-ribbon-stat">' + renderSvgIcon("steps") + '<strong>' + progress.completedSteps + ' / ' + progress.totalSteps + '</strong><span>Learning Activities</span></div>'
    + '<button type="button" class="course-focus-continue-btn"' + disabled(continueDisabled) + '>' + escapeHtml(nextAction && nextAction.buttonLabel ? nextAction.buttonLabel : "Continue") + '<span>' + renderSvgIcon("arrowRight") + '</span></button>'
    + '</section>';
}

function renderCourseHero(course, progress) {
  var xpEarned = readCourseXpEarned(course, progress);
  var badgesEarned = readCourseBadgesEarned(course, progress);
  var heroImage = readImageUrl(course && course.heroImageUrl);
  var heroArt = heroImage
    ? '<img class="course-focus-hero-image" src="' + escapeHtml(heroImage) + '" alt="">'
    : '<div class="course-focus-bot" aria-hidden="true">' + renderSvgIcon("robot") + '</div>';

  return '<section class="course-focus-hero" style="' + escapeHtml(readCourseThemeStyle(course)) + '">'
    + '<div class="course-focus-hero-copy"><p class="course-focus-pill">Course</p><h1>' + escapeHtml(readLocalizedText(course.title, "Untitled Course")) + '</h1><p>' + escapeHtml(readLocalizedText(course.description, "Build the skills you need for school and beyond.")) + '</p></div>'
    + heroArt
    + '<div class="course-focus-hero-progress" style="--course-progress:' + progress.percent + '%"><strong>' + progress.percent + '%</strong><span>Course Progress</span></div>'
    + '<div class="course-focus-stats">'
    + '<span>' + renderSvgIcon("check") + '<strong>' + progress.completedModules + '</strong>Modules Completed</span>'
    + '<span>' + renderSvgIcon("steps") + '<strong>' + progress.completedSteps + ' / ' + progress.totalSteps + '</strong>Learning Activities Completed</span>'
    + '<span>' + renderSvgIcon("star") + '<strong>' + xpEarned + '</strong>XP Earned</span>'
    + '<span>' + renderSvgIcon("gem") + '<strong>' + badgesEarned + '</strong>Badges Earned</span>'
    + '</div>'
    + '</section>';
}

function renderNextUpCard(nextAction) {
  if (!nextAction || !nextAction.isPlayable) {
    return '<section class="course-next-up-card course-next-up-empty"><p class="student-eyebrow">Next Up</p><div class="course-next-up-art">' + renderSvgIcon("rocket") + '</div><h2>Not Ready Yet</h2><p>' + escapeHtml(nextAction && nextAction.message ? nextAction.message : "This course does not have a playable activity yet.") + '</p></section>';
  }

  var estimatedTimeHtml = nextAction.estimatedTimeLabel
    ? '<div class="course-next-up-time">' + renderSvgIcon("clock") + '<span>' + escapeHtml(nextAction.estimatedTimeLabel) + '</span></div>'
    : '';

  return '<section class="course-next-up-card">'
    + '<p class="student-eyebrow">Next Up</p>'
    + '<div class="course-next-up-art">' + renderSvgIcon("rocket") + '</div>'
    + '<small>' + escapeHtml(nextAction.moduleTitle) + '</small>'
    + '<h2>' + escapeHtml(nextAction.sessionTitle) + '</h2>'
    + '<p>' + escapeHtml(nextAction.practiceModeTitle) + ' - ' + escapeHtml(nextAction.reason) + '</p>'
    + estimatedTimeHtml
    + '</section>';
}

function renderCourseModules(course, modules, progress) {
  var displayTemplate = readCourseDisplayTemplate(course);
  var renderContext = Object.assign({}, progress || {}, {
    visualTheme: readCourseVisualTheme(course),
    course: course
  });
  var html = "";

  if (displayTemplate === "adventurePath") {
    html = renderAdventurePathModules(course, modules, renderContext);
  } else if (displayTemplate === "compactGrid") {
    html = renderCompactGridModules(course, modules, renderContext);
  } else {
    html = renderBasicModuleList(course, modules, renderContext);
  }

  return '<div class="course-theme-scope" style="' + escapeHtml(readCourseThemeStyle(course)) + '">' + html + '</div>';
}

function renderBasicModuleList(course, modules, progress) {
  var safeModules = sortModulesForJourney(Array.isArray(modules) ? modules : []);
  var html = renderModuleTemplateShellStart("course-modules-basic", "Course Modules", "Top-to-bottom module list");
  var moduleIndex = 0;

  if (safeModules.length === 0) {
    return html + '<div class="course-roadmap-empty">This course is not ready yet.</div></section>';
  }

  html += '<div class="course-basic-module-list">';
  while (moduleIndex < safeModules.length) {
    html += renderTemplateModuleButton(safeModules[moduleIndex], moduleIndex, progress, "basic");
    moduleIndex = moduleIndex + 1;
  }
  html += '</div></section>';
  return html;
}

function renderAdventurePathModules(course, modules, progress) {
  var safeModules = sortModulesForJourney(Array.isArray(modules) ? modules : []);
  var visualTheme = progress && progress.visualTheme ? progress.visualTheme : readCourseVisualTheme(course);
  var rowHeight = readCourseThemePathSpacing(visualTheme);
  var pathHeight = Math.max(220, safeModules.length * rowHeight + 70);
  var html = '<section class="course-roadmap course-adventure-path">';
  var moduleIndex = 0;

  html += '<div class="course-adventure-header">'
    + renderCourseIcon(course, "course-adventure-course-icon")
    + '<div><p class="student-eyebrow">Adventure Path</p><h2>' + escapeHtml(readLocalizedText(course && course.title, "Course Journey")) + '</h2></div>'
    + '<span>' + calculatePercent(countJourneyCompleteModules(safeModules), safeModules.length || 1) + '%</span>'
    + '</div>';

  if (safeModules.length === 0) {
    return html + '<div class="course-roadmap-empty">This course is not ready yet.</div></section>';
  }

  html += '<div class="course-adventure-stage" style="min-height:' + pathHeight + 'px">';
  html += '<svg class="course-adventure-path-line" viewBox="0 0 100 ' + pathHeight + '" preserveAspectRatio="none" aria-hidden="true">';
  html += '<path d="' + escapeHtml(buildAdventurePathData(safeModules.length, rowHeight)) + '"></path>';
  html += '</svg>';

  while (moduleIndex < safeModules.length) {
    html += renderAdventurePathNode(safeModules[moduleIndex], moduleIndex, progress, rowHeight);
    moduleIndex = moduleIndex + 1;
  }

  html += '</div></section>';
  return html;
}

function renderCompactGridModules(course, modules, progress) {
  var safeModules = sortModulesForJourney(Array.isArray(modules) ? modules : []);
  var html = renderModuleTemplateShellStart("course-modules-grid", "Course Modules", "Compact grid");
  var moduleIndex = 0;

  if (safeModules.length === 0) {
    return html + '<div class="course-roadmap-empty">This course is not ready yet.</div></section>';
  }

  html += '<div class="course-compact-module-grid">';
  while (moduleIndex < safeModules.length) {
    html += renderTemplateModuleButton(safeModules[moduleIndex], moduleIndex, progress, "grid");
    moduleIndex = moduleIndex + 1;
  }
  html += '</div></section>';
  return html;
}

function renderModuleTemplateShellStart(className, title, label) {
  return '<section class="course-roadmap course-module-template ' + className + '">'
    + '<div class="student-section-head course-template-head"><div><h2>' + escapeHtml(title) + '</h2></div><span>' + escapeHtml(label) + '</span></div>';
}

function renderAdventurePathNode(module, moduleIndex, progress, rowHeight) {
  var x = moduleIndex % 2 === 0 ? 28 : 72;
  var y = readAdventureNodeY(moduleIndex, rowHeight);
  var sideClass = moduleIndex % 2 === 0 ? " course-adventure-node-left" : " course-adventure-node-right";

  return renderTemplateModuleButton(module, moduleIndex, progress, "adventure", {
    className: sideClass,
    style: "--node-x:" + x + "%;--node-y:" + y + "px;"
  });
}

function renderTemplateModuleButton(module, moduleIndex, progress, variant, options) {
  var safeModule = module || {};
  var readiness = getModuleReadiness(module);
  var moduleId = readModuleIdValue(safeModule, moduleIndex);
  var selectedModuleId = progress && progress.selectedModuleId ? progress.selectedModuleId : "";
  var isActive = moduleId && moduleId === selectedModuleId;
  var isComplete = readiness.status === "complete";
  var locked = isModuleLocked(module, moduleIndex, progress && progress.course && Array.isArray(progress.course.modules) ? progress.course.modules : []);
  var progressPercent = readModuleProgressPercent(module);
  var variantClass = " course-template-module-" + variant;
  var theme = progress && progress.visualTheme ? progress.visualTheme : readCourseVisualTheme(progress && progress.course);
  var themeClass = " course-theme-icon-" + theme.moduleIconStyle + " course-theme-badge-" + theme.badgeStyle + " course-theme-density-" + theme.pathDensity;
  var activeClass = isActive ? " course-template-module-current" : "";
  var completeClass = isComplete ? " course-template-module-complete" : "";
  var lockedClass = locked ? " course-template-module-locked" : "";
  var extraClass = options && options.className ? options.className : "";
  var style = options && options.style ? ' style="' + escapeHtml(options.style) + '"' : "";
  var title = readLocalizedText(safeModule.title || safeModule.name, "Module " + (moduleIndex + 1));
  var detailText = readiness.completedSteps + " / " + readiness.totalSteps + " learning activities";
  var statusIcon = locked ? renderSvgIcon("lock") : (isComplete ? renderSvgIcon("check") : renderModuleIcon(module, readiness.status));

  if (!module) {
    title = "Module data missing";
    detailText = "This module could not be loaded.";
  }

  return '<button type="button" class="course-template-module-card course-journey-node' + variantClass + themeClass + activeClass + completeClass + lockedClass + extraClass + '" data-module-id="' + escapeHtml(moduleId) + '"' + style + ' aria-label="' + escapeHtml("Open module " + title) + '">'
    + '<span class="course-template-module-icon">' + renderStudentModuleVisual(module, statusIcon, moduleIndex, progress) + '</span>'
    + '<span class="course-template-module-copy"><strong>' + escapeHtml(title) + '</strong><small>' + escapeHtml(readiness.label) + ' - ' + escapeHtml(detailText) + '</small></span>'
    + '<span class="course-template-module-progress" aria-hidden="true"><span style="width:' + progressPercent + '%"></span></span>'
    + '<span class="course-template-module-badge">' + statusIcon + '</span>'
    + '</button>';
}

function renderStudentModuleVisual(module, fallbackIcon, moduleIndex, progress) {
  var theme = progress && progress.visualTheme ? progress.visualTheme : readCourseVisualTheme(progress && progress.course);
  var iconUrl = readImageUrl(module && module.iconUrl);

  if (theme.moduleIconStyle === "minimal") {
    return '<span class="course-template-module-number">' + (moduleIndex + 1) + '</span>';
  }

  if (theme.moduleIconStyle === "numbered" && !iconUrl) {
    return '<span class="course-template-module-number">' + (moduleIndex + 1) + '</span>';
  }

  if (iconUrl) {
    return '<img src="' + escapeHtml(iconUrl) + '" alt="">';
  }

  return fallbackIcon;
}

function buildAdventurePathData(moduleCount, rowHeight) {
  var path = "";
  var moduleIndex = 0;

  while (moduleIndex < moduleCount) {
    var x = moduleIndex % 2 === 0 ? 28 : 72;
    var y = readAdventureNodeY(moduleIndex, rowHeight);

    if (moduleIndex === 0) {
      path += "M " + x + " " + y;
    } else {
      var previousX = (moduleIndex - 1) % 2 === 0 ? 28 : 72;
      var previousY = readAdventureNodeY(moduleIndex - 1, rowHeight);
      path += " C " + previousX + " " + (previousY + 78) + ", " + x + " " + (y - 78) + ", " + x + " " + y;
    }

    moduleIndex = moduleIndex + 1;
  }

  return path;
}

function readAdventureNodeY(moduleIndex, rowHeight) {
  return 72 + moduleIndex * (rowHeight || 138);
}

function renderModuleActivities(course, module, state) {
  var activities = readModuleActivities(course, module);
  var readiness = getModuleReadiness(module);
  var html = '<section class="course-activities-panel"><div class="student-section-head"><div><h2>' + escapeHtml(module ? readLocalizedText(module.title, "Module") : "Module") + ' Activities</h2></div><span>' + activities.length + ' activit' + (activities.length === 1 ? "y" : "ies") + '</span></div>';
  var activityIndex = 0;

  if (!module || activities.length === 0) {
    return html + '<div class="course-activity-empty">No playable activities are ready in this module yet.</div></section>';
  }

  html += '<div class="course-activity-carousel"><button type="button" class="course-activity-scroll-btn" aria-label="Scroll activities left">' + renderSvgIcon("arrowLeft") + '</button><div class="course-activity-strip" tabindex="0">';
  while (activityIndex < activities.length) {
    html += renderModuleActivityCard(activities[activityIndex], state);
    activityIndex = activityIndex + 1;
  }
  html += '</div><button type="button" class="course-activity-scroll-btn" aria-label="Scroll activities right">' + renderSvgIcon("arrowRight") + '</button></div>';
  html += '<div class="course-module-mini-progress"><span>' + readiness.completedSteps + ' / ' + readiness.totalSteps + ' learning activities complete</span><div class="student-progress-bar"><span style="width:' + readModuleProgressPercent(module) + '%"></span></div></div>';
  html += '</section>';

  return html;
}

function readModuleActivities(course, module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var keys = createPracticeModeKeys();
  var activities = [];
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    var session = sessions[sessionIndex];
    var practiceModes = normalizePracticeModes(session.practiceModes);
    var keyIndex = 0;

    while (keyIndex < keys.length) {
      var key = keys[keyIndex];
      var mode = practiceModes[key];
      var steps = readSortedSteps(mode.steps);
      var progress = readPracticeModeProgress(session.progress, key);
      var completedCount = countCompletedSteps(steps, progress.completedStepIds);

      if (steps.length > 0) {
        activities.push({
          courseId: course.id,
          moduleId: module.id,
          sessionId: session.id,
          practiceModeKey: key,
          title: readLocalizedText(mode.title, "Practice Mode"),
          sessionTitle: readLocalizedText(session.title, "Session"),
          stepType: readPrimaryActivityStepType(steps, key),
          completedCount: completedCount,
          totalSteps: steps.length,
          completed: progress.completed === true || completedCount >= steps.length
        });
      }

      keyIndex = keyIndex + 1;
    }

    sessionIndex = sessionIndex + 1;
  }

  return activities;
}

function renderModuleActivityCard(activity, state) {
  var activeClass = state.selectedSessionId === activity.sessionId && state.selectedPracticeModeKey === activity.practiceModeKey
    ? " course-activity-card-active"
    : "";
  var completeClass = activity.completed ? " course-activity-card-complete" : "";
  var actionLabel = activity.completed ? "Review" : (activity.completedCount > 0 ? "Continue" : "Start");
  var statusText = activity.completed ? "Completed" : (activity.completedCount > 0 ? "In Progress" : "Not Started");

  return '<button type="button" class="student-practice-mode-card course-activity-card' + activeClass + completeClass + '"'
    + ' data-course-id="' + escapeHtml(activity.courseId) + '"'
    + ' data-module-id="' + escapeHtml(activity.moduleId) + '"'
    + ' data-session-id="' + escapeHtml(activity.sessionId) + '"'
    + ' data-practice-mode-key="' + escapeHtml(activity.practiceModeKey) + '">'
    + '<span class="course-activity-icon">' + renderSvgIcon(readActivityIconKey(activity.stepType, activity.practiceModeKey)) + '</span>'
    + '<strong>' + escapeHtml(activity.title) + '</strong>'
    + '<span>' + escapeHtml(readActivityIconLabel(activity.practiceModeKey)) + '</span>'
    + '<small>' + escapeHtml(actionLabel) + ' - ' + activity.completedCount + ' / ' + activity.totalSteps + '</small>'
    + '<em>' + escapeHtml(statusText) + '</em>'
    + '</button>';
}

function readActivityIconLabel(practiceModeKey) {
  if (practiceModeKey === "beforeClass") {
    return "Watch";
  }

  if (practiceModeKey === "inClass") {
    return "Try";
  }

  if (practiceModeKey === "afterClass") {
    return "Quiz";
  }

  return "Do";
}

function scrollNearestCourseStrip(button, stripSelector) {
  var panel = button ? button.closest(".course-roadmap, .course-activities-panel") : null;
  var strip = panel ? panel.querySelector(stripSelector) : null;
  var direction = button && button.nextElementSibling ? -1 : 1;

  if (!strip || typeof strip.scrollBy !== "function") {
    return;
  }

  strip.scrollBy({
    left: Math.max(240, strip.clientWidth * 0.7) * direction,
    behavior: "smooth"
  });
}

function renderCourseIcon(course, className) {
  var iconUrl = readImageUrl(course && course.iconUrl);

  if (iconUrl) {
    return '<span class="' + escapeHtml(className || "course-focus-course-icon") + '"><img src="' + escapeHtml(iconUrl) + '" alt=""></span>';
  }

  return '<span class="' + escapeHtml(className || "course-focus-course-icon") + '">' + renderSvgIcon("computer") + '</span>';
}

function renderModuleIcon(module, readinessStatus) {
  var iconUrl = readImageUrl(module && module.iconUrl);

  if (iconUrl) {
    return '<img class="course-module-icon-img" src="' + escapeHtml(iconUrl) + '" alt="">';
  }

  if (readinessStatus === "complete") {
    return renderSvgIcon("check");
  }

  if (readModulePathType(module) === "bonus") {
    return renderSvgIcon("trophy");
  }

  if (readModulePathType(module) === "extra") {
    return renderSvgIcon("rocket");
  }

  if (hasExplicitModuleLock(module)) {
    return renderSvgIcon("lock");
  }

  return renderSvgIcon("folder");
}

function readImageUrl(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readCourseThemeStyle(course) {
  var themeColor = readSafeCssColor(course && course.themeColor, "#047c70");
  var accentColor = readSafeCssColor(course && course.accentColor, "#22c55e");

  return "--course-theme:" + themeColor + ";--course-accent:" + accentColor + ";";
}

function readCourseVisualTheme(course) {
  var theme = course && course.visualTheme && typeof course.visualTheme === "object" ? course.visualTheme : {};
  return {
    accentColor: readVisualThemeAccentColor(theme.accentColor),
    moduleIconStyle: readVisualThemeIconStyle(theme.moduleIconStyle),
    badgeStyle: readVisualThemeBadgeStyle(theme.badgeStyle),
    pathDensity: readVisualThemePathDensity(theme.pathDensity)
  };
}

function readVisualThemeAccentColor(accentColor) {
  if (accentColor === "emerald" || accentColor === "rose" || accentColor === "amber") {
    return accentColor;
  }

  return "blue";
}

function readVisualThemeIconStyle(moduleIconStyle) {
  if (moduleIconStyle === "courseIcon" || moduleIconStyle === "minimal") {
    return moduleIconStyle;
  }

  return "numbered";
}

function readVisualThemeBadgeStyle(badgeStyle) {
  if (badgeStyle === "soft" || badgeStyle === "solid") {
    return badgeStyle;
  }

  return "pill";
}

function readVisualThemePathDensity(pathDensity) {
  if (pathDensity === "compact" || pathDensity === "spacious") {
    return pathDensity;
  }

  return "comfortable";
}

function readCourseThemePathSpacing(theme) {
  if (theme && theme.pathDensity === "compact") {
    return 112;
  }

  if (theme && theme.pathDensity === "spacious") {
    return 168;
  }

  return 138;
}

function readSafeCssColor(value, fallback) {
  var color = typeof value === "string" ? value.trim() : "";

  if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(color)) {
    return color;
  }

  if (/^rgba?\([0-9,\s.]+\)$/.test(color)) {
    return color;
  }

  if (/^[a-zA-Z]+$/.test(color)) {
    return color;
  }

  return fallback;
}

function readCourseXpEarned(course, progress) {
  if (course && typeof course.xpEarned === "number") {
    return Math.max(0, course.xpEarned);
  }

  if (course && course.progress && typeof course.progress.xpEarned === "number") {
    return Math.max(0, course.progress.xpEarned);
  }

  return Math.max(0, progress.completedSteps * 10);
}

function readCourseBadgesEarned(course, progress) {
  if (course && typeof course.badgesEarned === "number") {
    return Math.max(0, course.badgesEarned);
  }

  if (course && Array.isArray(course.badges)) {
    return course.badges.length;
  }

  return Math.floor(progress.completedModules / 3);
}

function readEstimatedMinutesLabel(module) {
  var value = readEstimatedMinutesValue(module);

  if (!value) {
    return "";
  }

  return "Estimated time: About " + value + " minute" + (value === 1 ? "" : "s") + ".";
}

function readEstimatedMinutesValue(module) {
  return readFirstNumber([
    module ? module.estimatedMinutes : null,
    module ? module.durationMinutes : null,
    module ? module.estimatedDurationMinutes : null
  ]);
}

function readFirstNumber(values) {
  var index = 0;

  while (index < values.length) {
    if (typeof values[index] === "number" && Number.isInteger(values[index]) && values[index] > 0) {
      return values[index];
    }

    if (typeof values[index] === "string" && values[index].trim() && !Number.isNaN(Number(values[index]))) {
      var numberValue = Number(values[index]);
      if (Number.isInteger(numberValue) && numberValue > 0) {
        return numberValue;
      }
    }

    index = index + 1;
  }

  return 0;
}

function sortModulesForJourney(modules) {
  var sortedModules = Array.isArray(modules) ? modules.slice() : [];

  sortedModules.sort(function (left, right) {
    var leftOrder = readModulePathOrder(left);
    var rightOrder = readModulePathOrder(right);

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return 0;
  });

  return sortedModules;
}

function readModulePathOrder(module) {
  if (module && typeof module.pathOrder === "number") {
    return module.pathOrder;
  }

  if (module && typeof module.order === "number") {
    return module.order;
  }

  return 0;
}

function readModulePathType(module) {
  var pathType = readFirstTextValue([
    module && module.pathType,
    module && module.path,
    module && module.track,
    module && module.journeyPath,
    module && module.questType,
    module && module.moduleType
  ]).toLowerCase().replace(/[\s_-]+/g, "");

  if (module && module.isBonus === true) {
    return "bonus";
  }

  if (module && (module.isExtra === true || module.isExtraQuest === true)) {
    return "extra";
  }

  if (pathType === "bonus" || pathType === "bonuspath") {
    return "bonus";
  }

  if (pathType === "extra" || pathType === "extraquest" || pathType === "quest") {
    return "extra";
  }

  return "main";
}

function readCourseDisplayTemplate(course) {
  var displayTemplate = course && typeof course.displayTemplate === "string" ? course.displayTemplate : "";

  if (displayTemplate === "adventurePath" || displayTemplate === "compactGrid") {
    return displayTemplate;
  }

  return "basic";
}

function readModuleIdValue(module, moduleIndex) {
  var id = readFirstTextValue([
    module && module.id,
    module && module.moduleId,
    module && module.uid
  ]);

  if (id) {
    return id;
  }

  return "missing-module-" + (moduleIndex + 1);
}

function readFirstTextValue(values) {
  var index = 0;

  while (index < values.length) {
    if (typeof values[index] === "string" && values[index].trim().length > 0) {
      return values[index].trim();
    }

    index = index + 1;
  }

  return "";
}

function isModuleLocked(module, moduleIndex, modules) {
  if (!module) {
    return true;
  }

  if (hasExplicitModuleLock(module)) {
    return true;
  }

  if (readModuleLearningStatus(module) === "complete") {
    return false;
  }

  return isModuleLockedByDependency(module, moduleIndex, modules);
}

function hasExplicitModuleLock(module) {
  return module && (module.locked === true || module.isLocked === true || module.status === "locked" || module.visibility === "locked");
}

function isModuleLockedByDependency(module, moduleIndex, modules) {
  var safeModules = Array.isArray(modules) ? sortModulesForJourney(modules) : [];
  var ruleType = normalizeStudentModuleUnlockRule(module && module.unlockRuleType || module && module.unlockRules && (module.unlockRules.type || module.unlockRules.unlockRuleType));

  if (ruleType === "open") {
    return false;
  }

  if (ruleType === "percentComplete") {
    return readCourseModulesProgressPercent(safeModules) < readUnlockThresholdPercent(module);
  }

  if (ruleType === "previousComplete") {
    return !isDependencyModuleComplete(readPreviousModuleDependencyId(module, moduleIndex, safeModules), safeModules);
  }

  if (ruleType === "moduleComplete") {
    return !isDependencyModuleComplete(readPrerequisiteModuleId(module), safeModules);
  }

  return false;
}

function normalizeStudentModuleUnlockRule(value) {
  if (value === "previousComplete" || value === "moduleComplete" || value === "percentComplete") {
    return value;
  }

  return "open";
}

function readUnlockThresholdPercent(module) {
  var rules = module && module.unlockRules && typeof module.unlockRules === "object" ? module.unlockRules : {};
  var value = typeof module.unlockThresholdPercent === "number" ? module.unlockThresholdPercent : rules.thresholdPercent;

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 100;
  }

  return Math.max(0, Math.min(100, value));
}

function readPrerequisiteModuleId(module) {
  var rules = module && module.unlockRules && typeof module.unlockRules === "object" ? module.unlockRules : {};
  return readFirstTextValue([
    module && module.prerequisiteModuleId,
    rules.prerequisiteModuleId,
    rules.moduleId
  ]);
}

function readPreviousModuleDependencyId(module, moduleIndex, modules) {
  var prerequisiteModuleId = readPrerequisiteModuleId(module);

  if (prerequisiteModuleId) {
    return prerequisiteModuleId;
  }

  if (typeof moduleIndex === "number" && moduleIndex > 0 && modules[moduleIndex - 1]) {
    return readModuleIdValue(modules[moduleIndex - 1], moduleIndex - 1);
  }

  return "";
}

function isDependencyModuleComplete(moduleId, modules) {
  if (!moduleId) {
    return false;
  }

  return modules.some(function (module, index) {
    return readModuleIdValue(module, index) === moduleId && readModuleLearningStatus(module) === "complete";
  });
}

function readCourseModulesProgressPercent(modules) {
  var completedSteps = 0;
  var totalSteps = 0;

  (modules || []).forEach(function (module) {
    completedSteps = completedSteps + countModuleCompletedSteps(module);
    totalSteps = totalSteps + countModuleSteps(module);
  });

  return calculatePercent(completedSteps, totalSteps);
}

function countJourneyCompleteModules(modules) {
  var count = 0;
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (getModuleReadiness(modules[moduleIndex]).status === "complete") {
      count = count + 1;
    }

    moduleIndex = moduleIndex + 1;
  }

  return count;
}

function readPrimaryActivityStepType(steps, practiceModeKey) {
  var firstStep = Array.isArray(steps) && steps.length > 0 ? steps[0] : null;
  var stepType = readStepType(firstStep);

  if (stepType) {
    return stepType;
  }

  return practiceModeKey || "";
}

function readActivityIconKey(stepType, practiceModeKey) {
  var normalized = String(stepType || "").toLowerCase();

  if (normalized.indexOf("video") !== -1 || practiceModeKey === "beforeClass") {
    return "video";
  }

  if (normalized.indexOf("quiz") !== -1) {
    return "quiz";
  }

  if (normalized.indexOf("external") !== -1 || normalized.indexOf("project") !== -1) {
    return "project";
  }

  if (normalized.indexOf("emotional") !== -1 || normalized.indexOf("check-in") !== -1) {
    return "heart";
  }

  if (normalized.indexOf("review") !== -1) {
    return "review";
  }

  if (normalized.indexOf("reward") !== -1) {
    return "gift";
  }

  if (practiceModeKey === "afterClass") {
    return "quiz";
  }

  if (practiceModeKey === "inClass") {
    return "code";
  }

  return "book";
}

function renderSvgIcon(name) {
  var icons = {
    arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/><path d="M20 12H9"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/><path d="M4 12h11"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16"/><path d="M8 7h7M8 11h5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16.5 9"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9l-4 3 4 3"/><path d="M16 9l4 3-4 3"/><path d="M14 5l-4 14"/></svg>',
    computer: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7 8h10"/></svg>',
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12l4 6-10 10L2 10z"/><path d="M2 10h20M8 4l4 16 4-16"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v10H4z"/><path d="M3 7h18v3H3z"/><path d="M12 7v13"/><path d="M12 7c-3-4-7-1-4 0M12 7c3-4 7-1 4 0"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11z"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    oquway: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6a18 18 0 1 0 18 18h-8a10 10 0 1 1-10-10z"/><circle cx="24" cy="24" r="6"/><path d="M30 4l6 6-6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/></svg>',
    project: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 12h18"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3 2.45c-.9.28-1.5.85-1.5 1.8"/><path d="M12 17h.01"/></svg>',
    review: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v6h-6"/></svg>',
    robot: '<svg viewBox="0 0 220 180" aria-hidden="true"><path fill="#fff" d="M88 46h50a34 34 0 0 1 34 34v26a34 34 0 0 1-34 34H88a34 34 0 0 1-34-34V80a34 34 0 0 1 34-34z"/><path fill="#dbeafe" d="M68 78a24 24 0 0 1 24-24h42a24 24 0 0 1 24 24v22a24 24 0 0 1-24 24H92a24 24 0 0 1-24-24z"/><path fill="#0f172a" d="M80 80a18 18 0 0 1 18-18h30a18 18 0 0 1 18 18v18a18 18 0 0 1-18 18H98a18 18 0 0 1-18-18z"/><path fill="none" stroke="#22d3ee" stroke-width="5" stroke-linecap="round" d="M96 90c4 8 10 8 14 0M118 90c4 8 10 8 14 0"/><path fill="#fff" d="M72 134h82l18 32H54z"/><path fill="#334155" d="M68 136h90a8 8 0 0 1 8 8v28H60v-28a8 8 0 0 1 8-8z"/><circle cx="45" cy="96" r="15" fill="#fff"/><circle cx="181" cy="96" r="15" fill="#fff"/><path fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" d="M58 122c-22 0-28-22-18-38M166 122c22 0 28-22 18-38"/><path fill="#22c55e" d="M168 54a11 11 0 1 1-22 0 11 11 0 0 1 22 0z"/></svg>',
    rocket: '<svg viewBox="0 0 120 90" aria-hidden="true"><path fill="#fed7aa" d="M30 62c-9 4-14 11-16 20 10-2 17-7 21-16z"/><path fill="#fb923c" d="M48 68c2 8 8 14 18 17-1-10-6-17-14-21z"/><path fill="#f97316" d="M39 57c11-27 31-43 64-51-8 33-24 53-51 64z"/><path fill="#fff7ed" d="M47 53c8-18 23-31 45-38-7 22-20 37-38 45z"/><path fill="#ea580c" d="M38 58l-16 2 22-22z"/><path fill="#fb923c" d="M51 70l-2 16 22-22z"/><circle cx="77" cy="31" r="9" fill="#0ea5e9"/><circle cx="77" cy="31" r="5" fill="#e0f2fe"/><path fill="#facc15" d="M28 70c8 1 15 8 16 16-9-1-16-8-16-16z"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>',
    steps: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h.01M10 13h.01M13 8h.01M17 5h.01"/><path d="M6 18c4-1 6-4 7-10"/><path d="M14 16c1 1 3 2 5 1"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4"/><path d="M12 13v5M8 20h8"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M17 10l4-3v10l-4-3z"/><path d="M9 9l4 3-4 3z"/></svg>'
  };

  return icons[name] || icons.book;
}

function renderClassChatPanel(state) {
  var studentName = readStudentName(state.student);

  // TODO: Replace this placeholder with a real-time class chat service when chat storage rules and moderation are ready.
  return '<section class="course-chat-card">'
    + '<div class="student-section-head"><div><h2>Class Chat</h2></div><span>Coming soon</span></div>'
    + '<div class="course-chat-thread">'
    + '<div class="course-chat-message"><span>M</span><p>Nice work getting into the course path.</p></div>'
    + '<div class="course-chat-message"><span>R</span><p>The next practice card is ready when you are.</p></div>'
    + '<div class="course-chat-message course-chat-message-me"><span>' + escapeHtml(readInitials(studentName)) + '</span><p>' + escapeHtml(studentName) + ', you are on the main path.</p></div>'
    + '</div>'
    + '<div class="course-chat-input" aria-disabled="true">Class Chat coming soon</div>'
    + '</section>';
}

function renderSelectedModulePanel(course, module, state) {
  var readiness = getModuleReadiness(module);
  var html = '<details class="course-module-panel course-module-panel-collapsed">';

  if (!module) {
    html += '<summary class="course-module-summary-toggle"><span>Course Details</span><strong>This course is not ready yet</strong></summary>';
    html += '<div class="student-empty course-focus-empty"><h2>This course is not ready yet</h2><p>Your teacher has not added modules to this course yet.</p></div></details>';
    return html;
  }

  html += '<summary class="course-module-summary-toggle"><span>Selected Module Details</span><strong>' + escapeHtml(readLocalizedText(module.title, "Module")) + '</strong><em>' + escapeHtml(readiness.label) + '</em></summary>';
  html += '<div class="course-module-secondary-content">';
  html += '<p class="course-module-summary">' + escapeHtml(readLocalizedText(module.description, "Choose an available practice mode when your teacher has added activities.")) + '</p>';
  html += '<div class="student-progress-bar"><span style="width:' + readModuleProgressPercent(module) + '%"></span></div>';

  if (readiness.totalSteps === 0) {
    html += '<div class="student-session-empty">This course has modules, but no playable activities yet.</div>';
    html += '</div></details>';
    return html;
  }

  html += buildSessions(course, module, state);
  html += '</div></details>';
  return html;
}

function getNextCourseAction(course) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var playableFallback = null;
  var moduleIndex = 0;

  if (!course) {
    return {
      isPlayable: false,
      message: "This course could not be loaded."
    };
  }

  if (modules.length === 0) {
    return {
      isPlayable: false,
      message: "This course is not ready yet. Your teacher has not added modules."
    };
  }

  while (moduleIndex < modules.length) {
    var action = findNextActionInModule(course, modules[moduleIndex], false);

    if (action) {
      return action;
    }

    if (!playableFallback) {
      playableFallback = findNextActionInModule(course, modules[moduleIndex], true);
    }

    moduleIndex = moduleIndex + 1;
  }

  if (playableFallback) {
    return playableFallback;
  }

  return {
    isPlayable: false,
    message: "This course has modules, but no playable activities yet."
  };
}

function findNextActionInModule(course, module, allowComplete) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var keys = createPracticeModeKeys();
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    var session = sessions[sessionIndex];
    var practiceModes = normalizePracticeModes(session.practiceModes);
    var keyIndex = 0;

    while (keyIndex < keys.length) {
      var key = keys[keyIndex];
      var mode = practiceModes[key];
      var steps = readSortedSteps(mode.steps);
      var progress = readPracticeModeProgress(session.progress, key);
      var completedCount = countCompletedSteps(steps, progress.completedStepIds);
      var isComplete = progress.completed === true || (steps.length > 0 && completedCount >= steps.length);

      if (steps.length > 0 && (allowComplete || !isComplete)) {
        return {
          isPlayable: true,
          courseId: course.id,
          moduleId: module.id,
          sessionId: session.id,
          practiceModeKey: key,
          moduleTitle: readLocalizedText(module.title, "Module"),
          sessionTitle: readLocalizedText(session.title, "Session"),
          practiceModeTitle: readLocalizedText(mode.title, "Practice Mode"),
          buttonLabel: allowComplete ? "Review" : (completedCount > 0 ? "Continue" : "Start"),
          reason: completedCount + " / " + steps.length + " learning activities complete",
          estimatedTimeLabel: readEstimatedMinutesLabel(module)
        };
      }

      keyIndex = keyIndex + 1;
    }

    sessionIndex = sessionIndex + 1;
  }

  return null;
}

function getModuleReadiness(module) {
  var totalSteps = countModuleSteps(module);
  var completedSteps = countModuleCompletedSteps(module);
  var status = readModuleLearningStatus(module);

  if (!module) {
    return {
      status: "notReady",
      label: "Not Ready",
      completedSteps: 0,
      totalSteps: 0
    };
  }

  if (totalSteps === 0) {
    return {
      status: "notReady",
      label: "Not Ready",
      completedSteps: 0,
      totalSteps: 0
    };
  }

  if (status === "complete") {
    return {
      status: "complete",
      label: "Complete",
      completedSteps: completedSteps,
      totalSteps: totalSteps
    };
  }

  if (completedSteps > 0) {
    return {
      status: "inProgress",
      label: "In Progress",
      completedSteps: completedSteps,
      totalSteps: totalSteps
    };
  }

  return {
    status: "notStarted",
    label: "Not Started",
    completedSteps: completedSteps,
    totalSteps: totalSteps
  };
}

function readCourseFocusProgress(course) {
  return {
    percent: readCourseProgressPercent(course),
    completedModules: countCompletedModules(course),
    totalModules: readCourseModuleCount(course),
    completedSteps: countCourseCompletedSteps(course),
    totalSteps: countCourseSteps(course)
  };
}

function readSelectedFocusModule(state, course, nextAction) {
  var modules = course && Array.isArray(course.modules) ? course.modules : [];
  var moduleId = state.selectedModuleId || (nextAction && nextAction.moduleId ? nextAction.moduleId : "");
  var moduleIndex = 0;

  while (moduleIndex < modules.length) {
    if (modules[moduleIndex].id === moduleId) {
      return modules[moduleIndex];
    }

    moduleIndex = moduleIndex + 1;
  }

  return modules.length > 0 ? modules[0] : null;
}

function readFirstPlayableModuleId(course) {
  var action = getNextCourseAction(course);

  return action && action.moduleId ? action.moduleId : null;
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
  var preferences = readStudentProfilePreferences(student);
  var avatarId = student && typeof student.avatarId === "string" ? student.avatarId : preferences.avatarId;

  if (imageUrl) {
    return '<img class="student-avatar-img" src="' + escapeHtml(imageUrl) + '" alt="">';
  }

  if (avatarId) {
    return renderBuiltInStudentAvatar(readAvatarById(avatarId), studentName);
  }

  return '<div class="student-avatar-fallback">' + renderFriendlyAvatarSvg(readInitials(studentName)) + '</div>';
}

function renderBuiltInStudentAvatar(avatar, studentName) {
  var safeAvatar = avatar || readAvatarById("");
  var label = safeAvatar.initials || readInitials(studentName);

  return '<div class="student-avatar-fallback student-built-avatar student-built-avatar-' + escapeHtml(safeAvatar.tone) + '"><span>' + escapeHtml(label) + '</span></div>';
}

function renderFriendlyAvatarSvg(initials) {
  return '<svg viewBox="0 0 80 80" aria-hidden="true"><defs><linearGradient id="studentAvatarGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#34d399"/></linearGradient></defs><circle cx="40" cy="40" r="38" fill="url(#studentAvatarGradient)"/><circle cx="40" cy="34" r="16" fill="#fef3c7"/><path fill="#172033" d="M22 32c2-14 14-19 25-14 9 3 13 11 11 22-9-6-22-4-36-8z"/><path fill="#fff" d="M18 68c4-14 15-22 22-22s18 8 22 22z"/><text x="40" y="66" text-anchor="middle" font-size="15" font-weight="900" fill="#172033">' + escapeHtml(initials) + '</text></svg>';
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

  return "Pick a course and begin your first learning activity.";
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

function readModuleLastOpenedAt(module) {
  var sessions = module && Array.isArray(module.sessions) ? module.sessions : [];
  var lastOpenedAt = 0;
  var sessionIndex = 0;

  while (sessionIndex < sessions.length) {
    lastOpenedAt = Math.max(lastOpenedAt, readTimestampMillis(sessions[sessionIndex].progress ? sessions[sessionIndex].progress.updatedAt : null));
    sessionIndex = sessionIndex + 1;
  }

  return lastOpenedAt;
}

function readTimestampMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value.seconds) {
    return value.seconds * 1000;
  }

  return 0;
}

function disabled(value) {
  return value ? " disabled" : "";
}

function readCourseModuleCount(course) {
  if (Array.isArray(course && course.modules)) {
    return course.modules.length;
  }

  if (typeof (course && course.moduleCount) === "number" && Number.isFinite(course.moduleCount)) {
    return Math.max(0, Math.round(course.moduleCount));
  }

  if (Array.isArray(course && course.moduleIds)) {
    return course.moduleIds.length;
  }

  if (Array.isArray(course && course.moduleOrder)) {
    return course.moduleOrder.length;
  }

  return 0;
}

function readCourseActivityCount(course) {
  if (course && typeof course.activityCount === "number" && Number.isFinite(course.activityCount)) {
    return Math.max(0, Math.round(course.activityCount));
  }

  if (course && typeof course.stepCount === "number" && Number.isFinite(course.stepCount)) {
    return Math.max(0, Math.round(course.stepCount));
  }

  return countSharedCourseSteps(course);
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

  if (modules.length === 0) {
    return createEmptyState("No modules ready yet", "This course does not have modules yet.", {
      className: "student-empty"
    });
  }

  return renderCourseModules(course, modules, {
    selectedModuleId: state.selectedModuleId,
    progress: readCourseFocusProgress(course)
  });
}

function buildSessions(course, module, state) {
  var sessions = Array.isArray(module.sessions) ? module.sessions : [];
  var html = "";
  var sessionIndex = 0;

  if (sessions.length === 0) {
    return '<div class="student-session-empty">This module does not have learning activities yet.</div>';
  }

  if (countModuleSteps(module) === 0) {
    return '<div class="student-session-empty">This module does not have learning activities yet.</div>';
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
    html += '<small>' + escapeHtml(completeText) + ' - ' + completedCount + ' / ' + steps.length + ' learning activities</small>';
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

  html += '<div id="student-player-error-region" class="student-error" style="display:' + (state.error ? 'block' : 'none') + '">' + (state.error ? escapeHtml(state.error) : '') + '</div>';
  html += '<div id="student-player-status-region" class="student-status" style="display:' + (state.statusMessage ? 'block' : 'none') + '">' + (state.statusMessage ? escapeHtml(state.statusMessage) : '') + '</div>';

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
      estimatedMinutes: readEstimatedMinutesValue(module),
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
  return completeCurrentStep(readStepId(step, ""), completionResult, snapshot);
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
    xpEarned: readNonNegativeNumber(progressResult.xpEarned, readNestedProgressNumber(progressResult, "xpEarned", 0)),
    starsEarned: readNonNegativeNumber(progressResult.starsEarned, readNestedProgressNumber(progressResult, "starsEarned", 0)),
    gamification: {
      xpEarned: readNonNegativeNumber(progressResult.xpEarned, readNestedProgressNumber(progressResult, "xpEarned", 0)),
      starsEarned: readNonNegativeNumber(progressResult.starsEarned, readNestedProgressNumber(progressResult, "starsEarned", 0))
    },
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

function readNestedProgressNumber(source, key, fallback) {
  if (source && source.gamification && typeof source.gamification[key] === "number") {
    return source.gamification[key];
  }

  return fallback;
}

function readNonNegativeNumber(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  return fallback;
}

function readSelectedCourse(state) {
  var courses = state.courses || [];
  var courseId = state.selectedCourseId || readFirstId(courses);
  return readCourseById(courses, courseId);
}

function readCourseById(courses, courseId) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    if (safeCourses[courseIndex].id === courseId) {
      return safeCourses[courseIndex];
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
    return "Student Dashboard";
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

  return "Student Dashboard";
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

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
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
