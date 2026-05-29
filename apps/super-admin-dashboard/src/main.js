import { getIdTokenResult, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../packages/core/src/infrastructure/firebase/auth.js";
import { storage } from "../../../packages/core/src/infrastructure/firebase/storage.js";
import { collection, db, doc, getDoc, getDocs, serverTimestamp, setDoc } from "../../../packages/core/src/infrastructure/firebase/firestore.js";
import { getIntentDefinition } from "../../../packages/core/src/icf/engine/intentRegistry.js";
import { runIntentPipeline } from "../../../packages/core/src/icf/engine/runIntentPipeline.js";

var appElement = document.getElementById("app");
var state = {
  isLoading: true,
  isRefreshing: false,
  isSaving: false,
  pendingAction: "",
  activeLocationId: "",
  locationCreateOpen: false,
  authPhase: "checkingAuth",
  needsLogin: false,
  activeTab: "overview",
  message: "",
  messageType: "info",
  loginEmail: "",
  loginPassword: "",
  overviewChartRange: "month",
  overviewSearchText: "",
  overviewData: createOverviewData(),
  admin: null,
  actor: null,
  locations: [],
  users: [],
  classes: [],
  students: [],
  courses: [],
  assignments: [],
  filters: {
    locationId: "",
    classId: "",
    searchText: ""
  },
  userFilters: {
    searchText: "",
    role: "",
    locationId: "",
    status: ""
  },
  assignmentFilters: {
    courseId: "",
    targetType: "",
    status: ""
  },
  locationForm: createLocationForm(),
  userForm: createUserForm(),
  activeUserId: "",
  userCreateOpen: false,
  classForm: createClassForm(),
  studentForm: createStudentForm(),
  assignmentForm: createAssignmentForm(),
  loginToolStudentId: "",
  resetStudentId: "",
  resetFruitPassword: []
};

var tabs = ["overview", "locations", "users", "students", "classes", "assignments", "loginTools"];
var userRoles = ["student", "teacher", "parent", "schoolAdmin", "regionalAdmin", "ministryUser", "platformAdmin", "superAdmin"];
var userStatuses = ["active", "inactive", "suspended", "archived"];
var fruits = ["apple", "watermelon", "banana", "strawberry", "pineapple", "mango", "kiwi", "orange", "cherry"];
var fruitLabels = {
  apple: "🍎",
  watermelon: "🍉",
  banana: "🍌",
  strawberry: "🍓",
  pineapple: "🍍",
  mango: "🥭",
  kiwi: "🥝",
  orange: "🍊",
  cherry: "🍒"
};

if (appElement) {
  appElement.addEventListener("click", handleClick);
  appElement.addEventListener("input", handleInput);
  appElement.addEventListener("change", handleInput);
}

onAuthStateChanged(auth, function (user) {
  initializeDashboard(user);
});

async function initializeDashboard(user) {
  if (!user) {
    setState({
      isLoading: false,
      authPhase: "loginRequired",
      needsLogin: true,
      admin: null,
      actor: null,
      message: "",
      messageType: "info"
    });
    return;
  }

  setState({
    isLoading: true,
    authPhase: "profileLoading",
    needsLogin: false,
    admin: null,
    actor: null,
    message: "Checking admin access...",
    messageType: "info"
  });

  try {
    var actor = await createActor(user);

    if (actor.profileMissing && !actor.role) {
      setState({
        isLoading: false,
        authPhase: "profileMissing",
        needsLogin: false,
        actor: actor,
        message: "Your account exists, but no admin profile was found.",
        messageType: "error"
      });
      return;
    }

    if (!isAdminRole(actor.role)) {
      setState({
        isLoading: false,
        authPhase: "unauthorized",
        needsLogin: false,
        actor: actor,
        message: "This account cannot access the Super Admin Dashboard.",
        messageType: "error"
      });
      return;
    }

    state.actor = actor;
    state.authPhase = "authorized";
    state.needsLogin = false;
    await loadAdminProfile();
    await refreshAllData();
  } catch (error) {
    setState({
      isLoading: false,
      authPhase: "unauthorized",
      needsLogin: false,
      actor: {
        id: user.uid,
        email: user.email || "",
        role: ""
      },
      message: "Could not check admin access. Please try signing in again.",
      messageType: "error"
    });
  }
}

async function createActor(user) {
  var tokenResult = await getIdTokenResult(user, true);
  var role = "";
  var profileResult = null;

  if (tokenResult && tokenResult.claims && typeof tokenResult.claims.role === "string") {
    role = normalizeAdminRole(tokenResult.claims.role);
  }

  if (!role) {
    profileResult = await loadRoleFromProfile(user.uid);
    role = normalizeAdminRole(profileResult.role);
  }

  return {
    id: user.uid,
    email: user.email || "",
    role: role,
    profileMissing: profileResult ? profileResult.missing : false
  };
}

async function loadRoleFromProfile(userId) {
  try {
    var userSnap = await getDoc(doc(db, "users", userId));

    if (userSnap.exists()) {
      var data = userSnap.data() || {};
      if (Array.isArray(data.roles)) {
        return {
          role: readPrimaryAdminRole(data.roles),
          missing: false
        };
      }

      if (typeof data.role === "string") {
        return {
          role: data.role,
          missing: false
        };
      }

      return {
        role: "",
        missing: false
      };
    }
  } catch (error) {
    throw error;
  }

  return {
    role: "",
    missing: true
  };
}

async function loadAdminProfile() {
  var result = await runAdminIntent("LoadAdminProfileIntent", {});

  if (isSuccess(result)) {
    state.admin = result.emitted.data.admin;
    return;
  }

  state.admin = {
    id: state.actor.id,
    email: state.actor.email,
    role: state.actor.role
  };
}

async function refreshAllData() {
  if (state.actor) {
    setState({ isLoading: false, isRefreshing: true, message: "Loading admin data...", messageType: "info" });
  } else {
    setState({ isLoading: true, isRefreshing: false, message: "Loading admin data...", messageType: "info" });
  }

  var locationsResult = await runAdminIntent("ListLocationsIntent", {});
  var classesResult = await runAdminIntent("ListClassesIntent", {
    locationId: state.filters.locationId
  });
  var studentsResult = await runAdminIntent("ListStudentsIntent", {
    locationId: state.filters.locationId,
    classId: state.filters.classId,
    searchText: state.filters.searchText
  });
  var coursesResult = await runAdminIntent("ListCoursesIntent", {});
  var assignmentsResult = await runAdminIntent("ListCourseAssignmentsIntent", {
    courseId: state.assignmentFilters.courseId,
    targetType: state.assignmentFilters.targetType,
    status: state.assignmentFilters.status
  });
  var overviewData = await loadOverviewData();
  var refreshMessage = readRefreshMessage([locationsResult, classesResult, studentsResult, coursesResult, assignmentsResult]);

  setState({
    isLoading: false,
    isRefreshing: false,
    locations: readDataList(locationsResult, "locations"),
    users: overviewData.users.map(getSafeUser),
    classes: readDataList(classesResult, "classes"),
    students: readDataList(studentsResult, "students"),
    courses: readDataList(coursesResult, "courses"),
    assignments: readDataList(assignmentsResult, "assignments"),
    overviewData: overviewData,
    message: refreshMessage,
    messageType: refreshMessage ? "error" : "info"
  });
}

async function loadOverviewData() {
  var overviewData = createOverviewData();
  var usersResult = await readOptionalCollection("users");
  var modulesResult = await readOptionalCollection("modules");
  var auditResult = await readOptionalCollection("auditLogs");
  var activityResult = await readOptionalCollection("activityLogs");

  overviewData.users = usersResult.items;
  overviewData.modules = modulesResult.items;
  overviewData.auditLogs = auditResult.items;
  overviewData.activityLogs = activityResult.items;
  overviewData.collectionStatus = {
    users: usersResult,
    modules: modulesResult,
    auditLogs: auditResult,
    activityLogs: activityResult
  };
  overviewData.lastRefreshAt = Date.now();
  overviewData.storageAvailable = !!storage;

  return overviewData;
}

async function readOptionalCollection(collectionName) {
  var result = {
    name: collectionName,
    available: true,
    items: [],
    error: ""
  };

  try {
    var snapshot = await getDocs(collection(db, collectionName));

    snapshot.forEach(function (recordSnap) {
      result.items.push(Object.assign({ id: recordSnap.id }, recordSnap.data() || {}));
    });
  } catch (error) {
    result.available = false;
    result.error = error && error.message ? error.message : "Collection unavailable.";
  }

  return result;
}

function render() {
  if (!appElement) {
    return;
  }

  if (state.isLoading || state.authPhase === "checkingAuth" || state.authPhase === "profileLoading") {
    appElement.innerHTML = buildLoadingView();
    return;
  }

  if (state.needsLogin) {
    appElement.innerHTML = buildLoginView();
    return;
  }

  if (!state.actor || !isAdminRole(state.actor.role)) {
    appElement.innerHTML = buildAccessDeniedView();
    return;
  }

  appElement.innerHTML = buildDashboardView();
}

function buildLoadingView() {
  var title = state.authPhase === "profileLoading" ? "Checking admin access..." : "Loading Super Admin Dashboard";
  var note = state.authPhase === "profileLoading" ? "Verifying your profile and permissions." : "Checking access and loading school data.";

  return '<section class="sa-loading" aria-busy="true"><div class="sa-spinner"></div><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(note) + '</p><div class="sa-skeleton-stack"><span></span><span></span><span></span></div></section>';
}

function buildAccessDeniedView() {
  return '<section class="sa-access-card"><h1>Super Admin Access Required</h1><p>' + escapeHtml(state.message || "Sign in with a super admin or platform admin account.") + '</p><div class="sa-form sa-form-2"><button type="button" class="sa-btn sa-btn-secondary" data-action="go-admin-login">Go to Login</button><button type="button" class="sa-btn" data-action="sign-out">Sign out</button></div></section>';
}

function buildLoginView() {
  return '<section class="sa-access-card sa-login-card"><p class="sa-eyebrow">Admin Login</p><h1>Sign in to Super Admin</h1><p>Use a super admin or platform admin account. We will bring you back here after login.</p>'
    + buildMessage()
    + '<div class="sa-form"><label>Email<input type="email" data-login-field="email" value="' + escapeHtml(state.loginEmail) + '" placeholder="admin@example.com"></label><label>Password<input type="password" data-login-field="password" value="' + escapeHtml(state.loginPassword) + '" placeholder="Password"></label><button type="button" class="sa-btn" data-action="admin-login">Log in</button><button type="button" class="sa-btn sa-btn-secondary" data-action="go-admin-login">Go to Login</button></div></section>';
}

function buildDashboardView() {
  var html = "";

  html += '<section class="sa-shell">';
  html += '<aside class="sa-sidebar">';
  html += '<div class="sa-brand">OquWay</div>';
  html += '<p class="sa-sidebar-title">Super Admin <span class="sa-version-badge">v1.1.2</span></p>';
  html += buildTabs();
  html += '<button type="button" class="sa-side-link sa-danger-link" data-action="sign-out">Sign out</button>';
  html += '</aside>';
  html += '<main class="sa-main">';
  html += buildTopBar();
  html += buildMessage();
  html += buildActiveTab();
  html += '</main>';
  html += buildResetModal();
  html += '</section>';

  return html;
}

function buildTabs() {
  var html = "";
  var visibleTabs = readVisibleTabs();
  var index = 0;

  while (index < visibleTabs.length) {
    var tab = visibleTabs[index];
    var activeClass = state.activeTab === tab ? " sa-side-link-active" : "";
    html += '<button type="button" class="sa-side-link' + activeClass + '" data-tab="' + tab + '">' + escapeHtml(readTabLabel(tab)) + '</button>';
    index = index + 1;
  }

  return html;
}

function buildTopBar() {
  return '<div class="sa-topbar"><div><p class="sa-eyebrow">Control Center</p><h1>' + escapeHtml(readTabLabel(state.activeTab)) + '</h1></div>'
    + '<div class="sa-admin-card"><strong>' + escapeHtml(readAdminName()) + '</strong><span>' + escapeHtml(state.actor.email || state.actor.id) + '</span><small>' + escapeHtml(state.actor.role) + '</small></div></div>';
}

function buildMessage() {
  if (!state.message) {
    return "";
  }

  return '<div class="sa-message sa-message-' + escapeHtml(state.messageType) + '">' + escapeHtml(state.message) + '</div>';
}

function buildActiveTab() {
  if (!canOpenTab(state.activeTab)) {
    return buildAssignmentsTab();
  }

  if (state.activeTab === "locations") {
    return buildLocationsTab();
  }

  if (state.activeTab === "users") {
    return buildUsersTab();
  }

  if (state.activeTab === "classes") {
    return buildClassesTab();
  }

  if (state.activeTab === "students") {
    return buildStudentsTab();
  }

  if (state.activeTab === "assignments") {
    return buildAssignmentsTab();
  }

  if (state.activeTab === "loginTools") {
    return buildLoginToolsTab();
  }

  return buildOverviewTab();
}

function buildOverviewTab() {
  var html = '<section class="sa-overview">';

  html += buildOverviewHeader();

  if (state.isRefreshing) {
    html += buildOverviewSkeleton();
  }

  html += renderActionCenter();
  html += renderQuickActions();
  html += renderUserMetrics();
  html += renderGrowthChart(state.overviewChartRange);
  html += '<section class="sa-overview-grid sa-overview-grid-2">' + renderHealthCards() + renderLoginHealth() + '</section>';
  html += '<section class="sa-overview-grid sa-overview-grid-2">' + renderCompletionScore() + renderRoadmap() + '</section>';
  html += '<section class="sa-overview-grid sa-overview-grid-2">' + renderRecentActivity() + renderRecentlyCreated() + '</section>';
  html += renderGlobalSearch();
  html += '</section>';

  return html;
}

function buildMetricCard(title, value, note) {
  return '<article class="sa-card sa-metric"><span>' + escapeHtml(title) + '</span><strong>' + value + '</strong><p>' + escapeHtml(note) + '</p></article>';
}

function buildOverviewHeader() {
  return '<div class="sa-overview-head"><div><p class="sa-eyebrow">Control Center</p><h2>Super Admin Overview</h2><p>Operational readiness, login health, platform growth, and setup progress in one place.</p></div><div class="sa-overview-head-actions"><span>Last updated: ' + escapeHtml(formatDateTime(state.overviewData.lastRefreshAt)) + '</span><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div></div>';
}

function buildOverviewSkeleton() {
  return '<section class="sa-overview-skeleton" aria-busy="true"><span></span><span></span><span></span><span></span></section>';
}

function renderActionCenter() {
  var items = buildActionCenterItems();
  var html = '<article class="sa-card sa-overview-card"><div class="sa-section-title"><div><h2>Action Center</h2><p>Highest-signal setup and data quality issues.</p></div></div><div class="sa-action-list">';
  var index = 0;

  while (index < items.length) {
    html += buildActionItem(items[index]);
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function buildActionCenterItems() {
  var issues = readOverviewIssues();

  return [
    { icon: "Link", count: issues.locationsMissingSlugs, message: "Locations missing login slugs", action: "overview-open-locations", button: "Locations", tone: issues.locationsMissingSlugs ? "warning" : "good" },
    { icon: "Photo", count: issues.studentsMissingPhotos, message: "Students missing profile photos", action: "overview-open-students", button: "Students", tone: issues.studentsMissingPhotos ? "warning" : "good" },
    { icon: "Key", count: issues.studentsMissingCredentials, message: "Students missing login credentials", action: "overview-open-login-tools", button: "Login Tools", tone: issues.studentsMissingCredentials ? "danger" : "good" },
    { icon: "Teach", count: issues.classesMissingTeachers, message: "Classes with no assigned teacher", action: "overview-open-classes", button: "Classes", tone: issues.classesMissingTeachers ? "warning" : "good" },
    { icon: "Group", count: issues.classesWithNoStudents, message: "Classes with no students", action: "overview-open-classes", button: "Classes", tone: issues.classesWithNoStudents ? "warning" : "good" },
    { icon: "Site", count: issues.locationsWithNoClasses, message: "Locations with no classes", action: "overview-open-locations", button: "Locations", tone: issues.locationsWithNoClasses ? "warning" : "good" },
    { icon: "Draft", count: issues.draftLearningItems, message: "Courses or modules in draft", action: "overview-open-course-creator", button: "Courses", tone: issues.draftLearningItems ? "warning" : "good" },
    { icon: "Archive", count: issues.archivedLocations, message: "Archived locations", action: "overview-open-locations", button: "Review", tone: issues.archivedLocations ? "muted" : "good" }
  ];
}

function buildActionItem(item) {
  return '<div class="sa-action-item sa-action-' + escapeHtml(item.tone) + '"><div class="sa-action-icon">' + escapeHtml(item.icon) + '</div><div><strong>' + item.count + '</strong><span>' + escapeHtml(item.message) + '</span></div><button type="button" class="sa-btn sa-btn-secondary" data-action="' + escapeHtml(item.action) + '">' + escapeHtml(item.button) + '</button></div>';
}

function renderQuickActions() {
  var actions = [
    { label: "Create Location", action: "overview-create-location", available: true },
    { label: "Create Class", action: "overview-create-class", available: true },
    { label: "Create Student", action: "overview-create-student", available: true },
    { label: "Create Teacher", action: "overview-create-teacher", available: true },
    { label: "Create Course", action: "overview-create-course", available: true },
    { label: "Open Login Tools", action: "overview-open-login-tools", available: true }
  ];
  var html = '<article class="sa-card sa-overview-card"><div class="sa-section-title"><div><h2>Quick Actions</h2><p>Jump straight into the existing admin workflows.</p></div></div><div class="sa-quick-actions">';
  var index = 0;

  while (index < actions.length) {
    html += '<button type="button" class="sa-quick-btn" data-action="' + escapeHtml(actions[index].action) + '"' + disabled(!actions[index].available || isBusy()) + '><span>' + escapeHtml(actions[index].label) + '</span><small>' + (actions[index].available ? "Open" : "Not available yet") + '</small></button>';
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function renderUserMetrics() {
  var stats = readUserStats();

  return '<article class="sa-card sa-overview-card"><div class="sa-section-title"><div><h2>User Management</h2><p>Identity, roles, access status, and location assignment health.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="overview-open-users">Open Users</button></div><div class="sa-mini-grid">'
    + buildMiniMetric(stats.totalUsers, "Total users")
    + buildMiniMetric(stats.activeUsers, "Active users")
    + buildMiniMetric(stats.multiRoleUsers, "Multi-role users")
    + buildMiniMetric(stats.missingLocationUsers, "Missing location")
    + buildMiniMetric(stats.suspendedUsers, "Suspended")
    + '</div></article>';
}

function renderHealthCards() {
  var firestoreStatus = state.overviewData.lastRefreshAt ? "good" : "danger";
  var authStatus = auth.currentUser ? "good" : "danger";
  var storageStatus = state.overviewData.storageAvailable ? "good" : "warning";

  return '<article class="sa-card sa-overview-card"><h2>Platform Health</h2><div class="sa-health-list">'
    + buildHealthRow("Firestore", firestoreStatus, state.overviewData.lastRefreshAt ? "Connected and loaded" : "No successful load yet")
    + buildHealthRow("Auth", authStatus, auth.currentUser ? "Signed-in user loaded" : "No auth user")
    + buildHealthRow("Storage", storageStatus, state.overviewData.storageAvailable ? "Storage config detected" : "Storage config unavailable")
    + buildHealthRow("Last Refresh", state.overviewData.lastRefreshAt ? "good" : "warning", formatDateTime(state.overviewData.lastRefreshAt))
    + buildHealthRow("Admin Role", isAdminRole(state.actor ? state.actor.role : "") ? "good" : "danger", state.actor ? state.actor.role : "missing")
    + buildOverviewCollectionErrors()
    + '</div></article>';
}

function buildHealthRow(label, tone, value) {
  return '<div class="sa-health-row"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong><i class="sa-health-badge sa-health-' + escapeHtml(tone) + '">' + escapeHtml(tone) + '</i></div>';
}

function buildOverviewCollectionErrors() {
  var keys = ["users", "modules", "auditLogs", "activityLogs"];
  var html = "";
  var index = 0;

  while (index < keys.length) {
    var status = state.overviewData.collectionStatus[keys[index]];
    if (status && !status.available) {
      html += buildHealthRow(keys[index], "warning", "Unavailable");
    }
    index = index + 1;
  }

  return html;
}

function renderLoginHealth() {
  var stats = readLoginHealthStats();

  return '<article class="sa-card sa-overview-card"><div class="sa-section-title"><div><h2>Student Login Health</h2><p>Readiness for classroom login flows.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="overview-open-login-tools">Open Login Tools</button></div><div class="sa-mini-grid">'
    + buildMiniMetric(stats.locationsWithSlugs + " / " + stats.totalLocations, "Locations with login slugs")
    + buildMiniMetric(stats.classesAvailable, "Classes available for login")
    + buildMiniMetric(stats.studentsAssignedToClasses, "Students assigned to classes")
    + buildMiniMetric(stats.studentsMissingCredentials, "Missing credentials")
    + buildMiniMetric(stats.studentsMissingPhotos, "Missing photos")
    + '</div></article>';
}

function renderCompletionScore() {
  var checklist = buildCompletionChecklist();
  var completeCount = 0;
  var index = 0;
  var html = "";

  while (index < checklist.length) {
    if (checklist[index].status === "complete") {
      completeCount = completeCount + 1;
    }
    index = index + 1;
  }

  var percent = checklist.length ? Math.round((completeCount / checklist.length) * 100) : 0;
  html += '<article class="sa-card sa-overview-card"><div class="sa-score-head"><div><h2>System Completion Score</h2><p>Setup progress across core launch requirements.</p></div><strong>' + percent + '%</strong></div><div class="sa-progress"><span style="width:' + percent + '%"></span></div><div class="sa-checklist">';
  index = 0;
  while (index < checklist.length) {
    html += '<div class="sa-check-row sa-check-' + escapeHtml(checklist[index].status) + '"><span>' + escapeHtml(checklist[index].status) + '</span><p>' + escapeHtml(checklist[index].label) + '</p></div>';
    index = index + 1;
  }
  html += '</div></article>';
  return html;
}

function renderRoadmap() {
  var items = [
    { name: "Admin System", status: "Done" },
    { name: "Location Login Links", status: "In Progress" },
    { name: "Course Editor", status: "In Progress" },
    { name: "Student Dashboard", status: "In Progress" },
    { name: "Parent Portal", status: "Planned" },
    { name: "Ministry Analytics", status: "Planned" }
  ];
  var html = '<article class="sa-card sa-overview-card"><h2>Roadmap / Current Focus</h2><div class="sa-roadmap">';
  var index = 0;

  while (index < items.length) {
    html += '<div class="sa-roadmap-row"><span>' + escapeHtml(items[index].name) + '</span><i class="sa-roadmap-badge sa-roadmap-' + escapeHtml(items[index].status.toLowerCase().replace(/ /g, "-")) + '">' + escapeHtml(items[index].status) + '</i></div>';
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function renderGrowthChart(range) {
  var chart = buildGrowthChart(range);
  var html = '<article class="sa-card sa-overview-card sa-chart-card"><div class="sa-section-title"><div><h2>Growth Metrics</h2><p>Created records over time. Items without dates are treated as existing before the range.</p></div><div class="sa-segmented"><button type="button" data-action="overview-chart-week" class="' + selectedClass(range, "week") + '">Week</button><button type="button" data-action="overview-chart-month" class="' + selectedClass(range, "month") + '">Month</button><button type="button" data-action="overview-chart-year" class="' + selectedClass(range, "year") + '">Year</button></div></div>';

  if (chart.isEmpty) {
    return html + '<div class="sa-empty">No growth records available yet.</div></article>';
  }

  html += chart.svg;
  html += '<div class="sa-chart-legend">';
  var index = 0;
  while (index < chart.series.length) {
    html += '<span><i style="background:' + escapeHtml(chart.series[index].color) + '"></i>' + escapeHtml(chart.series[index].label) + '</span>';
    index = index + 1;
  }
  html += '</div></article>';
  return html;
}

function renderRecentActivity() {
  var events = buildRecentActivityItems();
  var html = '<article class="sa-card sa-overview-card"><h2>Recent Activity</h2><div class="sa-feed">';
  var index = 0;

  if (events.length === 0) {
    return html + '<div class="sa-empty">No recent activity is available yet.</div></div></article>';
  }

  while (index < events.length && index < 10) {
    html += '<div class="sa-feed-row"><span>' + escapeHtml(events[index].type) + '</span><div><strong>' + escapeHtml(events[index].title) + '</strong><small>' + escapeHtml(formatDateTime(events[index].time)) + '</small></div></div>';
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function renderRecentlyCreated() {
  var items = buildRecentlyCreatedItems();
  var html = '<article class="sa-card sa-overview-card"><h2>Recently Created Items</h2><div class="sa-feed">';
  var index = 0;

  if (items.length === 0) {
    return html + '<div class="sa-empty">No created dates found yet.</div></div></article>';
  }

  while (index < items.length && index < 10) {
    html += '<div class="sa-feed-row"><span>' + escapeHtml(items[index].type) + '</span><div><strong>' + escapeHtml(items[index].title) + '</strong><small>' + escapeHtml(formatDateTime(items[index].time)) + '</small></div><button type="button" class="sa-btn sa-btn-secondary" data-action="' + escapeHtml(items[index].action) + '" data-id="' + escapeHtml(items[index].id) + '">Open</button></div>';
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function renderGlobalSearch() {
  var results = buildSearchResults(state.overviewSearchText);
  var html = '<article class="sa-card sa-overview-card"><div class="sa-section-title"><div><h2>Global Search</h2><p>Search loaded locations, classes, students, teachers, admins, and courses.</p></div></div><label class="sa-overview-search">Search<input data-overview-search="true" value="' + escapeHtml(state.overviewSearchText) + '" placeholder="Search locations, classes, students, teachers, courses..."></label>';

  if (!state.overviewSearchText.trim()) {
    return html + '<div class="sa-empty">Start typing to search across loaded admin data.</div></article>';
  }

  html += '<div class="sa-search-groups">';
  html += buildSearchGroup("Locations", results.locations);
  html += buildSearchGroup("Classes", results.classes);
  html += buildSearchGroup("Students", results.students);
  html += buildSearchGroup("Teachers / Admins", results.users);
  html += buildSearchGroup("Courses", results.courses);
  html += '</div></article>';
  return html;
}

function buildSearchGroup(title, items) {
  var html = '<section class="sa-search-group"><h3>' + escapeHtml(title) + '</h3>';
  var index = 0;

  if (items.length === 0) {
    return html + '<p>No matches.</p></section>';
  }

  while (index < items.length && index < 6) {
    html += '<button type="button" data-action="' + escapeHtml(items[index].action) + '" data-id="' + escapeHtml(items[index].id) + '"><strong>' + escapeHtml(items[index].title) + '</strong><span>' + escapeHtml(items[index].detail) + '</span></button>';
    index = index + 1;
  }

  html += '</section>';
  return html;
}

function buildLocationsTab() {
  return '<section class="sa-stack sa-location-page" aria-busy="' + (state.isRefreshing ? "true" : "false") + '">'
    + buildLocationsHeader()
    + buildLocationStats()
    + buildLocationCreatePanel()
    + '<article class="sa-card sa-location-list-card"><div class="sa-section-title"><div><h2>All Locations</h2><p>Manage school profiles, login links, access, and subscription settings.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>' + buildLocationRows() + '</article>'
    + '</section>';
}

function buildUsersTab() {
  return '<section class="sa-stack sa-user-page" aria-busy="' + (state.isRefreshing ? "true" : "false") + '">'
    + buildUsersHeader()
    + buildUserStatsCards()
    + buildUserCreatePanel()
    + '<article class="sa-card"><div class="sa-section-title"><div><h2>All Users</h2><p>Manage profile-only identity, roles, access status, and location scope.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>' + buildUserFilters() + buildUserRows() + '</article>'
    + '</section>';
}

function buildUsersHeader() {
  return '<div class="sa-page-head"><div><p class="sa-eyebrow">Identity & Access</p><h2>Users</h2><p>Profile-only management for students, teachers, parents, school admins, regional admins, ministry users, platform admins, and super admins.</p></div><button type="button" class="sa-btn" data-action="toggle-create-user"' + disabled(isBusy()) + '>' + (state.userCreateOpen ? "Close Create" : "Create User Profile") + '</button></div>';
}

function buildUserStatsCards() {
  var stats = readUserStats();

  return '<section class="sa-grid sa-grid-4">'
    + buildMetricCard("Total Users", stats.totalUsers, "Profiles in users collection")
    + buildMetricCard("Active", stats.activeUsers, "Profiles currently active")
    + buildMetricCard("Multiple Roles", stats.multiRoleUsers, "Users with more than one role")
    + buildMetricCard("Suspended", stats.suspendedUsers, "Profiles needing review")
    + '</section>';
}

function buildUserCreatePanel() {
  if (!state.userCreateOpen) {
    return "";
  }

  return '<article class="sa-card"><div class="sa-section-title"><div><h2>Create User Profile</h2><p>This creates a Firestore profile only. Firebase Auth accounts are not created from this screen.</p></div></div>' + buildUserForm("new", state.userForm, true) + '</article>';
}

function buildUserFilters() {
  var html = '<div class="sa-user-filters">';
  html += '<label>Search<input data-user-filter="searchText" value="' + escapeHtml(state.userFilters.searchText) + '" placeholder="Name, email, or phone"></label>';
  html += '<label>Role' + buildBasicOptionsSelect('data-user-filter="role"', state.userFilters.role, userRoles, "All roles") + '</label>';
  html += '<label>Location' + buildOptionsSelect('data-user-filter="locationId"', state.userFilters.locationId, state.locations, "All locations") + '</label>';
  html += '<label>Status' + buildBasicOptionsSelect('data-user-filter="status"', state.userFilters.status, userStatuses, "All statuses") + '</label>';
  html += '</div>';
  return html;
}

function buildUserRows() {
  var users = readFilteredUsers();
  var html = '<div class="sa-user-list">';
  var index = 0;

  if (state.isRefreshing && state.users.length === 0) {
    return buildUserSkeleton();
  }

  if (users.length === 0) {
    return '<div class="sa-empty"><strong>No users match these filters.</strong><span>Create a profile or clear the filters to see everyone.</span></div>';
  }

  while (index < users.length) {
    html += buildUserCard(users[index]);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildUserSkeleton() {
  return '<div class="sa-user-list" aria-busy="true"><div class="sa-location-skeleton"><span></span><div><i></i><i></i><i></i></div></div><div class="sa-location-skeleton"><span></span><div><i></i><i></i><i></i></div></div></div>';
}

function buildUserCard(user) {
  var isOpen = state.activeUserId === user.id;
  var html = '<article class="sa-user-card">';

  html += '<div class="sa-user-summary">' + buildAvatar(user) + '<div class="sa-user-main"><div class="sa-location-title-row"><h3>' + escapeHtml(user.displayName || user.name || user.email || user.id) + '</h3>' + buildStatusBadge(user.status) + '</div><p>' + escapeHtml(user.email || "No email") + '</p><small>' + escapeHtml(user.phone || "No phone") + '</small><div class="sa-role-badges">' + buildRoleBadges(user.roles) + '</div></div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(readUserLocationSummary(user)) + '</span><span>Updated ' + escapeHtml(formatDateTime(normalizeTimestamp(user.updatedAt))) + '</span></div>';
  html += '<div class="sa-row-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="edit-user" data-id="' + escapeHtml(user.id) + '">' + (isOpen ? "Close" : "Edit") + '</button></div></div>';

  if (isOpen) {
    html += '<div class="sa-location-detail">' + buildUserForm(user.id, normalizeUserForm(user), false) + '</div>';
  }

  html += '</article>';
  return html;
}

function buildUserForm(formId, form, isCreate) {
  var html = '<div class="sa-user-form">';

  if (isCreate) {
    html += '<section class="sa-location-form-section"><h3>Profile Identity</h3><div class="sa-user-fields">' + buildInput("user", formId, "userId", "UID / Profile ID", form.userId, "Leave blank to auto-generate") + buildInput("user", formId, "displayName", "Display Name", form.displayName) + buildInput("user", formId, "email", "Email", form.email, "name@example.com") + buildInput("user", formId, "phone", "Phone", form.phone) + '</div></section>';
  } else {
    html += '<section class="sa-location-form-section"><h3>Profile Identity</h3><div class="sa-user-fields">' + buildInput("user", formId, "displayName", "Display Name", form.displayName) + buildInput("user", formId, "phone", "Phone", form.phone) + buildInput("user", formId, "photoUrl", "Photo URL", form.photoUrl) + '<label>Email<input value="' + escapeHtml(form.email) + '" disabled></label></div></section>';
  }

  html += '<section class="sa-location-form-section"><h3>Roles & Access</h3><div class="sa-user-fields">' + buildRoleMultiSelect(formId, form.roles) + buildLocationMultiSelect(formId, form.locationIds) + buildPrimaryLocationSelect(formId, form.primaryLocationId) + buildSelect("user", formId, "status", form.status, userStatuses) + '</div></section>';
  html += buildRelationshipHints(formId, form);
  html += '<div class="sa-location-actions"><button type="button" class="sa-btn" data-action="' + (isCreate ? "create-user" : "update-user") + '" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>' + buildButtonContent(isCreate ? "Create Profile" : "Save User", (isCreate ? "create-user:new" : "update-user:" + formId)) + '</button></div>';
  html += '</div>';
  return html;
}

function buildRoleMultiSelect(formId, selectedRoles) {
  var html = '<label>Roles<select multiple size="8" data-field-kind="user" data-field-id="' + escapeHtml(formId) + '" data-field="roles">';
  var index = 0;

  while (index < userRoles.length) {
    html += '<option value="' + escapeHtml(userRoles[index]) + '"' + selected(selectedRoles.indexOf(userRoles[index]) !== -1 ? userRoles[index] : "", userRoles[index]) + '>' + escapeHtml(readRoleLabel(userRoles[index])) + '</option>';
    index = index + 1;
  }

  html += '</select></label>';
  return html;
}

function buildLocationMultiSelect(formId, selectedLocationIds) {
  var html = '<label>Locations<select multiple size="6" data-field-kind="user" data-field-id="' + escapeHtml(formId) + '" data-field="locationIds">';
  var index = 0;

  while (index < state.locations.length) {
    html += '<option value="' + escapeHtml(state.locations[index].id) + '"' + selected(selectedLocationIds.indexOf(state.locations[index].id) !== -1 ? state.locations[index].id : "", state.locations[index].id) + '>' + escapeHtml(state.locations[index].name || state.locations[index].id) + '</option>';
    index = index + 1;
  }

  html += '</select></label>';
  return html;
}

function buildPrimaryLocationSelect(formId, selectedValue) {
  return '<label>Primary Location' + buildOptionsSelect('data-field-kind="user" data-field-id="' + escapeHtml(formId) + '" data-field="primaryLocationId"', selectedValue, state.locations, "None") + '</label>';
}

function buildRelationshipHints(formId, form) {
  var html = "";

  if (form.roles.indexOf("parent") !== -1) {
    html += '<section class="sa-location-form-section"><h3>Parent Relationship Hints</h3><p>Optional for now. Add linked student IDs as comma-separated values when parent profile support is ready.</p><div class="sa-user-fields">' + buildInput("user", formId, "childStudentIdsText", "Child Student IDs", form.childStudentIdsText, "studentA, studentB") + '</div></section>';
  }

  if (form.roles.indexOf("teacher") !== -1) {
    html += '<section class="sa-location-form-section"><h3>Teacher Relationship Hints</h3><p>Optional for now. Add assigned class IDs as comma-separated values if teacher profile support exists.</p><div class="sa-user-fields">' + buildInput("user", formId, "classIdsText", "Class IDs", form.classIdsText, "classA, classB") + '</div></section>';
  }

  return html;
}

function buildLocationsHeader() {
  return '<div class="sa-page-head"><div><p class="sa-eyebrow">Tenant Directory</p><h2>Locations</h2><p>Complete location records for student login, public details, features, and admin access.</p></div><button type="button" class="sa-btn" data-action="toggle-create-location"' + disabled(isBusy()) + '>' + (state.locationCreateOpen ? "Close Create" : "Create Location") + '</button></div>';
}

function buildLocationStats() {
  var stats = readLocationStats();

  return '<section class="sa-grid sa-grid-4">'
    + buildMetricCard("Total Locations", stats.total, "All location documents")
    + buildMetricCard("Active", stats.active, "Visible and usable")
    + buildMetricCard("Archived", stats.archived, "Hidden from active login")
    + buildMetricCard("Missing Login Slugs", stats.missingSlugs, "Need shareable links")
    + '</section>';
}

function buildLocationCreatePanel() {
  if (!state.locationCreateOpen) {
    return "";
  }

  return '<article class="sa-card sa-location-editor-card"><div class="sa-section-title"><div><h2>Create Location</h2><p>Name is required. Optional fields can stay blank and be filled later.</p></div></div>' + buildLocationDetailForm("new", state.locationForm, true) + '</article>';
}

function buildLocationRows() {
  var html = '<div class="sa-location-list">';
  var index = 0;

  if (state.isRefreshing && state.locations.length === 0) {
    return buildLocationSkeletons();
  }

  if (state.locations.length === 0) {
    return '<div class="sa-empty"><strong>No locations yet.</strong><span>Create the first school or branch to start configuring login links and access.</span></div>';
  }

  while (index < state.locations.length) {
    var location = getSafeLocation(state.locations[index]);
    html += buildLocationCard(location);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildLocationSkeletons() {
  return '<div class="sa-location-skeleton"><span></span><div><i></i><i></i><i></i></div></div><div class="sa-location-skeleton"><span></span><div><i></i><i></i><i></i></div></div><div class="sa-location-skeleton"><span></span><div><i></i><i></i><i></i></div></div>';
}

function buildLocationCard(location) {
  var isOpen = state.activeLocationId === location.id;
  var locationLine = [location.city, location.region].filter(Boolean).join(", ") || location.country || "No address details";
  var loginSlug = normalizeLoginSlug(location.loginSlug);
  var actionLabel = location.status === "archived" ? "Restore" : "Archive";
  var actionName = location.status === "archived" ? "restore-location" : "archive-location";
  var html = '<article class="sa-location-card">';

  html += '<div class="sa-location-summary">';
  html += buildLocationPhoto(location);
  html += '<div class="sa-location-main"><div class="sa-location-title-row"><h3>' + escapeHtml(location.name || "Untitled location") + '</h3>' + buildStatusBadge(location.status) + '</div>';
  html += '<p>' + escapeHtml(location.type || "Private location") + '</p><small>' + escapeHtml(locationLine) + '</small>';
  html += '<div class="sa-location-meta"><span>' + (loginSlug ? "Slug: " + escapeHtml(loginSlug) : "Missing login slug") + '</span><span>' + escapeHtml(location.loginMode || "fruit") + ' login</span></div></div>';
  html += '<div class="sa-row-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="edit-location" data-id="' + escapeHtml(location.id) + '"' + disabled(isBusy()) + '>' + (isOpen ? "Close" : "Edit") + '</button><button type="button" class="sa-btn ' + (location.status === "archived" ? "sa-btn-secondary" : "sa-danger-btn") + '" data-action="' + actionName + '" data-id="' + escapeHtml(location.id) + '"' + disabled(isBusy()) + '>' + buildButtonContent(actionLabel, actionName + ":" + location.id) + '</button></div>';
  html += '</div>';

  if (isOpen) {
    html += '<div class="sa-location-detail">' + buildLocationDetailForm(location.id, location, false) + '</div>';
  }

  html += '</article>';
  return html;
}

function buildLocationPhoto(location) {
  if (location.photoUrl) {
    return '<img class="sa-location-photo" src="' + escapeHtml(location.photoUrl) + '" alt="">';
  }

  return '<div class="sa-location-photo sa-location-photo-fallback">' + escapeHtml(readInitials(location.name || "OQ")) + '</div>';
}

function buildStatusBadge(status) {
  var safeStatus = status || "active";
  var className = "sa-status sa-status-" + safeStatus;

  if (safeStatus === "inactive") {
    className += " sa-status-paused";
  } else if (safeStatus === "archived") {
    className += " sa-status-archived";
  }

  return '<span class="' + className + '">' + escapeHtml(safeStatus) + '</span>';
}

function buildLocationDetailForm(formId, form, isCreate) {
  var saveAction = isCreate ? "create-location" : "update-location";
  var saveLabel = isCreate ? "Create Location" : "Save Location";
  var html = '<div class="sa-location-form">';

  html += buildLocationFormSection("Basic Info",
    buildInput("location", formId, "name", "Name", form.name, "Oxford International School", "text", true)
    + buildInput("location", formId, "type", "Type", form.type, "Private location")
    + buildSelectWithLabel("location", formId, "status", "Status", form.status, ["active", "inactive", "archived"])
    + buildTextarea("location", formId, "description", "Description", form.description, "Short internal or public description")
    + buildInput("location", formId, "schoolCode", "School Code", form.schoolCode, "OIS")
    + buildInput("location", formId, "photoUrl", "Photo URL", form.photoUrl, "https://example.com/logo.png", "url"));

  html += buildLocationFormSection("Address",
    buildTextarea("location", formId, "address", "Address", form.address, "Street, building, district")
    + buildInput("location", formId, "city", "City", form.city, "Bishkek")
    + buildInput("location", formId, "region", "Region", form.region, "Chuy")
    + buildInput("location", formId, "country", "Country", form.country, "Kyrgyzstan")
    + buildInput("location", formId, "twoGisUrl", "2GIS URL", form.twoGisUrl, "https://2gis...", "url")
    + buildInput("location", formId, "latitude", "Latitude", stringifyOptionalNumber(form.latitude), "42.8746", "number")
    + buildInput("location", formId, "longitude", "Longitude", stringifyOptionalNumber(form.longitude), "74.5698", "number"));

  html += buildLocationFormSection("Contact",
    buildInput("location", formId, "contact", "Phone / Contact", form.contact, "+996 ...")
    + buildInput("location", formId, "email", "Email", form.email, "school@example.com", "email")
    + buildInput("location", formId, "website", "Website", form.website, "https://example.com", "url")
    + buildInput("location", formId, "hours", "Hours", form.hours, "0800 - 1700")
    + buildInput("location", formId, "socialLinks.instagram", "Instagram", form.socialLinks.instagram, "https://instagram.com/...", "url")
    + buildInput("location", formId, "socialLinks.facebook", "Facebook", form.socialLinks.facebook, "https://facebook.com/...", "url")
    + buildInput("location", formId, "socialLinks.telegram", "Telegram", form.socialLinks.telegram, "https://t.me/...", "url")
    + buildInput("location", formId, "socialLinks.whatsapp", "WhatsApp", form.socialLinks.whatsapp, "https://wa.me/...", "url")
    + buildInput("location", formId, "socialLinks.youtube", "YouTube", form.socialLinks.youtube, "https://youtube.com/...", "url"));

  html += buildLocationFormSection("Login Settings",
    buildSelectWithLabel("location", formId, "loginMode", "Login Mode", form.loginMode, ["fruit", "standard", "hybrid"])
    + buildInput("location", formId, "loginSlug", "Login Slug", form.loginSlug, "oxford-international-school")
    + buildCheckbox("location", formId, "allowStudentLogin", "Allow student login", form.allowStudentLogin)
    + buildLoginLinkPreview(formId, form.loginSlug));

  html += buildLocationFormSection("Features",
    buildInput("location", formId, "languagesText", "Languages", form.languagesText, "en, ru")
    + buildCheckbox("location", formId, "intentionStoreEnabled", "Intention Store", form.intentionStoreEnabled)
    + buildCheckbox("location", formId, "parentPortalEnabled", "Parent Portal", form.parentPortalEnabled)
    + buildCheckbox("location", formId, "courseEditorEnabled", "Course Editor", form.courseEditorEnabled)
    + buildCheckbox("location", formId, "gamificationEnabled", "Gamification", form.gamificationEnabled));

  html += buildLocationFormSection("Admin / Subscription",
    buildTextarea("location", formId, "adminUidsText", "Admin UIDs", form.adminUidsText, "Comma-separated Firebase UIDs")
    + buildInput("location", formId, "subscription.plan", "Subscription Plan", form.subscription.plan, "pilot")
    + buildInput("location", formId, "subscription.maxStudents", "Max Students", stringifyOptionalNumber(form.subscription.maxStudents), "100", "number")
    + buildInput("location", formId, "subscription.expiresAt", "Expires At", form.subscription.expiresAt || "", "2026-12-31", "date"));

  html += '<div class="sa-location-actions"><button type="button" class="sa-btn" data-action="' + saveAction + '" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>' + buildButtonContent(saveLabel, saveAction + ":" + formId) + '</button><button type="button" class="sa-btn sa-btn-secondary" data-action="' + (isCreate ? "toggle-create-location" : "close-location-editor") + '" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>Cancel</button></div>';
  html += '</div>';

  return html;
}

function buildLocationFormSection(title, fieldsHtml) {
  return '<section class="sa-location-form-section"><h3>' + escapeHtml(title) + '</h3><div class="sa-location-fields">' + fieldsHtml + '</div></section>';
}

function buildLoginLinkPreview(formId, loginSlug) {
  var normalizedSlug = normalizeLoginSlug(loginSlug);
  var loginLink = buildLoginLink(normalizedSlug);

  if (!normalizedSlug) {
    return '<div class="sa-login-link-preview" data-login-preview-for="' + escapeHtml(formId) + '"><strong>Login Link</strong><span>Add a slug to create a shareable location login link.</span></div>';
  }

  return '<div class="sa-login-link-preview" data-login-preview-for="' + escapeHtml(formId) + '"><strong>Login Link</strong><span>' + escapeHtml(loginLink) + '</span><button type="button" class="sa-btn sa-btn-secondary" data-action="copy-login-link" data-id="' + escapeHtml(normalizedSlug) + '">Copy Link</button></div>';
}

function buildClassesTab() {
  return '<section class="sa-stack">'
    + '<article class="sa-card"><h2>Create Class / Group</h2>' + buildClassForm("new", state.classForm) + '</article>'
    + '<article class="sa-card"><h2>Classes</h2>' + buildAdminFilters(false) + buildClassRows() + '</article>'
    + '</section>';
}

function buildClassRows() {
  var html = '<div class="sa-table">';
  var index = 0;

  if (state.classes.length === 0) {
    return '<div class="sa-empty">No classes found.</div>';
  }

  while (index < state.classes.length) {
    var classRecord = state.classes[index];
    html += '<div class="sa-row">' + buildClassForm(classRecord.id, normalizeClassForm(classRecord)) + '</div>';
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildClassForm(formId, form) {
  return '<div class="sa-form sa-form-6">'
    + buildInput("class", formId, "name", "Name", form.name)
    + buildLocationSelect("class", formId, form.locationId)
    + buildSelect("class", formId, "status", form.status, ["active", "inactive", "archived"])
    + buildSelect("class", formId, "isVisible", form.isVisible ? "true" : "false", ["true", "false"])
    + buildInput("class", formId, "photoDataUrl", "Photo URL", form.photoDataUrl)
    + '<button type="button" class="sa-btn" data-action="' + (formId === "new" ? "create-class" : "update-class") + '" data-id="' + escapeHtml(formId) + '">' + (formId === "new" ? "Create" : "Save") + '</button>'
    + '</div>';
}

function buildStudentsTab() {
  return '<section class="sa-stack">'
    + '<article class="sa-card"><h2>Create Student</h2><p>Students are user-linked learning profiles. Manage identity and access in User Management.</p>' + buildStudentForm("new", state.studentForm, true) + '</article>'
    + '<article class="sa-card"><h2>Students</h2><p>Students are user-linked learning profiles. Manage identity and access in User Management.</p>' + buildAdminFilters(true) + buildStudentRows() + '</article>'
    + '</section>';
}

function buildStudentRows() {
  var html = '<div class="sa-student-list">';
  var index = 0;

  if (state.students.length === 0) {
    return '<div class="sa-empty">No students found.</div>';
  }

  while (index < state.students.length) {
    var student = state.students[index];
    html += '<article class="sa-student-card">';
    html += '<div class="sa-student-head">' + buildAvatar(student) + '<div><strong>' + escapeHtml(student.name || student.id) + '</strong><small>' + escapeHtml(student.role) + ' · ' + escapeHtml(student.status || "no status") + '</small><small>Fruit configured: ' + (student.fruitPasswordSet ? "Yes" : "No") + '</small></div></div>';
    html += '<div class="sa-summary"><p>Linked user: ' + escapeHtml(readLinkedUserLabel(student)) + '</p></div>';
    html += buildStudentForm(student.id, normalizeStudentForm(student), false);
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-reset-fruit" data-id="' + escapeHtml(student.id) + '">Reset Fruit Password</button>';
    html += '</article>';
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildStudentForm(formId, form, includeFruitSelector) {
  var html = '<div class="sa-form sa-form-student">';
  html += buildInput("student", formId, "name", "Name", form.name);
  html += buildLocationSelect("student", formId, form.locationId);
  html += buildClassSelect("student", formId, form.classId);
  html += buildSelect("student", formId, "status", form.status, ["active", "inactive", "archived", "approved"]);
  html += buildInput("student", formId, "photoUrl", "Photo URL", form.photoUrl);
  html += buildInput("student", formId, "email", "Email", form.email);
  html += buildInput("student", formId, "username", "Username", form.username);
  html += '<button type="button" class="sa-btn" data-action="' + (formId === "new" ? "create-student" : "update-student") + '" data-id="' + escapeHtml(formId) + '">' + (formId === "new" ? "Create Student" : "Save Student") + '</button>';
  html += '</div>';

  if (includeFruitSelector) {
    html += '<div class="sa-fruit-panel"><h3>Initial Fruit Password</h3>' + buildFruitSelector("create", state.studentForm.fruitPassword) + '</div>';
  }

  return html;
}

function buildAssignmentsTab() {
  return '<section class="sa-stack">'
    + '<article class="sa-card"><h2>Create Course Assignment</h2><p>Choose who should see a course: a whole location, one class, or one student.</p>' + buildAssignmentForm() + '</article>'
    + '<article class="sa-card"><h2>Course Assignments</h2>' + buildAssignmentFilters() + buildAssignmentRows() + '</article>'
    + '</section>';
}

function buildAssignmentForm() {
  return '<div class="sa-form sa-form-assignment">'
    + buildCourseSelect("assignment", "new", state.assignmentForm.courseId)
    + buildAssignmentTargetTypeSelect("assignment", "new", state.assignmentForm.targetType)
    + buildAssignmentTargetSelect("assignment", "new", state.assignmentForm.targetType, state.assignmentForm.targetId)
    + buildSelect("assignment", "new", "status", state.assignmentForm.status, ["active", "paused", "archived"])
    + '<button type="button" class="sa-btn" data-action="create-assignment">Create Assignment</button>'
    + '</div>';
}

function buildAssignmentFilters() {
  var html = '<div class="sa-filters sa-assignment-filters">';
  html += '<label>Course' + buildCourseOptionsSelect('data-assignment-filter="courseId"', state.assignmentFilters.courseId, "All courses") + '</label>';
  html += '<label>Target Type' + buildBasicOptionsSelect('data-assignment-filter="targetType"', state.assignmentFilters.targetType, ["location", "class", "student"], "All targets") + '</label>';
  html += '<label>Status' + buildBasicOptionsSelect('data-assignment-filter="status"', state.assignmentFilters.status, ["active", "paused", "archived"], "All statuses") + '</label>';
  html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data">Apply</button>';
  html += '</div>';
  return html;
}

function buildAssignmentRows() {
  var html = '<div class="sa-table">';
  var index = 0;

  if (state.assignments.length === 0) {
    return '<div class="sa-empty">No course assignments found yet. Create one above so students see the right courses.</div>';
  }

  while (index < state.assignments.length) {
    var assignment = state.assignments[index];
    html += '<article class="sa-assignment-row">';
    html += '<div><strong>' + escapeHtml(readCourseName(assignment.courseId)) + '</strong><small>Course ID: ' + escapeHtml(assignment.courseId) + '</small></div>';
    html += '<div><span class="sa-pill">' + escapeHtml(assignment.targetType) + '</span><strong>' + escapeHtml(readAssignmentTargetName(assignment)) + '</strong><small>Target ID: ' + escapeHtml(assignment.targetId) + '</small></div>';
    html += '<div><span class="sa-status sa-status-' + escapeHtml(assignment.status || "active") + '">' + escapeHtml(assignment.status || "active") + '</span><small>Assigned by: ' + escapeHtml(assignment.assignedBy || "unknown") + '</small></div>';
    html += '<div class="sa-row-actions">';
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="activate-assignment" data-id="' + escapeHtml(assignment.id) + '">Activate</button>';
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="pause-assignment" data-id="' + escapeHtml(assignment.id) + '">Pause</button>';
    html += '<button type="button" class="sa-btn sa-danger-btn" data-action="archive-assignment" data-id="' + escapeHtml(assignment.id) + '">Archive</button>';
    html += '</div>';
    html += '</article>';
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildLoginToolsTab() {
  var selectedStudent = findStudent(state.loginToolStudentId) || (state.students.length > 0 ? state.students[0] : null);
  var selectedStudentId = selectedStudent ? selectedStudent.id : "";

  return '<section class="sa-stack">'
    + '<article class="sa-card"><h2>Current Admin</h2><p><strong>UID:</strong> ' + escapeHtml(state.actor.id) + '</p><p><strong>Email:</strong> ' + escapeHtml(state.actor.email) + '</p><p><strong>Role:</strong> ' + escapeHtml(state.actor.role) + '</p></article>'
    + '<article class="sa-card"><h2>Student Login Test Helper</h2>' + buildAdminFilters(true) + '<div class="sa-form sa-form-2">' + buildStudentSelect(selectedStudentId) + '<button type="button" class="sa-btn" data-action="open-student-login">Open Student Login</button><button type="button" class="sa-btn sa-btn-secondary" data-action="open-reset-fruit" data-id="' + escapeHtml(selectedStudentId) + '">Reset This Student</button></div>' + buildStudentSummary(selectedStudent) + '</article>'
    + '<article class="sa-card"><h2>Switch User</h2><p>Sign out and clear local student session markers.</p><button type="button" class="sa-btn sa-danger-btn" data-action="sign-out">Sign out</button></article>'
    + '</section>';
}

function buildStudentSummary(student) {
  if (!student) {
    return '<div class="sa-empty">Choose a student to inspect login readiness.</div>';
  }

  return '<div class="sa-summary"><p>Status: ' + escapeHtml(student.status || "missing") + '</p><p>Class: ' + escapeHtml(readClassName(student.classId)) + '</p><p>Location: ' + escapeHtml(readLocationName(student.locationId)) + '</p><p>Fruit password configured: ' + (student.fruitPasswordSet ? "Yes" : "No") + '</p></div>';
}

function buildAdminFilters(includeClass) {
  var html = '<div class="sa-filters">';
  html += '<label>Location' + buildLocationFilter() + '</label>';

  if (includeClass) {
    html += '<label>Class' + buildClassFilter() + '</label>';
    html += '<label>Search<input data-filter="searchText" value="' + escapeHtml(state.filters.searchText) + '" placeholder="Search students"></label>';
  }

  html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data">Apply</button>';
  html += '</div>';
  return html;
}

function buildLocationFilter() {
  return buildOptionsSelect('data-filter="locationId"', state.filters.locationId, state.locations, "All locations");
}

function buildClassFilter() {
  return buildOptionsSelect('data-filter="classId"', state.filters.classId, state.classes, "All classes");
}

function buildLocationSelect(kind, id, selectedValue) {
  return '<label>Location' + buildOptionsSelect('data-field-kind="' + kind + '" data-field-id="' + id + '" data-field="locationId"', selectedValue, state.locations, "Choose location") + '</label>';
}

function buildClassSelect(kind, id, selectedValue) {
  return '<label>Class' + buildOptionsSelect('data-field-kind="' + kind + '" data-field-id="' + id + '" data-field="classId"', selectedValue, state.classes, "Choose class") + '</label>';
}

function buildStudentSelect(selectedValue) {
  return '<label>Student' + buildOptionsSelect('data-login-tool-student="true"', selectedValue, state.students, "Choose student") + '</label>';
}

function buildCourseSelect(kind, id, selectedValue) {
  return '<label>Course' + buildCourseOptionsSelect('data-field-kind="' + kind + '" data-field-id="' + id + '" data-field="courseId"', selectedValue, "Choose course") + '</label>';
}

function buildAssignmentTargetTypeSelect(kind, id, selectedValue) {
  return '<label>Target Type' + buildBasicOptionsSelect('data-field-kind="' + kind + '" data-field-id="' + id + '" data-field="targetType"', selectedValue, ["location", "class", "student"], "Choose target type") + '</label>';
}

function buildAssignmentTargetSelect(kind, id, targetType, selectedValue) {
  var attributes = 'data-field-kind="' + kind + '" data-field-id="' + id + '" data-field="targetId"';

  if (targetType === "class") {
    return '<label>Target' + buildOptionsSelect(attributes, selectedValue, state.classes, "Choose class") + '</label>';
  }

  if (targetType === "student") {
    return '<label>Target' + buildOptionsSelect(attributes, selectedValue, state.students, "Choose student") + '</label>';
  }

  return '<label>Target' + buildOptionsSelect(attributes, selectedValue, state.locations, "Choose location") + '</label>';
}

function buildCourseOptionsSelect(attributes, selectedValue, emptyLabel) {
  var html = '<select ' + attributes + '><option value="">' + escapeHtml(emptyLabel) + '</option>';
  var index = 0;

  while (index < state.courses.length) {
    var course = state.courses[index];
    html += '<option value="' + escapeHtml(course.id) + '"' + selected(selectedValue, course.id) + '>' + escapeHtml(readCourseTitle(course)) + '</option>';
    index = index + 1;
  }

  html += '</select>';
  return html;
}

function buildBasicOptionsSelect(attributes, selectedValue, options, emptyLabel) {
  var html = '<select ' + attributes + '><option value="">' + escapeHtml(emptyLabel) + '</option>';
  var index = 0;

  while (index < options.length) {
    html += '<option value="' + escapeHtml(options[index]) + '"' + selected(selectedValue, options[index]) + '>' + escapeHtml(options[index]) + '</option>';
    index = index + 1;
  }

  html += '</select>';
  return html;
}

function buildOptionsSelect(attributes, selectedValue, items, emptyLabel) {
  var html = '<select ' + attributes + '><option value="">' + escapeHtml(emptyLabel) + '</option>';
  var index = 0;

  while (index < items.length) {
    var item = items[index];
    html += '<option value="' + escapeHtml(item.id) + '"' + selected(selectedValue, item.id) + '>' + escapeHtml(item.name || item.displayName || item.id) + '</option>';
    index = index + 1;
  }

  html += '</select>';
  return html;
}

function buildInput(kind, id, field, label, value, placeholder, type, required) {
  var inputType = type || "text";
  var inputPlaceholder = placeholder || label;

  return '<label>' + escapeHtml(label) + '<input type="' + escapeHtml(inputType) + '" data-field-kind="' + kind + '" data-field-id="' + escapeHtml(id) + '" data-field="' + escapeHtml(field) + '" value="' + escapeHtml(readSafeString(value)) + '" placeholder="' + escapeHtml(inputPlaceholder) + '"' + (required ? " required" : "") + '></label>';
}

function buildSelect(kind, id, field, value, options) {
  return buildSelectWithLabel(kind, id, field, field, value, options);
}

function buildSelectWithLabel(kind, id, field, label, value, options) {
  var html = '<label>' + escapeHtml(label) + '<select data-field-kind="' + kind + '" data-field-id="' + escapeHtml(id) + '" data-field="' + escapeHtml(field) + '">';
  var index = 0;

  while (index < options.length) {
    html += '<option value="' + escapeHtml(options[index]) + '"' + selected(value, options[index]) + '>' + escapeHtml(options[index]) + '</option>';
    index = index + 1;
  }

  html += '</select></label>';
  return html;
}

function buildTextarea(kind, id, field, label, value, placeholder) {
  return '<label class="sa-field-wide">' + escapeHtml(label) + '<textarea data-field-kind="' + kind + '" data-field-id="' + escapeHtml(id) + '" data-field="' + escapeHtml(field) + '" placeholder="' + escapeHtml(placeholder || label) + '">' + escapeHtml(readSafeString(value)) + '</textarea></label>';
}

function buildCheckbox(kind, id, field, label, checked) {
  return '<label class="sa-check"><input type="checkbox" data-field-kind="' + kind + '" data-field-id="' + escapeHtml(id) + '" data-field="' + escapeHtml(field) + '"' + (checked ? " checked" : "") + '><span>' + escapeHtml(label) + '</span></label>';
}

function buildResetModal() {
  if (!state.resetStudentId) {
    return "";
  }

  var student = findStudent(state.resetStudentId);
  var name = student ? student.name : state.resetStudentId;

  return '<div class="sa-modal-backdrop"><section class="sa-modal"><h2>Reset Fruit Password</h2><p>' + escapeHtml(name) + '</p>' + buildFruitSelector("reset", state.resetFruitPassword) + '<div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-reset-fruit">Cancel</button><button type="button" class="sa-btn" data-action="confirm-reset-fruit"' + disabled(state.resetFruitPassword.length !== 4) + '>Confirm Reset</button></div></section></div>';
}

function buildFruitSelector(mode, values) {
  var html = '<div class="sa-fruit-slots">';
  var index = 0;

  while (index < 4) {
    html += '<span>' + escapeHtml(readFruitLabel(values[index])) + '</span>';
    index = index + 1;
  }

  html += '</div><div class="sa-fruit-grid">';
  index = 0;

  while (index < fruits.length) {
    html += '<button type="button" class="sa-fruit-btn" data-fruit-mode="' + escapeHtml(mode) + '" data-fruit="' + escapeHtml(fruits[index]) + '">' + readFruitLabel(fruits[index]) + '</button>';
    index = index + 1;
  }

  html += '</div><div class="sa-form sa-form-2"><button type="button" class="sa-btn sa-btn-secondary" data-fruit-action="' + escapeHtml(mode) + ':backspace">Backspace</button><button type="button" class="sa-btn sa-btn-secondary" data-fruit-action="' + escapeHtml(mode) + ':clear">Clear</button></div>';
  return html;
}

function handleClick(event) {
  var tabButton = event.target.closest("[data-tab]");
  var actionButton = event.target.closest("[data-action]");
  var fruitButton = event.target.closest("[data-fruit]");
  var fruitActionButton = event.target.closest("[data-fruit-action]");

  if (tabButton) {
    var requestedTab = tabButton.getAttribute("data-tab");

    if (canOpenTab(requestedTab)) {
      setState({ activeTab: requestedTab, message: "" });
    }
    return;
  }

  if (fruitButton) {
    addFruit(fruitButton.getAttribute("data-fruit-mode"), fruitButton.getAttribute("data-fruit"));
    return;
  }

  if (fruitActionButton) {
    handleFruitAction(fruitActionButton.getAttribute("data-fruit-action"));
    return;
  }

  if (actionButton) {
    if (isBusy() && actionButton.getAttribute("data-action") !== "copy-login-link") {
      return;
    }

    handleAction(actionButton.getAttribute("data-action"), actionButton.getAttribute("data-id"));
  }
}

function handleInput(event) {
  var target = event.target;

  if (!target) {
    return;
  }

  if (target.getAttribute("data-filter")) {
    state.filters[target.getAttribute("data-filter")] = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-login-field")) {
    updateLoginField(target.getAttribute("data-login-field"), target.value);
    return;
  }

  if (target.getAttribute("data-assignment-filter")) {
    state.assignmentFilters[target.getAttribute("data-assignment-filter")] = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-user-filter")) {
    state.userFilters[target.getAttribute("data-user-filter")] = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-login-tool-student")) {
    setState({ loginToolStudentId: target.value });
    return;
  }

  if (target.getAttribute("data-overview-search")) {
    state.overviewSearchText = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-field")) {
    updateFormValue(target);
  }
}

function updateLoginField(field, value) {
  if (field === "email") {
    state.loginEmail = value;
  } else if (field === "password") {
    state.loginPassword = value;
  }
}

function updateFormValue(target) {
  var kind = target.getAttribute("data-field-kind");
  var id = target.getAttribute("data-field-id");
  var field = target.getAttribute("data-field");
  var value = target.type === "checkbox" ? target.checked : target.value;

  if (target.multiple) {
    value = readSelectedValues(target);
  }

  if (field === "isVisible") {
    value = value === "true";
  }

  if (kind === "location" && id === "new") {
    setLocationFormValue(state.locationForm, field, value);
    if (field === "loginSlug") {
      updateLocationSlugPreview(id, value);
    }
  } else if (kind === "class" && id === "new") {
    state.classForm[field] = value;
  } else if (kind === "student" && id === "new") {
    state.studentForm[field] = value;
  } else if (kind === "user" && id === "new") {
    setUserFormValue(state.userForm, field, value);
    render();
  } else if (kind === "assignment" && id === "new") {
    if (field === "targetType" && state.assignmentForm.targetType !== value) {
      state.assignmentForm.targetId = "";
    }
    state.assignmentForm[field] = value;
    render();
  } else {
    updateExistingRecord(kind, id, field, value);
  }
}

function updateExistingRecord(kind, id, field, value) {
  var list = state.students;
  var index = 0;

  if (kind === "location") {
    list = state.locations;
  } else if (kind === "class") {
    list = state.classes;
  } else if (kind === "user") {
    list = state.users;
  } else if (kind === "assignment") {
    list = state.assignments;
  }

  while (index < list.length) {
    if (list[index].id === id) {
      if (kind === "location") {
        setLocationFormValue(list[index], field, value);

        if (field === "loginSlug") {
          updateLocationSlugPreview(id, value);
        }

        return;
      }

      list[index][field] = value;
      if (kind === "user") {
        setUserFormValue(list[index], field, value);
        render();
        return;
      }
      render();
      return;
    }

    index = index + 1;
  }
}

async function handleAction(action, id) {
  if (action === "refresh-data") {
    state.pendingAction = "refresh-data";
    await refreshAllData();
    setState({ pendingAction: "" });
  } else if (action === "admin-login") {
    await loginAdmin();
  } else if (action === "go-admin-login") {
    await goAdminLogin();
  } else if (action === "toggle-create-location") {
    setState({ locationCreateOpen: !state.locationCreateOpen, activeLocationId: "", message: "" });
  } else if (action === "edit-location") {
    setState({ activeLocationId: state.activeLocationId === id ? "" : id, locationCreateOpen: false, message: "" });
  } else if (action === "close-location-editor") {
    setState({ activeLocationId: "", message: "" });
  } else if (action === "create-location") {
    await saveLocation("CreateLocationIntent", state.locationForm, "Location created.", "create-location:new");
  } else if (action === "update-location") {
    await saveLocation("UpdateLocationIntent", findLocation(id), "Location saved.", "update-location:" + id);
  } else if (action === "archive-location") {
    await archiveLocation(id, true);
  } else if (action === "restore-location") {
    await archiveLocation(id, false);
  } else if (action === "toggle-create-user") {
    setState({ userCreateOpen: !state.userCreateOpen, activeUserId: "", message: "" });
  } else if (action === "edit-user") {
    setState({ activeUserId: state.activeUserId === id ? "" : id, userCreateOpen: false, message: "" });
  } else if (action === "create-user") {
    await saveUserProfile("create", "new");
  } else if (action === "update-user") {
    await saveUserProfile("update", id);
  } else if (action === "create-class") {
    await saveIntent("CreateClassIntent", state.classForm, "Class created.");
    state.classForm = createClassForm();
    await refreshAllData();
  } else if (action === "update-class") {
    await saveIntent("UpdateClassIntent", normalizeClassForm(findClass(id)), "Class saved.");
    await refreshAllData();
  } else if (action === "create-student") {
    await saveIntent("CreateStudentIntent", state.studentForm, "Student created.");
    state.studentForm = createStudentForm();
    await refreshAllData();
  } else if (action === "update-student") {
    await saveIntent("UpdateStudentIntent", normalizeStudentForm(findStudent(id)), "Student saved.");
    await refreshAllData();
  } else if (action === "create-assignment") {
    await saveIntent("CreateCourseAssignmentIntent", state.assignmentForm, "Course assignment created.");
    state.assignmentForm = createAssignmentForm();
    await refreshAllData();
  } else if (action === "activate-assignment") {
    await updateAssignmentStatus(id, "active");
  } else if (action === "pause-assignment") {
    await updateAssignmentStatus(id, "paused");
  } else if (action === "archive-assignment") {
    await saveIntent("ArchiveCourseAssignmentIntent", { assignmentId: id }, "Course assignment archived.");
    await refreshAllData();
  } else if (action === "open-reset-fruit") {
    if (id) {
      setState({ resetStudentId: id, resetFruitPassword: [], message: "" });
    }
  } else if (action === "close-reset-fruit") {
    setState({ resetStudentId: "", resetFruitPassword: [] });
  } else if (action === "confirm-reset-fruit") {
    await resetFruitPassword();
  } else if (action === "open-student-login") {
    window.open("../student-login/index.html", "_blank");
  } else if (action === "copy-login-link") {
    await copyLoginLink(id);
  } else if (action.indexOf("overview-") === 0) {
    handleOverviewAction(action, id);
  } else if (action === "sign-out") {
    await signOutAdmin();
  }
}

function handleOverviewAction(action, id) {
  if (action === "overview-chart-week") {
    setState({ overviewChartRange: "week" });
    return;
  }

  if (action === "overview-chart-month") {
    setState({ overviewChartRange: "month" });
    return;
  }

  if (action === "overview-chart-year") {
    setState({ overviewChartRange: "year" });
    return;
  }

  if (action === "overview-create-location") {
    setState({ activeTab: "locations", locationCreateOpen: true, activeLocationId: "", message: "" });
    return;
  }

  if (action === "overview-create-class" || action === "overview-open-classes" || action === "overview-open-class") {
    setState({ activeTab: "classes", message: "" });
    return;
  }

  if (action === "overview-create-student" || action === "overview-open-students" || action === "overview-open-student") {
    setState({ activeTab: "students", message: "" });
    return;
  }

  if (action === "overview-create-teacher") {
    setState({ activeTab: "users", userCreateOpen: true, activeUserId: "", userForm: Object.assign(createUserForm(), { roles: ["teacher"] }), message: "" });
    return;
  }

  if (action === "overview-open-locations") {
    setState({ activeTab: "locations", message: "" });
    return;
  }

  if (action === "overview-open-location") {
    setState({ activeTab: "locations", activeLocationId: id || "", locationCreateOpen: false, message: "" });
    return;
  }

  if (action === "overview-open-login-tools") {
    setState({ activeTab: "loginTools", message: "" });
    return;
  }

  if (action === "overview-create-course" || action === "overview-open-course-creator") {
    window.open("../course-creator-dashboard/index.html", "_blank");
    return;
  }

  if (action === "overview-open-course") {
    setState({ activeTab: "assignments", assignmentFilters: Object.assign({}, state.assignmentFilters, { courseId: id || "" }), message: "" });
    return;
  }

  if (action === "overview-open-users") {
    setState({ activeTab: "users", activeUserId: id || "", message: "" });
  }
}

async function loginAdmin() {
  var email = state.loginEmail.trim();
  var password = state.loginPassword.trim();

  if (!email || !password) {
    setState({ message: "Email and password are required.", messageType: "error" });
    return;
  }

  try {
    rememberReturnDestination();
    setState({ isSaving: true, message: "Signing in...", messageType: "info" });
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    setState({
      isSaving: false,
      needsLogin: true,
      message: "Login failed: " + error.message,
      messageType: "error"
    });
  }
}

async function goAdminLogin() {
  rememberReturnDestination();
  if (auth.currentUser) {
    await signOut(auth);
  }
  window.location.href = buildAdminLoginUrl();
}

function rememberReturnDestination() {
  if (window.sessionStorage) {
    window.sessionStorage.setItem("oquwayAdminReturnTo", window.location.href);
  }
}

function buildAdminLoginUrl() {
  return "../course-creator-dashboard/login.html?returnTo=" + encodeURIComponent(window.location.href);
}

async function updateAssignmentStatus(assignmentId, status) {
  await saveIntent("UpdateCourseAssignmentIntent", {
    assignmentId: assignmentId,
    status: status
  }, "Course assignment updated.");
  await refreshAllData();
}

async function saveLocation(intentType, location, successMessage, actionKey) {
  var payload = normalizeLocationForm(location);
  var validationError = validateLocationForm(payload);

  if (validationError) {
    setState({ message: validationError, messageType: "error" });
    return false;
  }

  if (payload.status !== "archived" && hasDuplicateLocationSlug(payload.loginSlug, payload.locationId)) {
    setState({ message: "That loginSlug is already used by another active location.", messageType: "error" });
    return false;
  }

  setState({ isSaving: true, pendingAction: actionKey, message: payload.loginSlug ? "Checking login slug and saving..." : "Saving location...", messageType: "info" });
  var result = await runAdminIntent(intentType, payload);

  if (isSuccess(result)) {
    state.locationForm = createLocationForm();
    state.locationCreateOpen = false;
    state.activeLocationId = "";
    setState({ isSaving: false, pendingAction: "", message: successMessage, messageType: "success" });
    await refreshAllData();
    setState({ message: successMessage, messageType: "success" });
    return true;
  }

  setState({ isSaving: false, pendingAction: "", message: readIntentError(result), messageType: "error" });
  return false;
}

async function archiveLocation(locationId, shouldArchive) {
  var location = findLocation(locationId);
  var payload = normalizeLocationForm(Object.assign({}, location, {
    status: shouldArchive ? "archived" : "active",
    isArchived: shouldArchive
  }));
  var actionKey = (shouldArchive ? "archive-location:" : "restore-location:") + locationId;

  setState({ isSaving: true, pendingAction: actionKey, message: shouldArchive ? "Archiving location..." : "Restoring location...", messageType: "info" });
  var result = await runAdminIntent("UpdateLocationIntent", payload);

  if (isSuccess(result)) {
    var successMessage = shouldArchive ? "Location archived." : "Location restored.";
    setState({ isSaving: false, pendingAction: "", activeLocationId: "", message: successMessage, messageType: "success" });
    await refreshAllData();
    setState({ message: successMessage, messageType: "success" });
    return;
  }

  setState({ isSaving: false, pendingAction: "", message: readIntentError(result), messageType: "error" });
}

async function saveUserProfile(mode, userId) {
  var source = mode === "create" ? state.userForm : normalizeUserForm(findUser(userId) || { id: userId });
  var payload = normalizeUserProfilePayload(source, mode === "create" ? "" : userId);
  var validationError = validateUserProfile(payload, mode);
  var actionKey = mode === "create" ? "create-user:new" : "update-user:" + userId;

  if (validationError) {
    setState({ message: validationError, messageType: "error" });
    return false;
  }

  if (mode === "update" && isCurrentUserSelfDemotion(userId, payload.roles)) {
    setState({ message: "For safety, this dashboard will not remove your own superAdmin/platformAdmin role. Ask another platform admin to make that change.", messageType: "error" });
    return false;
  }

  try {
    setState({ isSaving: true, pendingAction: actionKey, message: mode === "create" ? "Creating profile..." : "Saving user...", messageType: "info" });
    var profileRef = mode === "create" && !payload.userId ? doc(collection(db, "users")) : doc(db, "users", payload.userId || userId);
    var record = buildUserProfileRecord(payload, mode === "create");

    await setDoc(profileRef, record, { merge: true });

    if (mode === "create") {
      state.userForm = createUserForm();
      state.userCreateOpen = false;
    }

    state.activeUserId = "";
    setState({ isSaving: false, pendingAction: "", message: mode === "create" ? "User profile created." : "User saved.", messageType: "success" });
    await refreshAllData();
    setState({ message: mode === "create" ? "User profile created." : "User saved.", messageType: "success" });
    return true;
  } catch (error) {
    setState({ isSaving: false, pendingAction: "", message: "Could not save user profile: " + (error.message || "Unknown error"), messageType: "error" });
    return false;
  }
}

async function copyLoginLink(loginSlug) {
  var normalizedSlug = normalizeLoginSlug(loginSlug);

  if (!normalizedSlug) {
    setState({ message: "Add a valid loginSlug before copying the link.", messageType: "error" });
    return;
  }

  var loginLink = buildLoginLink(normalizedSlug);

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(loginLink);
    } else {
      copyTextWithFallback(loginLink);
    }

    setState({ message: "Login link copied: " + loginLink, messageType: "success" });
  } catch (error) {
    copyTextWithFallback(loginLink);
    setState({ message: "Login link copied: " + loginLink, messageType: "success" });
  }
}

function copyTextWithFallback(text) {
  var textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.setAttribute("readonly", "readonly");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

async function saveIntent(intentType, payload, successMessage) {
  setState({ isSaving: true, message: "Saving...", messageType: "info" });
  var result = await runAdminIntent(intentType, payload || {});

  if (isSuccess(result)) {
    setState({ isSaving: false, message: successMessage, messageType: "success" });
    return true;
  }

  setState({ isSaving: false, message: readIntentError(result), messageType: "error" });
  return false;
}

async function resetFruitPassword() {
  if (!state.resetStudentId || state.resetFruitPassword.length !== 4) {
    setState({ message: "Choose a student and exactly four fruits.", messageType: "error" });
    return;
  }

  await saveIntent("ResetStudentFruitPasswordIntent", {
    studentId: state.resetStudentId,
    fruitPassword: state.resetFruitPassword
  }, "Fruit password reset.");

  setState({ resetStudentId: "", resetFruitPassword: [] });
  await refreshAllData();
}

function addFruit(mode, fruit) {
  var values = mode === "reset" ? state.resetFruitPassword.slice() : state.studentForm.fruitPassword.slice();

  if (values.length >= 4) {
    return;
  }

  values.push(fruit);
  setFruitValues(mode, values);
}

function handleFruitAction(actionValue) {
  var parts = actionValue.split(":");
  var mode = parts[0];
  var action = parts[1];
  var values = mode === "reset" ? state.resetFruitPassword.slice() : state.studentForm.fruitPassword.slice();

  if (action === "clear") {
    values = [];
  } else if (action === "backspace") {
    values.pop();
  }

  setFruitValues(mode, values);
}

function setFruitValues(mode, values) {
  if (mode === "reset") {
    setState({ resetFruitPassword: values });
    return;
  }

  state.studentForm.fruitPassword = values;
  render();
}

async function signOutAdmin() {
  if (window.sessionStorage) {
    window.sessionStorage.removeItem("oquwayStudentSessionUid");
    window.sessionStorage.removeItem("oquwayStudentSessionStartedAt");
  }

  rememberReturnDestination();
  await signOut(auth);
  window.location.href = buildAdminLoginUrl();
}

async function runAdminIntent(intentType, payload) {
  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload,
    actor: state.actor,
    meta: {
      createdAt: Date.now(),
      source: "super-admin-dashboard"
    }
  });
}

function readDataList(result, key) {
  if (!isSuccess(result)) {
    return [];
  }

  if (Array.isArray(result.emitted.data)) {
    return result.emitted.data;
  }

  if (result.emitted.data && Array.isArray(result.emitted.data[key])) {
    return result.emitted.data[key];
  }

  return [];
}

function readRefreshMessage(results) {
  var messages = [];
  var index = 0;

  while (index < results.length) {
    addResultMessages(messages, results[index]);
    index = index + 1;
  }

  if (messages.length === 0) {
    return "";
  }

  return messages.join(" ");
}

function addResultMessages(messages, result) {
  var index = 0;
  var errors = [];
  var warnings = [];

  if (!result || !result.emitted) {
    return;
  }

  if (Array.isArray(result.emitted.errors)) {
    errors = result.emitted.errors;
  }

  while (index < errors.length) {
    messages.push(errors[index].message || errors[index].code || "An admin request failed.");
    index = index + 1;
  }

  index = 0;
  if (Array.isArray(result.emitted.warnings)) {
    warnings = result.emitted.warnings;
  }

  while (index < warnings.length) {
    messages.push(warnings[index].message || warnings[index].code || "Some admin data could not be loaded.");
    index = index + 1;
  }
}

function isSuccess(result) {
  return result && result.emitted && result.emitted.success;
}

function readIntentError(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    return result.emitted.errors[0].message || result.emitted.errors[0].code || "Unknown error";
  }

  return "Unknown admin error";
}

function setState(changes) {
  state = Object.assign({}, state, changes);
  render();
}

function createLocationForm() {
  return getDefaultLocation();
}

function createUserForm() {
  return {
    userId: "",
    displayName: "",
    email: "",
    phone: "",
    photoUrl: "",
    roles: ["teacher"],
    locationIds: [],
    primaryLocationId: "",
    status: "active",
    childStudentIdsText: "",
    classIdsText: ""
  };
}

function createClassForm() {
  return { name: "", locationId: "", status: "active", isVisible: true, photoDataUrl: "" };
}

function createStudentForm() {
  return { name: "", photoUrl: "", classId: "", locationId: "", status: "active", email: "", username: "", fruitPassword: [] };
}

function createAssignmentForm() {
  return { courseId: "", targetType: "location", targetId: "", status: "active" };
}

function normalizeLocationForm(location) {
  var safeLocation = getSafeLocation(location || {});
  var normalizedSlug = normalizeLoginSlug(safeLocation.loginSlug);
  var status = normalizeLocationStatus(safeLocation);

  return {
    locationId: safeLocation.id || safeLocation.locationId || "",
    name: safeLocation.name,
    type: safeLocation.type,
    status: status,
    isArchived: status === "archived",
    description: safeLocation.description,
    schoolCode: safeLocation.schoolCode,
    photoUrl: safeLocation.photoUrl,
    imageUrl: safeLocation.photoUrl,
    address: safeLocation.address,
    city: safeLocation.city,
    region: safeLocation.region,
    country: safeLocation.country,
    twoGisUrl: safeLocation.twoGisUrl,
    latitude: parseOptionalNumber(safeLocation.latitude),
    longitude: parseOptionalNumber(safeLocation.longitude),
    contact: safeLocation.contact,
    email: safeLocation.email,
    website: safeLocation.website,
    hours: safeLocation.hours,
    socialLinks: {
      instagram: safeLocation.socialLinks.instagram,
      facebook: safeLocation.socialLinks.facebook,
      telegram: safeLocation.socialLinks.telegram,
      whatsapp: safeLocation.socialLinks.whatsapp,
      youtube: safeLocation.socialLinks.youtube
    },
    loginMode: safeLocation.loginMode,
    loginSlug: normalizedSlug,
    loginPath: normalizedSlug ? "/l/" + normalizedSlug : "",
    allowStudentLogin: safeLocation.allowStudentLogin,
    languages: splitCommaList(safeLocation.languagesText || safeLocation.languages),
    intentionStoreEnabled: safeLocation.intentionStoreEnabled,
    parentPortalEnabled: safeLocation.parentPortalEnabled,
    courseEditorEnabled: safeLocation.courseEditorEnabled,
    gamificationEnabled: safeLocation.gamificationEnabled,
    adminUids: splitCommaList(safeLocation.adminUidsText || safeLocation.adminUids),
    subscription: {
      plan: safeLocation.subscription.plan,
      maxStudents: parseOptionalNumber(safeLocation.subscription.maxStudents),
      expiresAt: safeLocation.subscription.expiresAt || null
    }
  };
}

function buildLoginLink(loginSlug) {
  return window.location.origin + "/l/" + normalizeLoginSlug(loginSlug);
}

function normalizeLoginSlug(value) {
  var text = readSafeString(value).trim().toLowerCase();

  text = text.replace(/[^a-z0-9]+/g, "-");
  text = text.replace(/^-+/, "");
  text = text.replace(/-+$/, "");

  return text;
}

function readSafeString(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function createOverviewData() {
  return {
    users: [],
    modules: [],
    auditLogs: [],
    activityLogs: [],
    collectionStatus: {},
    lastRefreshAt: null,
    storageAvailable: false
  };
}

function readOverviewIssues() {
  var activeLocations = filterActiveLocations();
  var classStudentCounts = countStudentsByClass();
  var locationClassCounts = countClassesByLocation();
  var draftCourses = countDraftItems(state.courses);
  var draftModules = countDraftItems(state.overviewData.modules);

  return {
    locationsMissingSlugs: countItems(activeLocations, function (location) { return !normalizeLoginSlug(location.loginSlug); }),
    studentsMissingPhotos: countItems(state.students, function (student) { return !student.photoUrl; }),
    studentsMissingCredentials: countItems(state.students, studentMissingCredentials),
    classesMissingTeachers: countItems(state.classes, classMissingTeacher),
    classesWithNoStudents: countItems(state.classes, function (classRecord) { return !classStudentCounts[classRecord.id]; }),
    locationsWithNoClasses: countItems(activeLocations, function (location) { return !locationClassCounts[location.id]; }),
    draftLearningItems: draftCourses + draftModules,
    archivedLocations: countItems(state.locations, function (location) { return getSafeLocation(location).status === "archived"; })
  };
}

function readLoginHealthStats() {
  return {
    totalLocations: state.locations.length,
    locationsWithSlugs: countItems(state.locations, function (location) { return !!normalizeLoginSlug(location.loginSlug); }),
    classesAvailable: countItems(state.classes, function (classRecord) { return (classRecord.status || "active") === "active"; }),
    studentsAssignedToClasses: countItems(state.students, studentAssignedToClass),
    studentsMissingCredentials: countItems(state.students, studentMissingCredentials),
    studentsMissingPhotos: countItems(state.students, function (student) { return !student.photoUrl; })
  };
}

function buildMiniMetric(value, label) {
  return '<div class="sa-mini-metric"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></div>';
}

function buildCompletionChecklist() {
  var activeLocations = filterActiveLocations();
  var issues = readOverviewIssues();
  var loginHealth = readLoginHealthStats();
  var coursesAvailable = state.courses.length > 0 || (state.overviewData.collectionStatus.modules && state.overviewData.collectionStatus.modules.available === false);

  return [
    { label: "At least one active location exists", status: activeLocations.length > 0 ? "complete" : "incomplete" },
    { label: "Every active location has a login slug", status: activeLocations.length > 0 && issues.locationsMissingSlugs === 0 ? "complete" : "warning" },
    { label: "At least one class exists", status: state.classes.length > 0 ? "complete" : "incomplete" },
    { label: "Every class is assigned to a location", status: state.classes.length > 0 && countItems(state.classes, function (classRecord) { return !classRecord.locationId; }) === 0 ? "complete" : "warning" },
    { label: "At least one student exists", status: state.students.length > 0 ? "complete" : "incomplete" },
    { label: "Students are assigned to classes", status: state.students.length > 0 && loginHealth.studentsAssignedToClasses === state.students.length ? "complete" : "warning" },
    { label: "Students have profile photos", status: state.students.length > 0 && issues.studentsMissingPhotos === 0 ? "complete" : "warning" },
    { label: "Login tools are configured", status: issues.locationsMissingSlugs === 0 && issues.studentsMissingCredentials === 0 ? "complete" : "warning" },
    { label: "Courses exist when course collections are available", status: coursesAvailable ? "complete" : "warning" },
    { label: "No critical missing data remains", status: issues.studentsMissingCredentials === 0 && issues.locationsWithNoClasses === 0 ? "complete" : "warning" }
  ];
}

function buildGrowthChart(range) {
  var buckets = makeDateBuckets(range);
  var series = [
    { label: "Locations", color: "#1d4ed8", values: countGrowthByBucket(state.locations, buckets) },
    { label: "Classes", color: "#059669", values: countGrowthByBucket(state.classes, buckets) },
    { label: "Students", color: "#dc2626", values: countGrowthByBucket(state.students, buckets) },
    { label: "Courses", color: "#7c3aed", values: countGrowthByBucket(state.courses, buckets) }
  ];
  var maxValue = 0;
  var hasValues = false;
  var index = 0;

  while (index < series.length) {
    var valueIndex = 0;
    while (valueIndex < series[index].values.length) {
      if (series[index].values[valueIndex] > maxValue) {
        maxValue = series[index].values[valueIndex];
      }
      if (series[index].values[valueIndex] > 0) {
        hasValues = true;
      }
      valueIndex = valueIndex + 1;
    }
    index = index + 1;
  }

  if (!hasValues) {
    return { isEmpty: true, series: series, svg: "" };
  }

  if (maxValue < 1) {
    maxValue = 1;
  }

  return {
    isEmpty: false,
    series: series,
    svg: buildGrowthSvg(series, buckets, maxValue)
  };
}

function buildGrowthSvg(series, buckets, maxValue) {
  var width = 920;
  var height = 280;
  var left = 48;
  var right = 22;
  var top = 22;
  var bottom = 44;
  var plotWidth = width - left - right;
  var plotHeight = height - top - bottom;
  var html = '<svg class="sa-growth-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Growth over time">';
  var gridIndex = 0;
  var seriesIndex = 0;

  while (gridIndex <= 4) {
    var y = top + (plotHeight / 4) * gridIndex;
    var labelValue = Math.round(maxValue - (maxValue / 4) * gridIndex);
    html += '<line x1="' + left + '" y1="' + y + '" x2="' + (width - right) + '" y2="' + y + '"></line><text x="10" y="' + (y + 4) + '">' + labelValue + '</text>';
    gridIndex = gridIndex + 1;
  }

  while (seriesIndex < series.length) {
    html += '<polyline points="' + escapeHtml(buildPolylinePoints(series[seriesIndex].values, buckets.length, left, top, plotWidth, plotHeight, maxValue)) + '" style="stroke:' + escapeHtml(series[seriesIndex].color) + '"></polyline>';
    seriesIndex = seriesIndex + 1;
  }

  var labelIndexes = [0, Math.floor((buckets.length - 1) / 2), buckets.length - 1];
  var index = 0;
  while (index < labelIndexes.length) {
    var bucketIndex = labelIndexes[index];
    var x = left + (buckets.length === 1 ? 0 : (plotWidth / (buckets.length - 1)) * bucketIndex);
    html += '<text class="sa-chart-label" x="' + x + '" y="' + (height - 12) + '">' + escapeHtml(buckets[bucketIndex].label) + '</text>';
    index = index + 1;
  }

  html += '</svg>';
  return html;
}

function buildPolylinePoints(values, bucketCount, left, top, plotWidth, plotHeight, maxValue) {
  var points = [];
  var index = 0;

  while (index < values.length) {
    var x = left + (bucketCount === 1 ? 0 : (plotWidth / (bucketCount - 1)) * index);
    var y = top + plotHeight - ((values[index] / maxValue) * plotHeight);
    points.push(Math.round(x) + "," + Math.round(y));
    index = index + 1;
  }

  return points.join(" ");
}

function makeDateBuckets(range) {
  var now = new Date();
  var buckets = [];
  var index = 0;

  if (range === "week") {
    while (index < 7) {
      buckets.push(makeDayBucket(addDays(now, index - 6)));
      index = index + 1;
    }
    return buckets;
  }

  if (range === "year") {
    while (index < 12) {
      buckets.push(makeMonthBucket(addMonths(now, index - 11)));
      index = index + 1;
    }
    return buckets;
  }

  while (index < 30) {
    buckets.push(makeDayBucket(addDays(now, index - 29)));
    index = index + 1;
  }

  return buckets;
}

function countGrowthByBucket(items, buckets) {
  var result = [];
  var bucketIndex = 0;

  while (bucketIndex < buckets.length) {
    var count = 0;
    var itemIndex = 0;

    while (itemIndex < items.length) {
      var createdAt = getCreatedAtMillis(items[itemIndex]);
      if (!createdAt || createdAt <= buckets[bucketIndex].end) {
        count = count + 1;
      }
      itemIndex = itemIndex + 1;
    }

    result.push(count);
    bucketIndex = bucketIndex + 1;
  }

  return result;
}

function buildRecentActivityItems() {
  var externalLogs = state.overviewData.activityLogs.concat(state.overviewData.auditLogs);

  if (externalLogs.length > 0) {
    return externalLogs.map(function (item) {
      return {
        type: item.type || item.action || "Activity",
        title: item.title || item.message || item.id,
        time: normalizeTimestamp(item.createdAt || item.updatedAt || item.timestamp)
      };
    }).filter(function (item) {
      return !!item.time;
    }).sort(compareByTimeDesc);
  }

  return collectActivityFromItems().sort(compareByTimeDesc).slice(0, 10);
}

function buildRecentlyCreatedItems() {
  return collectCreatedItems().sort(compareByTimeDesc).slice(0, 10);
}

function collectActivityFromItems() {
  return collectRecordsForActivity("Location", state.locations, "overview-open-location")
    .concat(collectRecordsForActivity("Class", state.classes, "overview-open-class"))
    .concat(collectRecordsForActivity("Student", state.students, "overview-open-student"))
    .concat(collectRecordsForActivity("Course", state.courses, "overview-open-course"));
}

function collectCreatedItems() {
  return collectRecordsForActivity("Location", state.locations, "overview-open-location", true)
    .concat(collectRecordsForActivity("Class", state.classes, "overview-open-class", true))
    .concat(collectRecordsForActivity("Student", state.students, "overview-open-student", true))
    .concat(collectRecordsForActivity("Course", state.courses, "overview-open-course", true));
}

function collectRecordsForActivity(type, items, action, createdOnly) {
  var result = [];
  var index = 0;

  while (index < items.length) {
    var time = createdOnly ? getCreatedAtMillis(items[index]) : (normalizeTimestamp(items[index].updatedAt) || getCreatedAtMillis(items[index]));
    if (time) {
      result.push({
        id: items[index].id,
        type: type,
        title: readRecordTitle(items[index]),
        time: time,
        action: action
      });
    }
    index = index + 1;
  }

  return result;
}

function buildSearchResults(queryText) {
  var query = queryText.trim().toLowerCase();

  return {
    locations: searchRecords(state.locations, query, "overview-open-location", function (location) { return [location.name, location.city, location.region, location.loginSlug].join(" "); }, function (location) { return [location.city, location.region].filter(Boolean).join(", ") || location.loginSlug || "Location"; }),
    classes: searchRecords(state.classes, query, "overview-open-class", function (classRecord) { return classRecord.name || ""; }, function (classRecord) { return readLocationName(classRecord.locationId); }),
    students: searchRecords(state.students, query, "overview-open-student", function (student) { return [student.name, student.displayName, student.email, student.username].join(" "); }, function (student) { return readClassName(student.classId); }),
    users: searchRecords(state.users, query, "overview-open-users", function (user) { return [user.name, user.displayName, user.email, user.phone, normalizeRoles(user.roles, user.role).join(" ")].join(" "); }, function (user) { return normalizeRoles(user.roles, user.role).map(readRoleLabel).join(", ") || "User"; }),
    courses: searchRecords(state.courses, query, "overview-open-course", function (course) { return [readCourseTitle(course), course.id, course.status].join(" "); }, function (course) { return course.status || "Course"; })
  };
}

function searchRecords(items, query, action, makeText, makeDetail) {
  var result = [];
  var index = 0;

  if (!query) {
    return result;
  }

  while (index < items.length) {
    if (makeText(items[index]).toLowerCase().indexOf(query) !== -1) {
      result.push({
        id: items[index].id,
        title: readRecordTitle(items[index]),
        detail: makeDetail(items[index]),
        action: action
      });
    }
    index = index + 1;
  }

  return result;
}

function readRecordTitle(record) {
  return record.name || record.displayName || readCourseTitle(record) || record.title || record.id || "Untitled";
}

function countItems(items, predicate) {
  var count = 0;
  var index = 0;

  while (index < items.length) {
    if (predicate(items[index])) {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}

function countDraftItems(items) {
  return countItems(items, function (item) {
    return item.status === "draft" || item.lifecycleStatus === "draft" || item.isDraft === true || item.published === false;
  });
}

function filterActiveLocations() {
  return state.locations.map(getSafeLocation).filter(function (location) {
    return location.status !== "archived";
  });
}

function studentMissingCredentials(student) {
  return student.fruitPasswordSet !== true && !student.fruitPasswordHash && !student.username && !student.email;
}

function studentAssignedToClass(student) {
  return !!student.classId || (Array.isArray(student.classIds) && student.classIds.length > 0);
}

function classMissingTeacher(classRecord) {
  return !classRecord.teacherId && !classRecord.teacherUid && !classRecord.primaryTeacherId && (!Array.isArray(classRecord.teacherIds) || classRecord.teacherIds.length === 0);
}

function countStudentsByClass() {
  var counts = {};
  var index = 0;

  while (index < state.students.length) {
    addCount(counts, state.students[index].classId);
    if (Array.isArray(state.students[index].classIds)) {
      var classIndex = 0;
      while (classIndex < state.students[index].classIds.length) {
        addCount(counts, state.students[index].classIds[classIndex]);
        classIndex = classIndex + 1;
      }
    }
    index = index + 1;
  }

  return counts;
}

function countClassesByLocation() {
  var counts = {};
  var index = 0;

  while (index < state.classes.length) {
    addCount(counts, state.classes[index].locationId);
    index = index + 1;
  }

  return counts;
}

function addCount(counts, id) {
  if (!id) {
    return;
  }

  counts[id] = (counts[id] || 0) + 1;
}

function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.seconds === "number") {
    return value.seconds * 1000;
  }

  if (typeof value._seconds === "number") {
    return value._seconds * 1000;
  }

  if (typeof value === "string") {
    var parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getCreatedAtMillis(item) {
  return normalizeTimestamp(item.createdAt);
}

function makeDayBucket(date) {
  var start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  var end = start + (24 * 60 * 60 * 1000) - 1;

  return {
    start: start,
    end: end,
    label: new Date(start).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  };
}

function makeMonthBucket(date) {
  var start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  var end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

  return {
    start: start,
    end: end,
    label: new Date(start).toLocaleDateString(undefined, { month: "short" })
  };
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function compareByTimeDesc(a, b) {
  return (b.time || 0) - (a.time || 0);
}

function formatDateTime(value) {
  var millis = normalizeTimestamp(value);

  if (!millis) {
    return "Not loaded yet";
  }

  return new Date(millis).toLocaleString();
}

function selectedClass(value, expectedValue) {
  return value === expectedValue ? "is-active" : "";
}

function getDefaultLocation() {
  return {
    id: "",
    locationId: "",
    name: "",
    type: "Private location",
    status: "active",
    isArchived: false,
    description: "",
    schoolCode: "",
    photoUrl: "",
    imageUrl: "",
    address: "",
    city: "",
    region: "",
    country: "Kyrgyzstan",
    twoGisUrl: "",
    latitude: null,
    longitude: null,
    contact: "",
    email: "",
    website: "",
    hours: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      telegram: "",
      whatsapp: "",
      youtube: ""
    },
    loginMode: "fruit",
    loginSlug: "",
    allowStudentLogin: true,
    languages: ["en", "ru"],
    languagesText: "en, ru",
    intentionStoreEnabled: true,
    parentPortalEnabled: false,
    courseEditorEnabled: true,
    gamificationEnabled: true,
    adminUids: [],
    adminUidsText: "",
    subscription: {
      plan: "pilot",
      maxStudents: null,
      expiresAt: null
    }
  };
}

function getSafeLocation(location) {
  var defaults = getDefaultLocation();
  var socialLinks = Object.assign({}, defaults.socialLinks, location && location.socialLinks ? location.socialLinks : {});
  var subscription = Object.assign({}, defaults.subscription, location && location.subscription ? location.subscription : {});
  var safeLocation = Object.assign({}, defaults, location || {});

  safeLocation.status = normalizeLocationStatus(safeLocation);
  safeLocation.isArchived = safeLocation.status === "archived";
  safeLocation.photoUrl = readSafeString(safeLocation.photoUrl || safeLocation.imageUrl);
  safeLocation.imageUrl = safeLocation.photoUrl;
  safeLocation.socialLinks = {
    instagram: readSafeString(socialLinks.instagram),
    facebook: readSafeString(socialLinks.facebook),
    telegram: readSafeString(socialLinks.telegram),
    whatsapp: readSafeString(socialLinks.whatsapp),
    youtube: readSafeString(socialLinks.youtube)
  };
  safeLocation.subscription = {
    plan: readSafeString(subscription.plan || "pilot"),
    maxStudents: subscription.maxStudents === undefined ? null : subscription.maxStudents,
    expiresAt: subscription.expiresAt || null
  };
  safeLocation.languages = Array.isArray(safeLocation.languages) ? safeLocation.languages : splitCommaList(safeLocation.languages);
  safeLocation.languagesText = safeLocation.languages.join(", ");
  safeLocation.adminUids = Array.isArray(safeLocation.adminUids) ? safeLocation.adminUids : splitCommaList(safeLocation.adminUids);
  safeLocation.adminUidsText = safeLocation.adminUids.join(", ");
  safeLocation.allowStudentLogin = safeLocation.allowStudentLogin === false ? false : true;
  safeLocation.intentionStoreEnabled = safeLocation.intentionStoreEnabled === false ? false : true;
  safeLocation.parentPortalEnabled = safeLocation.parentPortalEnabled === true ? true : false;
  safeLocation.courseEditorEnabled = safeLocation.courseEditorEnabled === false ? false : true;
  safeLocation.gamificationEnabled = safeLocation.gamificationEnabled === false ? false : true;

  return safeLocation;
}

function normalizeLocationStatus(location) {
  if (location && location.status === "inactive") {
    return "inactive";
  }

  if (location && (location.status === "archived" || location.isArchived === true)) {
    return "archived";
  }

  return "active";
}

function setLocationFormValue(location, field, value) {
  var parts = field.split(".");

  if (field === "languagesText" || field === "adminUidsText") {
    location[field] = value;
    return;
  }

  if (parts.length === 2) {
    if (!location[parts[0]]) {
      location[parts[0]] = {};
    }

    location[parts[0]][parts[1]] = value;
    return;
  }

  location[field] = value;

  if (field === "status") {
    location.isArchived = value === "archived";
  }
}

function setUserFormValue(user, field, value) {
  if (field === "roles") {
    user.roles = normalizeRoles(value, user.role);
    user.role = readPrimaryRole(user.roles);
    return;
  }

  if (field === "locationIds") {
    user.locationIds = normalizeIdList(value);
    return;
  }

  user[field] = value;
}

function splitCommaList(value) {
  var result = [];
  var source = value;
  var index = 0;

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return result;
  }

  while (index < source.length) {
    var item = readSafeString(source[index]).trim();

    if (item && result.indexOf(item) === -1) {
      result.push(item);
    }

    index = index + 1;
  }

  return result;
}

function normalizeIdList(value) {
  return splitCommaList(value);
}

function readSelectedValues(selectElement) {
  var values = [];
  var index = 0;

  while (index < selectElement.options.length) {
    if (selectElement.options[index].selected) {
      values.push(selectElement.options[index].value);
    }
    index = index + 1;
  }

  return values;
}

function parseOptionalNumber(value) {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  var numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return numberValue;
}

function stringifyOptionalNumber(value) {
  if (value === "" || value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function validateLocationForm(location) {
  if (!location.name || !location.name.trim()) {
    return "Location name is required.";
  }

  if (location.loginSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(location.loginSlug)) {
    return "loginSlug must use lowercase letters, numbers, and hyphens only.";
  }

  if (!isValidOptionalUrl(location.photoUrl)) {
    return "Photo URL must be a valid http or https URL.";
  }

  if (!isValidOptionalUrl(location.website)) {
    return "Website must be a valid http or https URL.";
  }

  if (!isValidOptionalUrl(location.twoGisUrl)) {
    return "2GIS URL must be a valid http or https URL.";
  }

  if (location.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(location.email)) {
    return "Email must look like a valid email address.";
  }

  if (!areValidSocialLinks(location.socialLinks)) {
    return "Social links must be valid http or https URLs.";
  }

  return "";
}

function validateUserProfile(user, mode) {
  if (mode === "create" && user.userId && !/^[A-Za-z0-9_-]+$/.test(user.userId)) {
    return "UID / Profile ID can only use letters, numbers, underscores, and hyphens.";
  }

  if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    return "Email must look like a valid email address.";
  }

  if (!isValidOptionalUrl(user.photoUrl)) {
    return "Photo URL must be a valid http or https URL.";
  }

  if (user.roles.length === 0 && user.status !== "inactive" && user.status !== "archived") {
    return "Active or suspended users must have at least one role.";
  }

  if (user.primaryLocationId && user.locationIds.indexOf(user.primaryLocationId) === -1) {
    return "Primary location must also be included in the user location scope.";
  }

  return "";
}

function areValidSocialLinks(socialLinks) {
  var keys = ["instagram", "facebook", "telegram", "whatsapp", "youtube"];
  var index = 0;

  while (index < keys.length) {
    if (!isValidOptionalUrl(socialLinks[keys[index]])) {
      return false;
    }

    index = index + 1;
  }

  return true;
}

function isValidOptionalUrl(value) {
  var text = readSafeString(value).trim();

  if (!text) {
    return true;
  }

  try {
    var parsedUrl = new URL(text);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function hasDuplicateLocationSlug(loginSlug, locationId) {
  var normalizedSlug = normalizeLoginSlug(loginSlug);
  var index = 0;

  if (!normalizedSlug) {
    return false;
  }

  while (index < state.locations.length) {
    var location = getSafeLocation(state.locations[index]);

    if (location.id !== locationId && location.status !== "archived" && normalizeLoginSlug(location.loginSlug) === normalizedSlug) {
      return true;
    }

    index = index + 1;
  }

  return false;
}

function updateLocationSlugPreview(formId, value) {
  var preview = appElement ? appElement.querySelector('[data-login-preview-for="' + cssEscape(formId) + '"]') : null;
  var normalizedSlug = normalizeLoginSlug(value);

  if (!preview) {
    return;
  }

  preview.innerHTML = normalizedSlug
    ? '<strong>Login Link</strong><span>' + escapeHtml(buildLoginLink(normalizedSlug)) + '</span><button type="button" class="sa-btn sa-btn-secondary" data-action="copy-login-link" data-id="' + escapeHtml(normalizedSlug) + '">Copy Link</button>'
    : '<strong>Login Link</strong><span>Add a slug to create a shareable location login link.</span>';
}

function cssEscape(value) {
  if (window.CSS && window.CSS.escape) {
    return window.CSS.escape(value);
  }

  return readSafeString(value).replace(/"/g, '\\"');
}

function readInitials(value) {
  var words = readSafeString(value).trim().split(/\s+/);
  var initials = "";
  var index = 0;

  while (index < words.length && initials.length < 2) {
    if (words[index]) {
      initials += words[index].charAt(0).toUpperCase();
    }

    index = index + 1;
  }

  return initials || "OQ";
}

function readLocationStats() {
  var stats = {
    total: state.locations.length,
    active: 0,
    archived: 0,
    missingSlugs: 0
  };
  var index = 0;

  while (index < state.locations.length) {
    var location = getSafeLocation(state.locations[index]);

    if (location.status === "archived") {
      stats.archived = stats.archived + 1;
    } else if (location.status === "active") {
      stats.active = stats.active + 1;
    }

    if (!normalizeLoginSlug(location.loginSlug)) {
      stats.missingSlugs = stats.missingSlugs + 1;
    }

    index = index + 1;
  }

  return stats;
}

function readUserStats() {
  var stats = {
    totalUsers: state.users.length,
    activeUsers: 0,
    multiRoleUsers: 0,
    missingLocationUsers: 0,
    suspendedUsers: 0
  };
  var index = 0;

  while (index < state.users.length) {
    var user = getSafeUser(state.users[index]);

    if (user.status === "active") {
      stats.activeUsers = stats.activeUsers + 1;
    }

    if (user.roles.length > 1) {
      stats.multiRoleUsers = stats.multiRoleUsers + 1;
    }

    if (user.locationIds.length === 0 && user.roles.indexOf("superAdmin") === -1 && user.roles.indexOf("platformAdmin") === -1) {
      stats.missingLocationUsers = stats.missingLocationUsers + 1;
    }

    if (user.status === "suspended") {
      stats.suspendedUsers = stats.suspendedUsers + 1;
    }

    index = index + 1;
  }

  return stats;
}

function readFilteredUsers() {
  var users = [];
  var query = state.userFilters.searchText.trim().toLowerCase();
  var index = 0;

  while (index < state.users.length) {
    var user = getSafeUser(state.users[index]);
    var searchable = [user.displayName, user.email, user.phone, user.id].join(" ").toLowerCase();
    var matchesSearch = !query || searchable.indexOf(query) !== -1;
    var matchesRole = !state.userFilters.role || user.roles.indexOf(state.userFilters.role) !== -1;
    var matchesLocation = !state.userFilters.locationId || user.locationIds.indexOf(state.userFilters.locationId) !== -1 || user.primaryLocationId === state.userFilters.locationId;
    var matchesStatus = !state.userFilters.status || user.status === state.userFilters.status;

    if (matchesSearch && matchesRole && matchesLocation && matchesStatus) {
      users.push(user);
    }

    index = index + 1;
  }

  return users.sort(function (a, b) {
    return (a.displayName || a.email || a.id).localeCompare(b.displayName || b.email || b.id);
  });
}

function isBusy() {
  return state.isSaving || state.isRefreshing;
}

function buildButtonContent(label, actionKey) {
  if (state.pendingAction === actionKey) {
    return '<span class="sa-btn-spinner"></span>' + escapeHtml(readPendingLabel(label));
  }

  return escapeHtml(label);
}

function readPendingLabel(label) {
  if (label.indexOf("Archive") !== -1) {
    return "Archiving...";
  }

  if (label.indexOf("Restore") !== -1) {
    return "Restoring...";
  }

  if (label.indexOf("Create") !== -1) {
    return "Creating...";
  }

  if (label.indexOf("Refresh") !== -1) {
    return "Loading...";
  }

  return "Saving...";
}

function normalizeClassForm(classRecord) {
  return {
    classId: classRecord.id,
    name: classRecord.name || "",
    locationId: classRecord.locationId || "",
    status: classRecord.status || "active",
    isVisible: classRecord.isVisible === false ? false : true,
    photoDataUrl: classRecord.photoDataUrl || ""
  };
}

function getSafeUser(user) {
  var safeUser = user || {};
  var roles = normalizeRoles(safeUser.roles, safeUser.role);
  var locationIds = normalizeIdList(safeUser.locationIds || safeUser.locations || safeUser.locationId);
  var primaryLocationId = readSafeString(safeUser.primaryLocationId || safeUser.locationId);

  if (primaryLocationId && locationIds.indexOf(primaryLocationId) === -1) {
    locationIds.push(primaryLocationId);
  }

  return Object.assign({}, safeUser, {
    id: readSafeString(safeUser.id || safeUser.uid || safeUser.userId),
    userId: readSafeString(safeUser.userId || safeUser.uid || safeUser.id),
    displayName: readSafeString(safeUser.displayName || safeUser.name),
    email: readSafeString(safeUser.email),
    phone: readSafeString(safeUser.phone),
    photoUrl: readSafeString(safeUser.photoUrl || safeUser.imageUrl),
    roles: roles,
    role: readPrimaryRole(roles),
    locationIds: locationIds,
    primaryLocationId: primaryLocationId,
    status: readSafeString(safeUser.status || "active"),
    childStudentIds: normalizeIdList(safeUser.childStudentIds),
    classIds: normalizeIdList(safeUser.classIds)
  });
}

function normalizeUserForm(user) {
  var safeUser = getSafeUser(user || {});

  return {
    userId: safeUser.userId || safeUser.id || "",
    displayName: safeUser.displayName,
    email: safeUser.email,
    phone: safeUser.phone,
    photoUrl: safeUser.photoUrl,
    roles: safeUser.roles.slice(),
    locationIds: safeUser.locationIds.slice(),
    primaryLocationId: safeUser.primaryLocationId,
    status: safeUser.status,
    childStudentIdsText: safeUser.childStudentIdsText || safeUser.childStudentIds.join(", "),
    classIdsText: safeUser.classIdsText || safeUser.classIds.join(", ")
  };
}

function normalizeUserProfilePayload(form, userId) {
  var safeForm = normalizeUserForm(Object.assign({}, form, { id: userId || form.userId || form.id }));
  var locationIds = normalizeIdList(safeForm.locationIds);

  if (safeForm.primaryLocationId && locationIds.indexOf(safeForm.primaryLocationId) === -1) {
    locationIds.push(safeForm.primaryLocationId);
  }

  return {
    userId: readSafeString(safeForm.userId || userId),
    displayName: readSafeString(safeForm.displayName).trim(),
    email: readSafeString(safeForm.email).trim(),
    phone: readSafeString(safeForm.phone).trim(),
    photoUrl: readSafeString(safeForm.photoUrl).trim(),
    roles: normalizeRoles(safeForm.roles, safeForm.role),
    locationIds: locationIds,
    primaryLocationId: readSafeString(safeForm.primaryLocationId).trim(),
    status: readSafeString(safeForm.status || "active"),
    childStudentIds: splitCommaList(safeForm.childStudentIdsText),
    classIds: splitCommaList(safeForm.classIdsText)
  };
}

function buildUserProfileRecord(payload, isCreate) {
  var record = {
    displayName: payload.displayName,
    email: payload.email,
    phone: payload.phone,
    photoUrl: payload.photoUrl,
    roles: payload.roles,
    role: readLegacyRole(payload.roles),
    locationIds: payload.locationIds,
    primaryLocationId: payload.primaryLocationId,
    status: payload.status,
    childStudentIds: payload.childStudentIds,
    classIds: payload.classIds,
    updatedAt: serverTimestamp()
  };

  if (isCreate) {
    record.createdAt = serverTimestamp();
  }

  return record;
}

function normalizeStudentForm(student) {
  return {
    studentId: student.id,
    name: student.name || student.displayName || "",
    photoUrl: student.photoUrl || "",
    classId: student.classId || "",
    locationId: student.locationId || "",
    status: student.status || "active",
    email: student.email || "",
    username: student.username || "",
    fruitPassword: []
  };
}

function findLocation(id) {
  return findById(state.locations, id) || normalizeLocationForm({ id: id });
}

function findClass(id) {
  return findById(state.classes, id) || normalizeClassForm({ id: id });
}

function findStudent(id) {
  return findById(state.students, id);
}

function findUser(id) {
  return findById(state.users, id);
}

function findCourse(id) {
  return findById(state.courses, id);
}

function findById(items, id) {
  var index = 0;

  while (index < items.length) {
    if (items[index].id === id) {
      return items[index];
    }

    index = index + 1;
  }

  return null;
}

function readLocationName(id) {
  var location = findLocation(id);
  return location && location.name ? location.name : id;
}

function readClassName(id) {
  var classRecord = findClass(id);
  return classRecord && classRecord.name ? classRecord.name : id;
}

function readCourseName(id) {
  var course = findCourse(id);
  return course ? readCourseTitle(course) : id;
}

function readUserLocationSummary(user) {
  var safeUser = getSafeUser(user);

  if (safeUser.locationIds.length === 0) {
    return "No location scope";
  }

  return safeUser.locationIds.map(readLocationName).join(", ");
}

function readLinkedUserLabel(student) {
  var linkedUserId = student && (student.userId || student.uid);
  var linkedUser = linkedUserId ? findUser(linkedUserId) : null;

  if (!linkedUserId) {
    return "No linked user yet.";
  }

  if (!linkedUser) {
    return linkedUserId;
  }

  return (linkedUser.displayName || linkedUser.email || linkedUser.id) + " (" + linkedUser.id + ")";
}

function readCourseTitle(course) {
  if (!course) {
    return "";
  }

  if (typeof course.title === "string" && course.title) {
    return course.title;
  }

  if (course.title && typeof course.title.en === "string" && course.title.en) {
    return course.title.en;
  }

  return course.id || "Untitled course";
}

function readAssignmentTargetName(assignment) {
  if (!assignment) {
    return "";
  }

  if (assignment.targetType === "location") {
    return readLocationName(assignment.targetId);
  }

  if (assignment.targetType === "class") {
    return readClassName(assignment.targetId);
  }

  if (assignment.targetType === "student") {
    var student = findStudent(assignment.targetId);
    return student && student.name ? student.name : assignment.targetId;
  }

  return assignment.targetId || "";
}

function readAdminName() {
  if (state.admin && state.admin.name) {
    return state.admin.name;
  }

  return "Super Admin";
}

function readVisibleTabs() {
  if (isSuperAdminRole(state.actor ? state.actor.role : "")) {
    return tabs;
  }

  return ["overview", "assignments"];
}

function canOpenTab(tab) {
  var visibleTabs = readVisibleTabs();
  return visibleTabs.indexOf(tab) !== -1;
}

function isAdminRole(role) {
  return isSuperAdminRole(role);
}

function isSuperAdminRole(role) {
  var normalizedRole = normalizeAdminRole(role);

  return normalizedRole === "superAdmin"
    || normalizedRole === "platformAdmin";
}

function normalizeAdminRole(role) {
  var normalizedRole = readSafeString(role).replace(/^role/i, "");
  var userRole = normalizeUserRole(normalizedRole);

  if (userRole === "superAdmin") {
    return "superAdmin";
  }

  if (userRole === "platformAdmin") {
    return "platformAdmin";
  }

  return readSafeString(role);
}

function readTabLabel(tab) {
  if (tab === "loginTools") {
    return "Login Tools";
  }

  return tab.charAt(0).toUpperCase() + tab.slice(1);
}

function buildAvatar(record) {
  if (record.photoUrl) {
    return '<img class="sa-avatar" src="' + escapeHtml(record.photoUrl) + '" alt="">';
  }

  return '<div class="sa-avatar sa-avatar-fallback">' + escapeHtml(readInitials(record.displayName || record.name || record.email || record.id)) + '</div>';
}

function buildRoleBadges(roles) {
  var safeRoles = normalizeRoles(roles, "");
  var html = "";
  var index = 0;

  if (safeRoles.length === 0) {
    return '<span class="sa-role-badge sa-role-empty">No roles</span>';
  }

  while (index < safeRoles.length) {
    html += '<span class="sa-role-badge sa-role-' + escapeHtml(safeRoles[index]) + '">' + escapeHtml(readRoleLabel(safeRoles[index])) + '</span>';
    index = index + 1;
  }

  return html;
}

function readRoleLabel(role) {
  var labels = {
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    schoolAdmin: "School Admin",
    regionalAdmin: "Regional Admin",
    ministryUser: "Ministry User",
    platformAdmin: "Platform Admin",
    superAdmin: "Super Admin"
  };

  return labels[role] || role;
}

function normalizeRoles(roles, legacyRole) {
  var source = Array.isArray(roles) ? roles.slice() : [];

  if (source.length === 0 && legacyRole) {
    source.push(legacyRole);
  }

  return source.map(normalizeUserRole).filter(function (role, index, list) {
    return role && userRoles.indexOf(role) !== -1 && list.indexOf(role) === index;
  });
}

function normalizeUserRole(role) {
  var normalizedRole = readSafeString(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "schooladmin") {
    return "schoolAdmin";
  }

  if (normalizedRole === "regionaladmin") {
    return "regionalAdmin";
  }

  if (normalizedRole === "ministryuser" || normalizedRole === "ministry") {
    return "ministryUser";
  }

  if (normalizedRole === "platformadmin") {
    return "platformAdmin";
  }

  if (normalizedRole === "superadmin") {
    return "superAdmin";
  }

  if (normalizedRole === "student" || normalizedRole === "teacher" || normalizedRole === "parent") {
    return normalizedRole;
  }

  return "";
}

function readPrimaryRole(roles) {
  var priority = ["superAdmin", "platformAdmin", "ministryUser", "regionalAdmin", "schoolAdmin", "teacher", "parent", "student"];
  var safeRoles = normalizeRoles(roles, "");
  var index = 0;

  while (index < priority.length) {
    if (safeRoles.indexOf(priority[index]) !== -1) {
      return priority[index];
    }

    index = index + 1;
  }

  return safeRoles[0] || "";
}

function readLegacyRole(roles) {
  var safeRoles = normalizeRoles(roles, "");

  if (safeRoles.indexOf("superAdmin") !== -1) {
    return "superAdmin";
  }

  if (safeRoles.indexOf("platformAdmin") !== -1) {
    return "platformAdmin";
  }

  if (safeRoles.indexOf("student") !== -1) {
    return "student";
  }

  return readPrimaryRole(safeRoles);
}

function readPrimaryAdminRole(roles) {
  var safeRoles = normalizeRoles(roles, "");

  if (safeRoles.indexOf("superAdmin") !== -1) {
    return "superAdmin";
  }

  if (safeRoles.indexOf("platformAdmin") !== -1) {
    return "platformAdmin";
  }

  return readPrimaryRole(safeRoles);
}

function isCurrentUserSelfDemotion(userId, nextRoles) {
  var currentUserId = state.actor ? state.actor.id : "";

  if (!currentUserId || currentUserId !== userId) {
    return false;
  }

  return !isSuperAdminRole(readPrimaryAdminRole(nextRoles));
}

function readFruitLabel(fruit) {
  if (fruit && fruitLabels[fruit]) {
    return fruitLabels[fruit];
  }

  return "";
}

function selected(value, expectedValue) {
  return value === expectedValue ? " selected" : "";
}

function disabled(value) {
  return value ? " disabled" : "";
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

window.goSuperAdmin = function () {
  state.activeTab = "overview";
  render();
};
