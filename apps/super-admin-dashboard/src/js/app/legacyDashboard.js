import { getIdTokenResult, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../../../packages/core/src/infrastructure/firebase/auth.js";
import { storage } from "../../../../../packages/core/src/infrastructure/firebase/storage.js";
import { collection, db, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "../../../../../packages/core/src/infrastructure/firebase/firestore.js";
import { getIntentDefinition } from "../../../../../packages/core/src/icf/engine/intentRegistry.js";
import { runIntentPipeline } from "../../../../../packages/core/src/icf/engine/runIntentPipeline.js";
import { COURSE_CREATOR_URL, roleFilterCards, userRoles, userStatuses } from "../shared/constants.js";

var appElement = document.getElementById("app");
var appVersion = "1.1.18";
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
  staffResetOpen: false,
  staffResetEmail: "",
  staffResetStatus: "",
  staffResetStatusType: "info",
  overviewChartRange: "month",
  overviewRegionFilter: "",
  overviewSchoolTypeFilter: "",
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
  resetFruitPassword: [],
  fruitResetSaveStatus: "",
  fruitResetSaveMessage: "",
  assignmentCoursePicker: {
    isOpen: false,
    searchText: "",
    statusFilter: "",
    isLoading: false
  },
  assignmentTargetPicker: {
    isOpen: false,
    targetType: "class",
    searchText: "",
    locationId: "",
    classId: "",
    includeAllLocations: false,
    isLoading: false
  },
  assignmentDelete: {
    assignmentId: "",
    status: "",
    message: ""
  },
  classPicker: {
    isOpen: false,
    formId: "",
    mode: "primary",
    searchText: "",
    includeAllLocations: false,
    selectedIds: []
  }
};

var tabs = ["overview", "locations", "users", "classes", "lessons", "assignments", "loginTools", "analytics", "reports", "settings", "auditLogs"];
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
  var tokenRole = "";
  var profileRole = "";

  if (tokenResult && tokenResult.claims) {
    tokenRole = readRoleFromTokenClaims(tokenResult.claims);
    role = tokenRole;
  }

  profileResult = await loadRoleFromProfile(user.uid);
  profileRole = normalizeAdminRole(profileResult.role);

  if (!isSuperAdminRole(role)) {
    role = profileRole;
  }

  return {
    id: user.uid,
    email: user.email || "",
    role: role,
    tokenRole: tokenRole,
    profileRole: profileRole,
    profileMissing: profileResult ? profileResult.missing : false
  };
}

function readRoleFromTokenClaims(claims) {
  var role = "";
  var roles = [];

  if (claims && typeof claims.role === "string") {
    role = normalizeAdminRole(claims.role);
  }

  if (claims && Array.isArray(claims.roles)) {
    roles = roles.concat(claims.roles);
  }

  if (claims && Array.isArray(claims.userRoles)) {
    roles = roles.concat(claims.userRoles);
  }

  if (isSuperAdminRole(role)) {
    return role;
  }

  role = readPrimaryAdminRole(roles) || role;

  return normalizeAdminRole(role);
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
    state.admin = normalizeLoadedAdminProfile(result.emitted.data.admin);
    return;
  }

  state.admin = {
    id: state.actor.id,
    email: state.actor.email,
    role: state.actor.role
  };
}

function normalizeLoadedAdminProfile(admin) {
  var safeAdmin = admin || {};
  var normalizedRole = normalizeAdminRole(safeAdmin.role);
  var adminEmail = readSafeString(safeAdmin.email || (state.actor ? state.actor.email : ""));
  var actorEmail = state.actor ? readSafeString(state.actor.email) : "";
  var canUseProfileName = isSuperAdminRole(normalizedRole)
    && (!adminEmail || !actorEmail || adminEmail.toLowerCase() === actorEmail.toLowerCase());

  return {
    id: readSafeString(safeAdmin.id || (state.actor ? state.actor.id : "")),
    email: actorEmail || adminEmail,
    role: state.actor ? state.actor.role : normalizedRole,
    name: canUseProfileName ? readSafeString(safeAdmin.name || safeAdmin.displayName) : ""
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
  var coursesResult = await readCoursesForAdmin();
  var assignmentsResult = await readCourseAssignmentsForAdmin({
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

async function readCoursesForAdmin() {
  var coursesResult = await readOptionalCollection("courses");

  if (coursesResult.items.length > 0 || coursesResult.available === false) {
    return buildOptionalDataResult("courses", coursesResult.items);
  }

  var catalogCoursesResult = await readOptionalCollection("catalogCourses");

  return buildOptionalDataResult("courses", catalogCoursesResult.items);
}

async function readCourseAssignmentsForAdmin(filters) {
  var assignmentsResult = await runAdminIntent("LoadCourseAssignmentsIntent", filters || {});

  if (isSuccess(assignmentsResult)) {
    return assignmentsResult;
  }

  var fallbackResult = await readOptionalCollection("courseAssignments");

  return buildOptionalDataResult("assignments", filterCourseAssignments(fallbackResult.items, filters || {}));
}

function buildOptionalDataResult(key, items) {
  var data = {};
  data[key] = Array.isArray(items) ? items : [];

  return {
    emitted: {
      success: true,
      data: data,
      errors: [],
      warnings: []
    }
  };
}

function filterCourseAssignments(assignments, filters) {
  var safeAssignments = Array.isArray(assignments) ? assignments : [];

  return safeAssignments.filter(function (assignment) {
    return (!filters.courseId || assignment.courseId === filters.courseId)
      && (!filters.targetType || assignment.targetType === filters.targetType)
      && (!filters.status || assignment.status === filters.status);
  }).sort(function (a, b) {
    return readSafeString(a.courseId).localeCompare(readSafeString(b.courseId))
      || readSafeString(a.targetType).localeCompare(readSafeString(b.targetType))
      || readSafeString(a.targetId).localeCompare(readSafeString(b.targetId));
  });
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
    + '<div class="sa-form"><label>Email<input type="email" data-login-field="email" value="' + escapeHtml(state.loginEmail) + '" placeholder="admin@example.com"></label><label><span class="sa-password-label-row"><span>Password</span><button type="button" class="sa-text-link" data-action="open-staff-login-reset">Forgot password?</button></span><input type="password" data-login-field="password" value="' + escapeHtml(state.loginPassword) + '" placeholder="Password"></label><button type="button" class="sa-btn" data-action="admin-login">Log in</button><button type="button" class="sa-btn sa-btn-secondary" data-action="go-admin-login">Go to Login</button></div></section>'
    + buildStaffPasswordResetModal();
}

function buildDashboardView() {
  var html = "";

  html += '<section class="sa-shell">';
  html += '<aside class="sa-sidebar">';
  html += '<div class="sa-brand-block"><div class="sa-brand-mark">OQ</div><div><div class="sa-brand-line"><div class="sa-brand">OquWay</div><span class="sa-version-badge">v' + escapeHtml(appVersion) + '</span></div><p>Learn. Grow. Intentionally.</p></div></div>';
  html += buildTabs();
  html += buildSidebarStatusCard();
  html += '<button type="button" class="sa-side-link sa-danger-link" data-action="sign-out"><span class="sa-nav-icon">↪</span><span>Sign out</span></button>';
  html += '</aside>';
  html += '<main class="sa-main sa-command-main">';
  html += buildTopBar();
  html += buildMessage();
  html += buildActiveTab();
  html += '</main>';
  html += buildResetModal();
  html += buildClassPickerModal();
  html += buildAssignmentCoursePickerModal();
  html += buildAssignmentTargetPickerModal();
  html += buildAssignmentDeleteModal();
  html += '</section>';

  return html;
}

function buildTabs() {
  var html = "";
  var visibleTabs = readVisibleTabs();
  var groups = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: "⌁", tab: "overview" },
        { label: "Schools / Locations", icon: "⌂", tab: "locations" },
        { label: "Users", icon: "◉", tab: "users" }
      ]
    },
    {
      title: "Learning & Engagement",
      items: [
        { label: "Courses & Modules", icon: "▣", tab: "lessons" },
        { label: "Classes", icon: "◫", tab: "classes" },
        { label: "Course Assignments", icon: "☑", tab: "assignments" },
        { label: "Login Tools", icon: "⚿", tab: "loginTools" }
      ]
    },
    {
      title: "Analytics & Reports",
      items: [
        { label: "Analytics", icon: "⌁", tab: "analytics" },
        { label: "Reports", icon: "◫", tab: "reports" }
      ]
    },
    {
      title: "System Management",
      items: [
        { label: "Settings", icon: "⚙", tab: "settings" },
        { label: "Audit Logs", icon: "◷", tab: "auditLogs" }
      ]
    }
  ];
  var groupIndex = 0;

  while (groupIndex < groups.length) {
    html += '<div class="sa-nav-group"><span>' + escapeHtml(groups[groupIndex].title) + '</span>';
    var itemIndex = 0;
    while (itemIndex < groups[groupIndex].items.length) {
      var item = groups[groupIndex].items[itemIndex];
      if (!item.tab || visibleTabs.indexOf(item.tab) !== -1) {
        html += buildSidebarNavItem(item);
      }
      itemIndex = itemIndex + 1;
    }
    html += '</div>';
    groupIndex = groupIndex + 1;
  }
  return html;
}

function buildSidebarNavItem(item) {
  var isActive = item.tab && state.activeTab === item.tab;
  var attributes = item.tab ? ' data-tab="' + escapeHtml(item.tab) + '"' : ' data-action="' + escapeHtml(item.action) + '"';

  if (item.id) {
    attributes += ' data-id="' + escapeHtml(item.id) + '"';
  }

  return '<button type="button" class="sa-side-link' + (isActive ? " sa-side-link-active" : "") + '"' + attributes + '><span class="sa-nav-icon">' + escapeHtml(item.icon) + '</span><span>' + escapeHtml(item.label) + '</span></button>';
}

function buildSidebarStatusCard() {
  var health = readPlatformHealth();
  var goodCount = countItems(health, function (item) { return item.tone === "good"; });
  var tone = goodCount >= 5 ? "good" : (goodCount >= 3 ? "warning" : "danger");

  return '<div class="sa-system-card"><div><span class="sa-status-dot sa-status-dot-' + tone + '"></span><strong>System Status</strong></div><p>' + goodCount + ' of ' + health.length + ' services healthy</p><small>Last sync ' + escapeHtml(formatDateTime(state.overviewData.lastRefreshAt)) + '</small></div>';
}

function buildTopBar() {
  return '<div class="sa-topbar"><div class="sa-title-wrap"><span class="sa-title-badge">♛</span><div><p class="sa-eyebrow">Executive Command Center</p><h1>Super Admin Dashboard</h1><p>Executive overview of the OquWay ecosystem</p></div></div>'
    + '<div class="sa-topbar-actions">'
    + '<label>Date Range<select data-overview-filter="range"><option value="week"' + selected(state.overviewChartRange, "week") + '>7 days</option><option value="month"' + selected(state.overviewChartRange, "month") + '>30 days</option><option value="year"' + selected(state.overviewChartRange, "year") + '>12 months</option></select></label>'
    + '<label>Region' + buildOverviewFilterOptions("region") + '</label>'
    + '<label>School Type' + buildOverviewFilterOptions("type") + '</label>'
    + '<button type="button" class="sa-btn sa-btn-secondary sa-icon-btn" data-action="overview-ai-insights">AI Insights</button>'
    + '<button type="button" class="sa-btn" data-action="overview-export-report"' + disabled(isBusy()) + '>' + buildButtonContent("Export Report", "overview-export-report") + '</button>'
    + '<button type="button" class="sa-notification-btn" data-action="overview-view-all-issues" aria-label="Notifications">◌</button>'
    + '<div class="sa-admin-card sa-profile-pill"><strong>' + escapeHtml(readAdminName()) + '</strong><span>' + escapeHtml(state.actor.email || state.actor.id) + '</span><small>' + escapeHtml(readRoleLabel(state.actor.role) || state.actor.role) + '</small></div>'
    + '</div></div>';
}

function buildOverviewFilterOptions(kind) {
  var value = kind === "region" ? state.overviewRegionFilter : state.overviewSchoolTypeFilter;
  var field = kind === "region" ? "region" : "schoolType";
  var fallback = kind === "region" ? "All regions" : "All types";
  var options = kind === "region" ? readUniqueLocationValues("region") : readUniqueLocationValues("type");
  var html = '<select data-overview-filter="' + field + '"><option value="">' + escapeHtml(fallback) + '</option>';
  var index = 0;

  while (index < options.length) {
    html += '<option value="' + escapeHtml(options[index]) + '"' + selected(value, options[index]) + '>' + escapeHtml(options[index]) + '</option>';
    index = index + 1;
  }

  html += '</select>';
  return html;
}

function buildMessage() {
  if (!state.message) {
    return "";
  }

  return '<div class="sa-message sa-message-' + escapeHtml(state.messageType) + '">' + escapeHtml(state.message) + '</div>';
}

function buildActiveTab() {
  if (!canOpenTab(state.activeTab)) {
    return buildOverviewTab();
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

  if (state.activeTab === "lessons") {
    return buildLessonsTab();
  }

  if (state.activeTab === "assignments") {
    return buildAssignmentsTab();
  }

  if (state.activeTab === "loginTools") {
    return buildLoginToolsTab();
  }

  if (state.activeTab === "analytics") {
    return buildAnalyticsTab();
  }

  if (state.activeTab === "reports") {
    return buildReportsTab();
  }

  if (state.activeTab === "settings") {
    return buildSettingsTab();
  }

  if (state.activeTab === "auditLogs") {
    return buildAuditLogsTab();
  }

  return buildOverviewTab();
}

function buildOverviewTab() {
  var html = '<section class="sa-overview">';

  html += buildOverviewHeader();

  if (state.isRefreshing) {
    html += buildOverviewSkeleton();
  }

  html += renderExecutiveMetrics();
  html += '<section class="sa-overview-grid sa-analytics-row">' + renderEngagementChart() + renderCategoryDonut() + renderSchoolsByRegion() + '</section>';
  html += '<section class="sa-overview-grid sa-ops-row">' + renderActionCenter() + renderHealthCards() + '</section>';
  html += renderLearningActivityOverview();
  html += '<section class="sa-overview-grid sa-overview-grid-2">' + renderTopSchools() + renderRecentActivity() + '</section>';
  html += renderExecutiveSummaryStrip();
  html += renderQuickActions();
  html += renderGlobalSearch();
  html += '</section>';

  return html;
}

function buildMetricCard(title, value, note) {
  return '<article class="sa-card sa-metric"><span>' + escapeHtml(title) + '</span><strong>' + escapeHtml(String(value)) + '</strong><p>' + escapeHtml(note) + '</p></article>';
}

function buildTeachersTab() {
  var teachers = readUsersByRole("teacher");
  var html = '<section class="sa-stack sa-user-page" aria-busy="' + (state.isRefreshing ? "true" : "false") + '">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">Faculty Operations</p><h2>Teachers</h2><p>Teacher profiles, class coverage, and location assignments.</p></div><button type="button" class="sa-btn" data-action="overview-create-teacher"' + disabled(isBusy()) + '>Create Teacher</button></div>'
    + '<section class="sa-grid sa-grid-4">'
    + buildMetricCard("Total Teachers", teachers.length, "Profiles with teacher role")
    + buildMetricCard("With Classes", countItems(teachers, function (teacher) { return teacher.classIds.length > 0; }), "Assigned class IDs")
    + buildMetricCard("Active Teachers", countItems(teachers, function (teacher) { return teacher.status === "active"; }), "Ready for classroom use")
    + buildMetricCard("Need Review", countItems(teachers, function (teacher) { return teacher.status !== "active" || teacher.classIds.length === 0; }), "Missing active setup")
    + '</section><article class="sa-card"><div class="sa-section-title"><div><h2>Teacher Directory</h2><p>Open a teacher from Users to manage details, roles, and access.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="overview-open-teachers">Open Users Filter</button></div>'
    + buildRoleUserRows(teachers, "No teacher profiles found yet.")
    + '</article></section>';

  return html;
}

function buildLessonsTab() {
  return '<section class="sa-stack">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">Learning Library</p><h2>Courses & Modules</h2><p>Course inventory, module signals, and learning readiness for the ecosystem.</p></div><button type="button" class="sa-btn" data-action="overview-open-course-creator">Open Course Creator</button></div>'
    + renderLearningActivityOverview()
    + '<section class="sa-overview-grid sa-overview-grid-2">' + renderGrowthChart(state.overviewChartRange) + renderRecentlyCreated() + '</section>'
    + '<article class="sa-card"><div class="sa-section-title"><div><h2>Course Inventory</h2><p>Loaded from available course collections.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>' + buildCourseInventoryRows() + '</article>'
    + '</section>';
}

function buildAnalyticsTab() {
  return '<section class="sa-stack">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">Analytics</p><h2>Ecosystem Analytics</h2><p>Engagement, intention points, growth, and regional distribution.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>'
    + '<section class="sa-overview-grid sa-analytics-row">' + renderEngagementChart() + renderCategoryDonut() + renderSchoolsByRegion() + '</section>'
    + '<section class="sa-overview-grid sa-overview-grid-2">' + renderGrowthChart(state.overviewChartRange) + renderTopSchools() + '</section>'
    + '</section>';
}

function buildReportsTab() {
  return '<section class="sa-stack">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">Reports</p><h2>Executive Reports</h2><p>Generate exports from the currently loaded dashboard data.</p></div><button type="button" class="sa-btn" data-action="overview-export-report"' + disabled(isBusy()) + '>' + buildButtonContent("Export Report", "overview-export-report") + '</button></div>'
    + renderExecutiveSummaryStrip()
    + '<section class="sa-overview-grid sa-overview-grid-2">' + renderTopSchools() + renderRecentActivity() + '</section>'
    + renderCompletionScore()
    + '</section>';
}

function buildSettingsTab() {
  return '<section class="sa-stack">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">System Management</p><h2>Settings</h2><p>Platform configuration snapshot and service readiness.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>'
    + '<section class="sa-overview-grid sa-overview-grid-2">' + renderHealthCards() + renderCompletionScore() + '</section>'
    + renderRoadmap()
    + '</section>';
}

function buildAuditLogsTab() {
  return '<section class="sa-stack">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">Audit Logs</p><h2>Operational Activity</h2><p>Recent records and activity logs when the Firestore collections are available.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>'
    + '<section class="sa-overview-grid sa-overview-grid-2">' + renderRecentActivity() + renderRecentlyCreated() + '</section>'
    + '</section>';
}

function buildRoleUserRows(users, emptyMessage) {
  var html = '<div class="sa-user-list">';
  var index = 0;

  if (users.length === 0) {
    return '<div class="sa-empty"><strong>' + escapeHtml(emptyMessage) + '</strong><span>Create profiles or adjust roles from Users.</span></div>';
  }

  while (index < users.length) {
    html += buildUserCard(users[index]);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildCourseInventoryRows() {
  var html = '<div class="sa-table">';
  var index = 0;

  if (state.courses.length === 0) {
    return '<div class="sa-empty"><strong>No courses loaded.</strong><span>Courses will appear here when the course collections are available.</span></div>';
  }

  while (index < state.courses.length && index < 12) {
    html += '<article class="sa-assignment-row"><div><strong>' + escapeHtml(readCourseTitle(state.courses[index])) + '</strong><small>Course ID: ' + escapeHtml(state.courses[index].id || "") + '</small></div><div><span class="sa-pill">' + escapeHtml(state.courses[index].status || "draft") + '</span><small>' + escapeHtml(state.courses[index].language || state.courses[index].level || "Learning item") + '</small></div><div class="sa-row-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="overview-open-course" data-id="' + escapeHtml(state.courses[index].id || "") + '">Open</button></div></article>';
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildOverviewHeader() {
  return '<div class="sa-overview-head"><div><p class="sa-eyebrow">Live Ecosystem Overview</p><h2>Command Center</h2><p>School readiness, learner momentum, platform health, and next actions in one executive view.</p></div><div class="sa-overview-head-actions"><span>Last updated: ' + escapeHtml(formatDateTime(state.overviewData.lastRefreshAt)) + '</span><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div></div>';
}

function buildOverviewSkeleton() {
  return '<section class="sa-overview-skeleton" aria-busy="true"><span></span><span></span><span></span><span></span><span></span></section>';
}

function renderExecutiveMetrics() {
  var metrics = readExecutiveMetrics();
  var html = '<section class="sa-executive-metrics">';
  var index = 0;

  while (index < metrics.length) {
    html += buildExecutiveMetricCard(metrics[index]);
    index = index + 1;
  }

  html += '</section>';
  return html;
}

function buildExecutiveMetricCard(metric) {
  return '<article class="sa-card sa-exec-metric sa-tint-' + escapeHtml(metric.tone) + '"><div class="sa-metric-top"><span class="sa-metric-icon">' + escapeHtml(metric.icon) + '</span><small>' + escapeHtml(metric.label) + '</small></div><strong>' + escapeHtml(metric.value) + '</strong><div class="sa-metric-change ' + escapeHtml(metric.changeTone) + '">' + escapeHtml(metric.change) + '</div>' + buildSparklineSvg(metric.sparkline, metric.color) + '</article>';
}

function renderActionCenter() {
  var items = buildActionCenterItems().sort(compareActionPriority);
  var html = '<article class="sa-card sa-overview-card sa-action-center-card"><div class="sa-section-title"><div><h2>Action Center</h2><p>Top setup and data quality issues.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="overview-view-all-issues">View all issues</button></div><div class="sa-action-list">';
  var index = 0;

  while (index < items.length && index < 5) {
    html += buildActionItem(items[index]);
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function buildActionCenterItems() {
  var issues = readOverviewIssues();

  return [
    { icon: "⚿", count: issues.studentsMissingCredentials, message: "Students missing login credentials", action: "overview-open-login-tools", button: "Fix", tone: issues.studentsMissingCredentials ? "danger" : "good" },
    { icon: "⌁", count: issues.locationsMissingSlugs, message: "Locations missing login slugs", action: "overview-open-locations", button: "Review", tone: issues.locationsMissingSlugs ? "warning" : "good" },
    { icon: "◌", count: issues.studentsMissingPhotos, message: "Students missing profile photos", action: "overview-open-students", button: "Students", tone: issues.studentsMissingPhotos ? "warning" : "good" },
    { icon: "✎", count: issues.classesMissingTeachers, message: "Classes with no assigned teacher", action: "overview-open-classes", button: "Classes", tone: issues.classesMissingTeachers ? "warning" : "good" },
    { icon: "◫", count: issues.locationsWithNoClasses, message: "Locations with no classes", action: "overview-open-locations", button: "Locations", tone: issues.locationsWithNoClasses ? "warning" : "good" },
    { icon: "☑", count: issues.classesWithNoStudents, message: "Classes with no students", action: "overview-open-classes", button: "Classes", tone: issues.classesWithNoStudents ? "warning" : "good" },
    { icon: "▣", count: issues.draftLearningItems, message: "Courses or modules in draft", action: "overview-open-course-creator", button: "Courses", tone: issues.draftLearningItems ? "warning" : "good" },
    { icon: "◷", count: issues.archivedLocations, message: "Archived locations", action: "overview-open-locations", button: "Review", tone: issues.archivedLocations ? "muted" : "good" }
  ];
}

function buildActionItem(item) {
  return '<div class="sa-action-item sa-action-' + escapeHtml(item.tone) + '"><div class="sa-action-icon">' + escapeHtml(item.icon) + '</div><div><strong>' + escapeHtml(String(item.count)) + '</strong><span>' + escapeHtml(item.message) + '</span></div><button type="button" class="sa-btn sa-btn-secondary" data-action="' + escapeHtml(item.action) + '">' + escapeHtml(item.button) + '</button></div>';
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

function renderHealthCards() {
  var health = readPlatformHealth();
  var html = '<article class="sa-card sa-overview-card"><h2>Platform Health</h2><div class="sa-health-list">';
  var index = 0;

  while (index < health.length) {
    html += buildHealthRow(health[index].label, health[index].tone, health[index].status);
    index = index + 1;
  }

  html += buildOverviewCollectionErrors();
  html += '</div></article>';
  return html;
}

function buildHealthRow(label, tone, value) {
  return '<div class="sa-health-row"><span><i class="sa-status-dot sa-status-dot-' + escapeHtml(tone) + '"></i>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
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

function renderEngagementChart() {
  var chart = buildEngagementChart(state.overviewChartRange);
  var html = '<article class="sa-card sa-overview-card sa-chart-card sa-chart-card-wide"><div class="sa-section-title"><div><h2>Engagement Over Time</h2><p>Derived from activity logs when available, with learner growth as fallback.</p></div><div class="sa-segmented"><button type="button" data-action="overview-chart-week" class="' + selectedClass(state.overviewChartRange, "week") + '">Week</button><button type="button" data-action="overview-chart-month" class="' + selectedClass(state.overviewChartRange, "month") + '">Month</button><button type="button" data-action="overview-chart-year" class="' + selectedClass(state.overviewChartRange, "year") + '">Year</button></div></div>';

  if (chart.isEmpty) {
    return html + '<div class="sa-empty"><strong>No engagement data yet.</strong><span>Activity logs will appear here as classrooms use OquWay.</span></div></article>';
  }

  return html + chart.svg + '<div class="sa-chart-legend"><span><i style="background:#6366f1"></i>Engagement</span><span><i style="background:#14b8a6"></i>Learner momentum</span></div></article>';
}

function renderCategoryDonut() {
  var data = readIntentionCategoryData();
  var total = sumBy(data, function (item) { return item.value; });
  var html = '<article class="sa-card sa-overview-card"><div><h2>Intention Points by Category</h2><p>Vanilla SVG breakdown using available learning signals.</p></div>';

  if (total === 0) {
    return html + '<div class="sa-empty"><strong>No point categories yet.</strong><span>Completed lessons, quests, projects, and activity logs will populate this chart.</span></div></article>';
  }

  html += '<div class="sa-donut-wrap">' + buildDonutSvg(data, total) + '<div class="sa-donut-center"><strong>' + escapeHtml(formatNumber(total)) + '</strong><span>Total points</span></div></div><div class="sa-donut-legend">';
  var index = 0;
  while (index < data.length) {
    html += '<span><i style="background:' + escapeHtml(data[index].color) + '"></i>' + escapeHtml(data[index].label) + '<strong>' + escapeHtml(formatNumber(data[index].value)) + '</strong></span>';
    index = index + 1;
  }
  html += '</div></article>';
  return html;
}

function renderSchoolsByRegion() {
  var rows = readSchoolsByRegion();
  var total = sumBy(rows, function (item) { return item.count; });
  var html = '<article class="sa-card sa-overview-card"><div><h2>Schools by Region</h2><p>Location distribution from loaded Firestore records.</p></div><div class="sa-region-list">';
  var index = 0;

  if (rows.length === 0) {
    return html + '<div class="sa-empty"><strong>No locations loaded.</strong><span>Create or load locations to see regional coverage.</span></div></div></article>';
  }

  while (index < rows.length && index < 6) {
    var percent = total ? Math.round((rows[index].count / total) * 100) : 0;
    html += '<div class="sa-region-row"><div><strong>' + escapeHtml(rows[index].region) + '</strong><span>' + rows[index].count + ' schools</span></div><div class="sa-region-bar"><span style="width:' + percent + '%"></span></div><em>' + percent + '%</em></div>';
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function renderLearningActivityOverview() {
  var stats = readLearningActivityStats();
  return '<section class="sa-learning-grid">'
    + buildLearningActivityCard("Lessons Completed", stats.lessonsCompleted, "▣", "lesson")
    + buildLearningActivityCard("Quests Completed", stats.questsCompleted, "✦", "quest")
    + buildLearningActivityCard("Projects Submitted", stats.projectsSubmitted, "◫", "project")
    + buildLearningActivityCard("Activities Logged", stats.activitiesLogged, "⌁", "activity")
    + '</section>';
}

function buildLearningActivityCard(label, value, icon, tone) {
  return '<article class="sa-card sa-learning-card sa-learning-' + escapeHtml(tone) + '"><span>' + escapeHtml(icon) + '</span><div><strong>' + escapeHtml(formatNumber(value)) + '</strong><small>' + escapeHtml(label) + '</small></div></article>';
}

function renderTopSchools() {
  var schools = readTopSchools();
  var html = '<article class="sa-card sa-overview-card sa-table-card"><div class="sa-section-title"><div><h2>Top Performing Schools</h2><p>Students, engagement, points earned, and trend.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="overview-open-locations">Open Locations</button></div>';
  var index = 0;

  if (schools.length === 0) {
    return html + '<div class="sa-empty"><strong>No schools to rank yet.</strong><span>Loaded locations with students will appear here.</span></div></article>';
  }

  html += '<div class="sa-top-schools-table"><div class="sa-top-schools-head"><span>Name</span><span>Students</span><span>Engagement</span><span>Points</span><span>Trend</span></div>';
  while (index < schools.length && index < 6) {
    html += '<button type="button" class="sa-top-school-row" data-action="overview-open-location" data-id="' + escapeHtml(schools[index].id) + '"><strong>' + escapeHtml(schools[index].name) + '</strong><span>' + schools[index].students + '</span><span>' + schools[index].engagement + '%</span><span>' + escapeHtml(formatNumber(schools[index].points)) + '</span><em>' + escapeHtml(schools[index].trend) + '</em></button>';
    index = index + 1;
  }

  html += '</div></article>';
  return html;
}

function renderExecutiveSummaryStrip() {
  var metrics = readExecutiveSummary();
  return '<article class="sa-card sa-summary-strip"><div><p class="sa-eyebrow">Executive Summary</p><h2>' + escapeHtml(metrics.summary) + '</h2></div><div class="sa-summary-metrics"><span><strong>' + escapeHtml(metrics.studentGrowth) + '</strong> student growth</span><span><strong>' + escapeHtml(metrics.teacherGrowth) + '</strong> teacher growth</span><span><strong>' + escapeHtml(metrics.engagementGrowth) + '</strong> engagement growth</span></div><div class="sa-next-steps"><strong>Next steps</strong>' + buildNextSteps(metrics.nextSteps) + '</div></article>';
}

function buildNextSteps(items) {
  var html = '<ul>';
  var index = 0;

  while (index < items.length) {
    html += '<li>' + escapeHtml(items[index]) + '</li>';
    index = index + 1;
  }

  html += '</ul>';
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
    { name: "External Task Verification", status: "Planned" },
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
    + buildUserRoleCards()
    + buildUserCreatePanel()
    + '<article class="sa-card"><div class="sa-section-title"><div><h2>' + escapeHtml(readActiveUserRoleLabel()) + '</h2><p>Single source of truth for identity, role membership, class scope, login status, and recovery actions.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>' + buildUserFilters() + buildUserRows() + '</article>'
    + '</section>';
}

function buildUsersHeader() {
  return '<div class="sa-page-head"><div><p class="sa-eyebrow">Identity & Access</p><h2>Users</h2><p>Unified management for students, teachers, parents, admins, and super admins.</p></div><button type="button" class="sa-btn" data-action="toggle-create-user"' + disabled(isBusy()) + '>' + (state.userCreateOpen ? "Close Create" : "Create User Profile") + '</button></div>';
}

function buildUserRoleCards() {
  var html = '<section class="sa-role-card-grid" aria-label="Role filters">';
  var index = 0;

  while (index < roleFilterCards.length) {
    html += buildUserRoleCard(roleFilterCards[index]);
    index = index + 1;
  }

  html += '</section>';
  return html;
}

function buildUserRoleCard(card) {
  var isActive = (state.userFilters.role || "") === card.key;
  var count = countUsersForRoleFilter(card);

  return '<button type="button" class="sa-role-card sa-role-card-' + escapeHtml(card.tone) + (isActive ? " is-active" : "") + '" data-action="filter-users-role" data-id="' + escapeHtml(card.key) + '">'
    + '<span class="sa-role-card-top"><span class="sa-role-badge-icon">' + escapeHtml(card.icon) + '</span><i>' + escapeHtml(card.icon) + '</i></span>'
    + '<span class="sa-role-card-copy"><strong>' + count + '</strong><span>' + escapeHtml(card.label) + '</span></span>'
    + '<span class="sa-role-art">' + buildRoleArtwork(card) + '</span>'
    + '</button>';
}

function buildRoleArtwork(card) {
  var cachedArtwork = readCachedRoleArtwork(card.key || "all");

  if (cachedArtwork) {
    return '<img class="sa-role-artwork-img" src="' + escapeHtml(cachedArtwork) + '" alt="">';
  }

  if (card.artwork) {
    return '<img class="sa-role-artwork-img" src="' + escapeHtml(card.artwork) + '" alt="">';
  }

  var seed = card.tone || "all";
  return '<span class="sa-role-illustration sa-role-illustration-' + escapeHtml(seed) + '"><span></span><b></b><em></em></span>';
}

function readCachedRoleArtwork(roleKey) {
  if (!window.localStorage) {
    return "";
  }

  try {
    return window.localStorage.getItem("oquwayRoleArtwork:" + roleKey) || "";
  } catch (error) {
    return "";
  }
}

window.cacheOquwayRoleArtwork = function (roleKey, dataUrl) {
  if (!window.localStorage || !roleKey || !dataUrl) {
    return false;
  }

  window.localStorage.setItem("oquwayRoleArtwork:" + roleKey, dataUrl);
  render();
  return true;
};

function countUsersForRoleFilter(card) {
  if (!card.key) {
    return state.users.length;
  }

  return countItems(state.users, function (user) {
    return userMatchesRoleFilter(getSafeUser(user), card.key);
  });
}

function readActiveUserRoleLabel() {
  var card = findRoleFilterCard(state.userFilters.role);
  return card && card.key ? card.label : "All Users";
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
  var html = '<div class="sa-user-table"><div class="sa-user-table-head"><span>Profile</span><span>Roles</span><span>Location</span><span>Class(es)</span><span>Status</span><span>Last Active</span><span>Actions</span></div>';
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

  html += '<div class="sa-user-summary">';
  html += '<div class="sa-user-profile-cell">' + buildAvatar(user) + '<div class="sa-user-main"><h3>' + escapeHtml(user.displayName || user.name || user.email || user.id) + '</h3><p>' + escapeHtml(user.email || "No email") + '</p><small>' + escapeHtml(user.phone || "No phone") + '</small></div></div>';
  html += '<div class="sa-role-badges">' + buildRoleBadges(user.roles) + '</div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(readUserLocationSummary(user)) + '</span></div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(readUserClassSummary(user)) + '</span></div>';
  html += '<div>' + buildStatusBadge(user.status) + '</div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(formatDateTime(readUserLastActive(user))) + '</span></div>';
  html += '<div class="sa-row-actions">' + buildUserActionButtons(user, isOpen) + '</div>';
  html += '</div>';

  if (isOpen) {
    html += '<div class="sa-location-detail">' + buildUserForm(user.id, normalizeUserForm(user), false) + '</div>';
  }

  html += '</article>';
  return html;
}

function buildUserActionButtons(user, isOpen) {
  var html = '<button type="button" class="sa-btn sa-btn-secondary" data-action="edit-user" data-id="' + escapeHtml(user.id) + '">' + (isOpen ? "Close" : "Edit") + '</button>';

  if (user.roles.indexOf("student") !== -1) {
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="reset-fruit-user" data-id="' + escapeHtml(user.id) + '"' + disabled(isBusy()) + '>Reset Fruit</button>';
  } else {
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="send-password-reset" data-id="' + escapeHtml(user.id) + '"' + disabled(isBusy() || !user.email) + '>Reset Password</button>';
  }

  if (user.status === "active") {
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="disable-user" data-id="' + escapeHtml(user.id) + '"' + disabled(isBusy()) + '>Disable</button>';
  }

  html += '<button type="button" class="sa-btn sa-danger-btn" data-action="delete-user" data-id="' + escapeHtml(user.id) + '"' + disabled(isBusy()) + '>Delete</button>';
  return html;
}

function buildUserForm(formId, form, isCreate) {
  var html = '<div class="sa-user-form">';

  if (isCreate) {
    html += '<section class="sa-location-form-section"><h3>Profile Identity</h3><div class="sa-user-fields">' + buildInput("user", formId, "userId", "UID / Profile ID", form.userId, "Leave blank to auto-generate") + buildInput("user", formId, "displayName", "Display Name", form.displayName) + buildInput("user", formId, "email", "Email", form.email, "name@example.com") + buildInput("user", formId, "phone", "Phone", form.phone) + buildInput("user", formId, "photoUrl", "Profile Photo", form.photoUrl, "https://example.com/photo.png") + '</div></section>';
  } else {
    html += '<section class="sa-location-form-section"><h3>Profile Identity</h3><div class="sa-user-fields">' + buildInput("user", formId, "displayName", "Display Name", form.displayName) + buildInput("user", formId, "email", "Email", form.email, "name@example.com") + buildInput("user", formId, "phone", "Phone", form.phone) + buildInput("user", formId, "photoUrl", "Profile Photo", form.photoUrl, "https://example.com/photo.png") + '</div></section>';
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

  if (form.roles.indexOf("student") !== -1) {
    html += '<section class="sa-location-form-section"><h3>Student Class Assignments</h3><p>Choose classes from a searchable list. Primary defaults to the student primary location; additional classes can span locations.</p><div class="sa-user-fields">'
      + buildClassPickerSummary(formId, form)
      + '</div></section>';
  }

  return html;
}

function buildClassPickerSummary(formId, form) {
  var additionalIds = splitCommaList(form.classIdsText).filter(function (classId) {
    return classId && classId !== form.classId;
  });
  var additionalLabel = additionalIds.length > 0
    ? additionalIds.map(readClassName).join(", ")
    : "No additional classes selected";

  return '<div class="sa-class-picker-summary">'
    + '<label>Primary Class<div class="sa-login-link-preview"><strong>' + escapeHtml(form.classId ? readClassName(form.classId) : "None selected") + '</strong><span>' + escapeHtml(form.classId ? readLocationName(readClassLocationId(findClass(form.classId))) : "Choose a primary class") + '</span></div><button type="button" class="sa-btn sa-btn-secondary" data-action="open-primary-class-picker" data-id="' + escapeHtml(formId) + '">Choose Primary Class</button></label>'
    + '<label>Additional Classes<div class="sa-login-link-preview"><strong>' + escapeHtml(additionalLabel) + '</strong><span>Multi-location class support</span></div><button type="button" class="sa-btn sa-btn-secondary" data-action="open-additional-class-picker" data-id="' + escapeHtml(formId) + '">Add Additional Classes</button></label>'
    + '</div>';
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
  return '<section class="sa-stack sa-assignment-page">'
    + '<div class="sa-page-head"><div><p class="sa-eyebrow">Assign Learning</p><h2>Course Assignments</h2><p>Connect a course to a class or individual student. Assigned courses appear on the Student Dashboard after refresh.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>'
    + buildAssignmentSummaryCards()
    + '<article class="sa-assignment-builder"><div class="sa-section-title"><div><h2>Assignment Builder</h2><p>Assign Course → Location → Class or Student.</p></div></div>' + buildAssignmentForm() + '</article>'
    + '<article class="sa-card"><div class="sa-section-title"><div><h2>Existing Course Assignments</h2><p>Review, disable, or delete assignment records.</p></div></div>' + buildAssignmentFilters() + buildAssignmentRows() + '</article>'
    + '</section>';
}

function buildAssignmentForm() {
  var form = state.assignmentForm;
  var targetSummary = readAssignmentFormTargetSummary(form);
  var html = '<div class="sa-assignment-builder-grid">';

  html += '<section class="sa-assignment-step"><span>1</span><h3>Select Course</h3><p>Choose the learning program students should see.</p>' + buildSelectedAssignmentCourse() + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-assignment-course-picker">Select Course</button></section>';
  html += '<section class="sa-assignment-step"><span>2</span><h3>Select Target</h3><p>Assign to a full class or a single student.</p>'
    + buildSelectedAssignmentTarget()
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-assignment-target-picker">Select Target</button>'
    + '</section>';
  html += '<section class="sa-assignment-step sa-assignment-review"><span>3</span><h3>Review & Assign</h3><p>' + escapeHtml(targetSummary) + '</p>'
    + '<div class="sa-assignment-review-card"><strong>' + escapeHtml(readCourseName(form.courseId) || "Choose a course") + '</strong><small>' + escapeHtml(targetSummary) + '</small><small>Status: ' + escapeHtml(form.status || "active") + '</small></div>'
    + buildSelect("assignment", "new", "status", form.status, ["active", "paused", "archived"])
    + '<button type="button" class="sa-btn" data-action="create-assignment"' + disabled(!canCreateAssignment()) + '>' + buildButtonContent("Assign Course", "create-assignment") + '</button>'
    + '</section>';

  html += '</div>';
  return html;
}

function buildSelectedAssignmentCourse() {
  var course = findCourse(state.assignmentForm.courseId);

  if (!course) {
    return '<div class="sa-assignment-choice-card sa-assignment-choice-empty"><strong>No course selected</strong><small>Open the course picker to search courses by title or status.</small></div>';
  }

  return '<div class="sa-assignment-choice-card"><strong>' + escapeHtml(readCourseTitle(course)) + '</strong><small>' + escapeHtml(readCourseDescription(course) || "No description") + '</small><span class="sa-status sa-status-' + escapeHtml(course.status || "draft") + '">' + escapeHtml(course.status || "draft") + '</span></div>';
}

function buildSelectedAssignmentTarget() {
  var form = state.assignmentForm;

  if (form.targetType === "student" && form.studentId) {
    return '<div class="sa-assignment-choice-card"><strong>' + escapeHtml(readAssignmentStudentName(form.studentId)) + '</strong><small>' + escapeHtml(readClassName(form.classId)) + ' / ' + escapeHtml(readLocationName(form.locationId)) + '</small><span class="sa-pill">student</span></div>';
  }

  if (form.classId) {
    return '<div class="sa-assignment-choice-card"><strong>' + escapeHtml(readClassName(form.classId)) + '</strong><small>' + escapeHtml(readLocationName(form.locationId)) + '</small><span class="sa-pill">class</span></div>';
  }

  return '<div class="sa-assignment-choice-card sa-assignment-choice-empty"><strong>No target selected</strong><small>Choose a class or an individual student in the target picker.</small></div>';
}

function buildAssignmentSummaryCards() {
  var stats = readAssignmentStats();

  return '<section class="sa-assignment-summary-grid">'
    + buildAssignmentSummaryCard("Active Assignments", stats.active, "Course links currently visible", "☑", "mint")
    + buildAssignmentSummaryCard("Courses Assigned", stats.courses, "Unique assigned courses", "▣", "sky")
    + buildAssignmentSummaryCard("Classes Covered", stats.classes, "Classes with active courses", "◫", "amber")
    + buildAssignmentSummaryCard("Students Reached", stats.students, "Student-specific assignments", "◉", "rose")
    + '</section>';
}

function buildAssignmentSummaryCard(label, value, note, icon, tone) {
  return '<article class="sa-assignment-summary-card sa-assignment-summary-' + escapeHtml(tone) + '"><div><span>' + escapeHtml(icon) + '</span><small>' + escapeHtml(label) + '</small></div><strong>' + escapeHtml(String(value)) + '</strong><p>' + escapeHtml(note) + '</p></article>';
}

function buildAssignmentFilters() {
  var html = '<div class="sa-filters sa-assignment-filters">';
  html += '<label>Course' + buildCourseOptionsSelect('data-assignment-filter="courseId"', state.assignmentFilters.courseId, "All courses") + '</label>';
  html += '<label>Target Type' + buildBasicOptionsSelect('data-assignment-filter="targetType"', state.assignmentFilters.targetType, ["class", "student"], "All targets") + '</label>';
  html += '<label>Status' + buildBasicOptionsSelect('data-assignment-filter="status"', state.assignmentFilters.status, ["active", "paused", "disabled", "archived"], "All statuses") + '</label>';
  html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data">Apply</button>';
  html += '</div>';
  return html;
}

function buildAssignmentRows() {
  var html = '<div class="sa-table">';
  var index = 0;

  if (state.assignments.length === 0) {
    return '<div class="sa-empty"><strong>No course assignments yet.</strong><span>Create one above so students see the right courses.</span></div>';
  }

  while (index < state.assignments.length) {
    var assignment = state.assignments[index];
    var targetLabel = readAssignmentTargetName(assignment);
    var assignedDate = formatDateTime(assignment.assignedAt || assignment.createdAt || assignment.updatedAt);
    html += '<article class="sa-assignment-row">';
    html += '<div><strong>' + escapeHtml(readCourseName(assignment.courseId)) + '</strong><small>Course ID: ' + escapeHtml(assignment.courseId) + '</small></div>';
    html += '<div><span class="sa-pill">' + escapeHtml(assignment.targetType || "class") + '</span><strong>' + escapeHtml(targetLabel) + '</strong><small>' + escapeHtml(readAssignmentScopeLine(assignment)) + '</small></div>';
    html += '<div><span class="sa-status sa-status-' + escapeHtml(assignment.status || "active") + '">' + escapeHtml(assignment.status || "active") + '</span><small>Assigned: ' + escapeHtml(assignedDate || "unknown") + '</small></div>';
    html += '<div class="sa-row-actions">';
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="view-assignment" data-id="' + escapeHtml(assignment.id) + '"' + disabled(isBusy()) + '>' + buildButtonContent("View", "view-assignment:" + assignment.id) + '</button>';
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="pause-assignment" data-id="' + escapeHtml(assignment.id) + '"' + disabled(isBusy() || assignment.status === "disabled") + '>' + buildButtonContent("Disable", "pause-assignment:" + assignment.id) + '</button>';
    html += '<button type="button" class="sa-btn sa-danger-btn" data-action="open-delete-assignment" data-id="' + escapeHtml(assignment.id) + '"' + disabled(isBusy()) + '>Delete</button>';
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
  return '<label>Target Type' + buildBasicOptionsSelect('data-field-kind="' + kind + '" data-field-id="' + id + '" data-field="targetType"', selectedValue, ["class", "student"], "Choose target type") + '</label>';
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

function buildAssignmentClassSelect(locationId, selectedValue) {
  var classes = state.classes.filter(function (classRecord) {
    return !locationId || classRecord.locationId === locationId;
  });

  return '<label>Class' + buildOptionsSelectFromList('data-field-kind="assignment" data-field-id="new" data-field="classId"', selectedValue, classes, "Choose class") + '</label>';
}

function buildAssignmentStudentSelect(locationId, classId, selectedValue) {
  var students = state.students.filter(function (student) {
    var locationMatches = !locationId || student.locationId === locationId || student.primaryLocationId === locationId || readIdArray(student.locationIds).indexOf(locationId) !== -1;
    var classMatches = !classId || student.classId === classId || readIdArray(student.classIds).indexOf(classId) !== -1;

    return locationMatches && classMatches;
  });

  return '<label>Student' + buildOptionsSelectFromList('data-field-kind="assignment" data-field-id="new" data-field="studentId"', selectedValue, students, "Choose student") + '</label>';
}

function buildOptionsSelectFromList(attributes, selectedValue, items, emptyLabel) {
  var html = '<select ' + attributes + '><option value="">' + escapeHtml(emptyLabel) + '</option>';
  var index = 0;

  while (index < items.length) {
    html += '<option value="' + escapeHtml(items[index].id) + '"' + selected(selectedValue, items[index].id) + '>' + escapeHtml(items[index].name || items[index].displayName || items[index].title || items[index].id) + '</option>';
    index = index + 1;
  }

  html += '</select>';
  return html;
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
  var isFruitResetLocked = state.fruitResetSaveStatus === "saving" || state.fruitResetSaveStatus === "saved";

  return '<div class="sa-modal-backdrop"><section class="sa-modal sa-fruit-reset-modal"><h2>Reset Fruit Password</h2><p>' + escapeHtml(name) + '</p><p class="sa-summary">A random fruit password is ready locally. It will not be saved until you click Save Password.</p>' + buildFruitSelector("reset", state.resetFruitPassword) + buildFruitResetFeedback() + '<div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="regenerate-reset-fruit"' + disabled(isFruitResetLocked) + '>Regenerate</button><button type="button" class="sa-btn sa-btn-secondary" data-action="close-reset-fruit"' + disabled(isFruitResetLocked) + '>Cancel</button><button type="button" class="sa-btn" data-action="confirm-reset-fruit"' + disabled(state.resetFruitPassword.length !== 4 || isFruitResetLocked) + '>Save Password</button></div>' + buildFruitResetSavingOverlay() + '</section></div>';
}

function buildFruitResetFeedback() {
  if (state.fruitResetSaveStatus !== "error" || !state.fruitResetSaveMessage) {
    return "";
  }

  return '<div class="sa-message sa-message-error sa-fruit-reset-feedback">' + escapeHtml(state.fruitResetSaveMessage) + '</div>';
}

function buildFruitResetSavingOverlay() {
  if (state.fruitResetSaveStatus !== "saving" && state.fruitResetSaveStatus !== "saved") {
    return "";
  }

  var isSaved = state.fruitResetSaveStatus === "saved";
  var message = state.fruitResetSaveMessage || (isSaved ? "Fruit password saved!" : "Saving fruit password...");

  return '<div class="sa-fruit-save-overlay' + (isSaved ? ' sa-fruit-save-overlay-saved' : '') + '" aria-live="polite" aria-busy="' + (isSaved ? "false" : "true") + '"><div class="sa-fruit-save-orbit" aria-hidden="true"><span class="sa-fruit-save-core">' + (isSaved ? "✓" : "🛡") + '</span><span class="sa-orbit-fruit sa-orbit-fruit-1">🍎</span><span class="sa-orbit-fruit sa-orbit-fruit-2">🍌</span><span class="sa-orbit-fruit sa-orbit-fruit-3">🍇</span><span class="sa-orbit-fruit sa-orbit-fruit-4">🍉</span></div><strong>' + escapeHtml(message) + '</strong></div>';
}

function buildStaffPasswordResetModal() {
  if (!state.staffResetOpen) {
    return "";
  }

  return '<div class="sa-modal-backdrop"><section class="sa-modal sa-staff-reset-modal" role="dialog" aria-modal="true" aria-labelledby="staff-reset-title"><p class="sa-eyebrow">Staff Access</p><h2 id="staff-reset-title">Reset password</h2><p>Enter the email for your staff account. Firebase will send the reset link.</p><div class="sa-form"><label>Email<input type="email" data-staff-reset-field="email" value="' + escapeHtml(state.staffResetEmail) + '" placeholder="admin@example.com"></label></div>' + buildStaffResetStatus() + '<div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-staff-login-reset"' + disabled(state.isSaving) + '>Cancel</button><button type="button" class="sa-btn" data-action="send-staff-login-reset"' + disabled(state.isSaving) + '>' + buildButtonContent("Send Reset Link", "staff-login-reset") + '</button></div></section></div>';
}

function buildStaffResetStatus() {
  if (!state.staffResetStatus) {
    return "";
  }

  return '<div class="sa-message sa-message-' + escapeHtml(state.staffResetStatusType) + '">' + escapeHtml(state.staffResetStatus) + '</div>';
}

function buildClassPickerModal() {
  if (!state.classPicker || !state.classPicker.isOpen) {
    return "";
  }

  var picker = state.classPicker;
  var classes = readClassPickerClasses(picker);
  var title = picker.mode === "primary" ? "Choose Primary Class" : "Add Additional Classes";
  var html = '<div class="sa-modal-backdrop"><section class="sa-modal"><h2>' + escapeHtml(title) + '</h2><p>Search classes and confirm the selection. Location names are shown beside each class.</p>';
  html += '<div class="sa-form sa-form-2"><label>Search<input type="search" data-class-picker-search="true" value="' + escapeHtml(picker.searchText) + '" placeholder="Search class or location"></label><label><span>Scope</span><span class="sa-check-row"><input type="checkbox" data-class-picker-all-locations="true"' + (picker.includeAllLocations ? " checked" : "") + '> Search all locations</span></label></div>';
  html += '<div class="sa-table" style="max-height:320px;overflow:auto;margin-top:12px">';

  if (classes.length === 0) {
    html += '<div class="sa-empty">No matching classes found.</div>';
  } else {
    classes.forEach(function (classRecord) {
      var selected = picker.selectedIds.indexOf(classRecord.id) !== -1;
      html += '<button type="button" class="sa-row' + (selected ? ' sa-row-active' : '') + '" data-class-picker-id="' + escapeHtml(classRecord.id) + '">'
        + '<strong>' + escapeHtml(readClassName(classRecord.id)) + '</strong>'
        + '<span>' + escapeHtml(readLocationName(readClassLocationId(classRecord))) + '</span>'
        + '<em>' + (selected ? "Selected" : "Choose") + '</em>'
        + '</button>';
    });
  }

  html += '</div><div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-class-picker">Cancel</button><button type="button" class="sa-btn" data-action="save-class-picker"' + disabled(picker.mode === "primary" && picker.selectedIds.length !== 1) + '>Save Class Selection</button></div></section></div>';
  return html;
}

function buildAssignmentCoursePickerModal() {
  var picker = state.assignmentCoursePicker;

  if (!picker || !picker.isOpen) {
    return "";
  }

  var courses = readAssignmentPickerCourses();
  var html = '<div class="sa-modal-backdrop"><section class="sa-modal sa-assignment-picker-modal"><div class="sa-section-title"><div><p class="sa-eyebrow">Course Assignment</p><h2>Select Course</h2><p>Search courses and choose the learning program to assign.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="close-assignment-course-picker">Close</button></div>';
  html += '<div class="sa-form sa-form-2"><label>Search<input type="search" data-assignment-course-picker-field="searchText" value="' + escapeHtml(picker.searchText) + '" placeholder="Search title or description"></label><label>Status<select data-assignment-course-picker-field="statusFilter"><option value="">All</option><option value="published"' + selected(picker.statusFilter, "published") + '>Published</option><option value="draft"' + selected(picker.statusFilter, "draft") + '>Draft</option><option value="archived"' + selected(picker.statusFilter, "archived") + '>Archived</option></select></label></div>';
  html += '<div class="sa-picker-grid">';

  if (picker.isLoading) {
    html += '<div class="sa-empty"><strong>Loading courses...</strong><span>Preparing the course picker.</span></div>';
  } else if (courses.length === 0) {
    html += '<div class="sa-empty"><strong>No courses found.</strong><span>Try a different search or status filter.</span></div>';
  } else {
    courses.forEach(function (course) {
      var isSelected = state.assignmentForm.courseId === course.id;
      html += '<article class="sa-picker-card' + (isSelected ? ' sa-picker-card-selected' : '') + '"><div><h3>' + escapeHtml(readCourseTitle(course)) + '</h3><p>' + escapeHtml(readCourseDescription(course) || "No description") + '</p></div><div class="sa-picker-meta"><span class="sa-status sa-status-' + escapeHtml(course.status || "draft") + '">' + escapeHtml(course.status || "draft") + '</span><small>' + escapeHtml(readCourseModuleCount(course)) + ' modules</small><small>Updated ' + escapeHtml(formatDateTime(readCourseUpdatedAt(course)) || "unknown") + '</small></div><button type="button" class="sa-btn" data-action="select-assignment-course" data-id="' + escapeHtml(course.id) + '">' + (isSelected ? "Selected" : "Select") + '</button></article>';
    });
  }

  html += '</div></section></div>';
  return html;
}

function buildAssignmentTargetPickerModal() {
  var picker = state.assignmentTargetPicker;

  if (!picker || !picker.isOpen) {
    return "";
  }

  var items = picker.targetType === "student" ? readAssignmentPickerStudents() : readAssignmentPickerClasses();
  var html = '<div class="sa-modal-backdrop"><section class="sa-modal sa-assignment-picker-modal"><div class="sa-section-title"><div><p class="sa-eyebrow">Course Assignment</p><h2>Select Target</h2><p>Choose a class or an individual student without saving the assignment yet.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="close-assignment-target-picker">Close</button></div>';
  html += '<div class="sa-form sa-form-2"><label>Target Type<select data-assignment-target-picker-field="targetType"><option value="class"' + selected(picker.targetType, "class") + '>Class</option><option value="student"' + selected(picker.targetType, "student") + '>Individual Student</option></select></label><label>Location' + buildOptionsSelectFromList('data-assignment-target-picker-field="locationId"', picker.locationId, state.locations, "Choose location") + '</label><label>Search<input type="search" data-assignment-target-picker-field="searchText" value="' + escapeHtml(picker.searchText) + '" placeholder="Search names"></label><label><span>Scope</span><span class="sa-check-row"><input type="checkbox" data-assignment-target-picker-check="includeAllLocations"' + (picker.includeAllLocations ? " checked" : "") + '> Search all locations</span></label></div>';

  if (picker.targetType === "student") {
    html += '<div class="sa-form sa-form-2"><label>Class Filter' + buildOptionsSelectFromList('data-assignment-target-picker-field="classId"', picker.classId, readAssignmentPickerClassesForFilter(), "All classes") + '</label></div>';
  }

  html += '<div class="sa-picker-list">';

  if (picker.isLoading) {
    html += '<div class="sa-empty"><strong>Loading targets...</strong><span>Preparing classes and students.</span></div>';
  } else if (items.length === 0) {
    html += '<div class="sa-empty"><strong>No targets found.</strong><span>Try changing the location, search, or all-locations option.</span></div>';
  } else {
    items.forEach(function (item) {
      if (picker.targetType === "student") {
        html += '<button type="button" class="sa-picker-row" data-action="select-assignment-student" data-id="' + escapeHtml(item.id) + '"><strong>' + escapeHtml(item.name || item.displayName || item.id) + '</strong><span>' + escapeHtml(readClassName(item.classId)) + '</span><small>' + escapeHtml(readLocationName(readStudentLocationId(item))) + '</small></button>';
      } else {
        html += '<button type="button" class="sa-picker-row" data-action="select-assignment-class" data-id="' + escapeHtml(item.id) + '"><strong>' + escapeHtml(readClassName(item.id)) + '</strong><span>' + escapeHtml(readLocationName(readClassLocationId(item))) + '</span><small>' + escapeHtml(item.status || "active") + '</small></button>';
      }
    });
  }

  html += '</div></section></div>';
  return html;
}

function buildAssignmentDeleteModal() {
  var modal = state.assignmentDelete;

  if (!modal || !modal.assignmentId) {
    return "";
  }

  var assignment = findAssignment(modal.assignmentId);
  var isDeleting = modal.status === "deleting";
  var isDeleted = modal.status === "deleted";

  return '<div class="sa-modal-backdrop"><section class="sa-modal sa-delete-assignment-modal"><h2>Delete Course Assignment?</h2><p>This will remove this assignment from students. This cannot be undone.</p><div class="sa-assignment-review-card"><strong>' + escapeHtml(assignment ? readCourseName(assignment.courseId) : modal.assignmentId) + '</strong><small>' + escapeHtml(assignment ? readAssignmentTargetName(assignment) : "") + '</small></div>' + buildAssignmentDeleteAnimation(isDeleting, isDeleted, modal.message) + '<div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-delete-assignment"' + disabled(isDeleting || isDeleted) + '>Cancel</button><button type="button" class="sa-btn sa-danger-btn" data-action="confirm-delete-assignment"' + disabled(isDeleting || isDeleted) + '>Delete Assignment</button></div></section></div>';
}

function buildAssignmentDeleteAnimation(isDeleting, isDeleted, message) {
  if (!isDeleting && !isDeleted) {
    return "";
  }

  return '<div class="sa-delete-animation' + (isDeleted ? ' sa-delete-animation-done' : '') + '"><span>▣</span><strong>' + escapeHtml(message || (isDeleted ? "Assignment deleted." : "Deleting assignment...")) + '</strong></div>';
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
  var classPickerButton = event.target.closest("[data-class-picker-id]");

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

  if (classPickerButton) {
    toggleClassPickerSelection(classPickerButton.getAttribute("data-class-picker-id"));
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

  if (target.getAttribute("data-staff-reset-field")) {
    updateStaffResetField(target.getAttribute("data-staff-reset-field"), target.value);
    return;
  }

  if (target.getAttribute("data-assignment-filter")) {
    state.assignmentFilters[target.getAttribute("data-assignment-filter")] = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-assignment-course-picker-field")) {
    updateAssignmentCoursePicker(target.getAttribute("data-assignment-course-picker-field"), target.value);
    return;
  }

  if (target.getAttribute("data-assignment-target-picker-field")) {
    updateAssignmentTargetPicker(target.getAttribute("data-assignment-target-picker-field"), target.value);
    return;
  }

  if (target.getAttribute("data-assignment-target-picker-check")) {
    updateAssignmentTargetPicker(target.getAttribute("data-assignment-target-picker-check"), target.checked);
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

  if (target.getAttribute("data-overview-filter")) {
    updateOverviewFilter(target.getAttribute("data-overview-filter"), target.value);
    return;
  }

  if (target.getAttribute("data-class-picker-search")) {
    state.classPicker.searchText = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-class-picker-all-locations")) {
    state.classPicker.includeAllLocations = target.checked;
    render();
    return;
  }

  if (target.getAttribute("data-field")) {
    updateFormValue(target);
  }
}

function updateOverviewFilter(field, value) {
  if (field === "range") {
    state.overviewChartRange = value;
  } else if (field === "region") {
    state.overviewRegionFilter = value;
  } else if (field === "schoolType") {
    state.overviewSchoolTypeFilter = value;
  }

  render();
}

function updateLoginField(field, value) {
  if (field === "email") {
    state.loginEmail = value;
  } else if (field === "password") {
    state.loginPassword = value;
  }
}

function updateStaffResetField(field, value) {
  if (field === "email") {
    state.staffResetEmail = value;
    state.staffResetStatus = "";
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
    if (shouldRerenderUserFormField(field)) {
      render();
    }
  } else if (kind === "assignment" && id === "new") {
    updateAssignmentFormValue(field, value);
    render();
  } else {
    updateExistingRecord(kind, id, field, value);
  }
}

function updateAssignmentFormValue(field, value) {
  if (field === "targetType" && state.assignmentForm.targetType !== value) {
    state.assignmentForm.targetType = value;
    state.assignmentForm.targetId = "";
    state.assignmentForm.classId = "";
    state.assignmentForm.studentId = "";
    return;
  }

  if (field === "locationId" && state.assignmentForm.locationId !== value) {
    state.assignmentForm.locationId = value;
    state.assignmentForm.targetId = "";
    state.assignmentForm.classId = "";
    state.assignmentForm.studentId = "";
    return;
  }

  if (field === "classId") {
    state.assignmentForm.classId = value;
    state.assignmentForm.studentId = "";
    state.assignmentForm.targetId = state.assignmentForm.targetType === "class" ? value : "";
    return;
  }

  if (field === "studentId") {
    state.assignmentForm.studentId = value;
    state.assignmentForm.targetId = value;
    return;
  }

  state.assignmentForm[field] = value;
}

function updateAssignmentCoursePicker(field, value) {
  state.assignmentCoursePicker[field] = value;
  render();
}

function updateAssignmentTargetPicker(field, value) {
  if (field === "targetType" && state.assignmentTargetPicker.targetType !== value) {
    state.assignmentTargetPicker.targetType = value === "student" ? "student" : "class";
    state.assignmentTargetPicker.searchText = "";
    state.assignmentTargetPicker.classId = "";
    render();
    return;
  }

  if (field === "locationId" && state.assignmentTargetPicker.locationId !== value) {
    state.assignmentTargetPicker.locationId = value;
    state.assignmentTargetPicker.classId = "";
    render();
    return;
  }

  state.assignmentTargetPicker[field] = value;
  render();
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
        if (shouldRerenderUserFormField(field)) {
          render();
        }
        return;
      }
      render();
      return;
    }

    index = index + 1;
  }
}

function shouldRerenderUserFormField(field) {
  return field === "roles"
    || field === "locationIds"
    || field === "primaryLocationId"
    || field === "classId";
}

function openClassPicker(formId, mode) {
  var form = formId === "new" ? state.userForm : normalizeUserForm(findUser(formId) || { id: formId });
  var selectedIds = mode === "primary"
    ? (form.classId ? [form.classId] : [])
    : splitCommaList(form.classIdsText);

  state.classPicker = {
    isOpen: true,
    formId: formId,
    mode: mode === "additional" ? "additional" : "primary",
    searchText: "",
    includeAllLocations: mode === "additional",
    selectedIds: selectedIds
  };
  render();
}

function closeClassPicker() {
  state.classPicker = {
    isOpen: false,
    formId: "",
    mode: "primary",
    searchText: "",
    includeAllLocations: false,
    selectedIds: []
  };
  render();
}

function toggleClassPickerSelection(classId) {
  var picker = state.classPicker;
  var selectedIds = picker.selectedIds.slice();
  var index = selectedIds.indexOf(classId);

  if (picker.mode === "primary") {
    selectedIds = [classId];
  } else if (index === -1) {
    selectedIds.push(classId);
  } else {
    selectedIds.splice(index, 1);
  }

  state.classPicker = Object.assign({}, picker, { selectedIds: selectedIds });
  render();
}

function saveClassPicker() {
  var picker = state.classPicker;
  var form = picker.formId === "new" ? state.userForm : findUser(picker.formId);

  if (!form) {
    closeClassPicker();
    return;
  }

  if (picker.mode === "primary") {
    var classId = picker.selectedIds[0] || "";
    var classRecord = findClass(classId);
    setUserFormValue(form, "classId", classId);
    setUserFormValue(form, "primaryLocationId", readClassLocationId(classRecord));
  } else {
    setUserFormValue(form, "classIdsText", picker.selectedIds.join(", "));
  }

  closeClassPicker();
}

function readClassPickerClasses(picker) {
  var form = picker.formId === "new" ? state.userForm : normalizeUserForm(findUser(picker.formId) || { id: picker.formId });
  var primaryLocationId = form.primaryLocationId || form.locationId || "";
  var query = readSafeString(picker.searchText).toLowerCase();

  return state.classes.filter(function (classRecord) {
    var locationId = readClassLocationId(classRecord);
    var locationMatches = picker.includeAllLocations || !primaryLocationId || locationId === primaryLocationId;
    var text = [classRecord.name, classRecord.title, classRecord.id, readLocationName(locationId)].join(" ").toLowerCase();

    return locationMatches && (!query || text.indexOf(query) !== -1);
  });
}

function readClassLocationId(classRecord) {
  return readSafeString(classRecord.locationId || classRecord.schoolId || classRecord.locId);
}

async function handleAction(action, id) {
  if (action === "refresh-data") {
    state.pendingAction = "refresh-data";
    await refreshAllData();
    setState({ pendingAction: "" });
  } else if (action === "admin-login") {
    await loginAdmin();
  } else if (action === "open-staff-login-reset") {
    openStaffLoginPasswordReset();
  } else if (action === "close-staff-login-reset") {
    closeStaffLoginPasswordReset();
  } else if (action === "send-staff-login-reset") {
    await sendStaffLoginPasswordReset();
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
  } else if (action === "filter-users-role") {
    setState({ userFilters: Object.assign({}, state.userFilters, { role: id || "" }), activeUserId: "", message: "" });
  } else if (action === "create-user") {
    await saveUserProfile("create", "new");
  } else if (action === "update-user") {
    await saveUserProfile("update", id);
  } else if (action === "disable-user") {
    await updateUserStatus(id, "inactive");
  } else if (action === "delete-user") {
    await deleteUserProfile(id);
  } else if (action === "open-primary-class-picker") {
    openClassPicker(id, "primary");
  } else if (action === "open-additional-class-picker") {
    openClassPicker(id, "additional");
  } else if (action === "close-class-picker") {
    closeClassPicker();
  } else if (action === "save-class-picker") {
    saveClassPicker();
  } else if (action === "reset-fruit-user") {
    openFruitPasswordReset(id);
  } else if (action === "send-password-reset") {
    await sendStaffPasswordReset(id);
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
    await createAssignment();
  } else if (action === "view-assignment") {
    await viewAssignment(id);
  } else if (action === "activate-assignment") {
    await updateAssignmentStatus(id, "active");
  } else if (action === "pause-assignment") {
    await disableAssignment(id);
  } else if (action === "open-delete-assignment") {
    openDeleteAssignmentModal(id);
  } else if (action === "close-delete-assignment") {
    closeDeleteAssignmentModal();
  } else if (action === "confirm-delete-assignment") {
    await deleteAssignmentWithConfirmation();
  } else if (action === "archive-assignment") {
    await saveIntent("ArchiveCourseAssignmentIntent", { assignmentId: id }, "Course assignment archived.");
    await refreshAllData();
  } else if (action === "open-assignment-course-picker") {
    openAssignmentCoursePicker();
  } else if (action === "close-assignment-course-picker") {
    closeAssignmentCoursePicker();
  } else if (action === "select-assignment-course") {
    selectAssignmentCourse(id);
  } else if (action === "open-assignment-target-picker") {
    openAssignmentTargetPicker();
  } else if (action === "close-assignment-target-picker") {
    closeAssignmentTargetPicker();
  } else if (action === "select-assignment-class") {
    selectAssignmentClass(id);
  } else if (action === "select-assignment-student") {
    selectAssignmentStudent(id);
  } else if (action === "open-reset-fruit") {
    if (id) {
      openFruitPasswordReset(id);
    }
  } else if (action === "close-reset-fruit") {
    setState({ resetStudentId: "", resetFruitPassword: [], fruitResetSaveStatus: "", fruitResetSaveMessage: "" });
  } else if (action === "regenerate-reset-fruit") {
    setState({ resetFruitPassword: createRandomFruitPassword(), fruitResetSaveStatus: "", fruitResetSaveMessage: "", message: "" });
  } else if (action === "confirm-reset-fruit") {
    await resetFruitPassword();
  } else if (action === "open-student-login") {
    window.open("../student-login/index.html", "_blank");
  } else if (action === "copy-login-link") {
    await copyLoginLink(id);
  } else if (action === "overview-export-report") {
    await exportOverviewReport();
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
    setState({ activeTab: "users", activeUserId: action === "overview-open-student" ? id || "" : "", userFilters: Object.assign({}, state.userFilters, { role: "student" }), userCreateOpen: action === "overview-create-student", userForm: Object.assign(createUserForm(), { roles: ["student"] }), message: "" });
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
    openCourseCreatorApp();
    return;
  }

  if (action === "overview-open-course") {
    setState({ activeTab: "assignments", assignmentFilters: Object.assign({}, state.assignmentFilters, { courseId: id || "" }), message: "" });
    return;
  }

  if (action === "overview-open-users") {
    setState({ activeTab: "users", activeUserId: id || "", message: "" });
    return;
  }

  if (action === "overview-open-teachers") {
    setState({ activeTab: "users", userFilters: Object.assign({}, state.userFilters, { role: "teacher" }), message: "" });
    return;
  }

  if (action === "overview-ai-insights") {
    setState({ message: "AI Insights are ready for the executive summary view. Connect the dedicated insights service when it is available.", messageType: "info" });
    return;
  }

  if (action === "overview-view-all-issues") {
    var count = sumBy(buildActionCenterItems(), function (item) { return item.count; });
    setState({ message: count ? "There are " + count + " open setup and data quality signals across the dashboard." : "No critical setup issues are currently detected.", messageType: count ? "info" : "success" });
    return;
  }

  if (action === "overview-coming-soon") {
    setState({ message: (id || "This section") + " is planned for the command center. Existing admin workflows are still available from the active tabs.", messageType: "info" });
  }
}

function openCourseCreatorApp() {
  var url = COURSE_CREATOR_URL || "";

  console.info("[admin-nav] Course Creator clicked", { url: url });

  if (!url) {
    setState({ message: "Course Creator link is not configured.", messageType: "error" });
    return;
  }

  var openedWindow = window.open(url, "_blank");

  if (!openedWindow) {
    setState({ message: "Course Creator link is not configured.", messageType: "error" });
  }
}

function buildCourseCreatorCourseUrl(courseId) {
  if (!COURSE_CREATOR_URL || !courseId) {
    return "";
  }

  return COURSE_CREATOR_URL + "#overview?courseId=" + encodeURIComponent(courseId);
}

async function exportOverviewReport() {
  setState({ pendingAction: "overview-export-report", message: "Preparing executive report...", messageType: "info" });
  await waitForNextFrame();

  try {
    var metrics = readExecutiveMetrics();
    var report = {
      generatedAt: new Date().toISOString(),
      filters: {
        range: state.overviewChartRange,
        region: state.overviewRegionFilter || "all",
        schoolType: state.overviewSchoolTypeFilter || "all"
      },
      metrics: metrics.map(function (metric) {
        return {
          label: metric.label,
          value: metric.value,
          change: metric.change
        };
      }),
      platformHealth: readPlatformHealth(),
      topSchools: readTopSchools().slice(0, 10),
      issues: buildActionCenterItems().sort(compareActionPriority)
    };
    var blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "oquway-super-admin-report.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    setState({ pendingAction: "", message: "Executive report exported.", messageType: "success" });
  } catch (error) {
    setState({ pendingAction: "", message: "Could not export report: " + (error.message || "Unknown error"), messageType: "error" });
  }
}

function waitForNextFrame() {
  return new Promise(function (resolve) {
    window.requestAnimationFrame(resolve);
  });
}

function waitForMilliseconds(milliseconds) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, milliseconds);
  });
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

function openStaffLoginPasswordReset() {
  setState({
    staffResetOpen: true,
    staffResetEmail: state.staffResetEmail || state.loginEmail,
    staffResetStatus: "",
    staffResetStatusType: "info",
    message: ""
  });
}

function closeStaffLoginPasswordReset() {
  setState({
    staffResetOpen: false,
    staffResetStatus: "",
    staffResetStatusType: "info"
  });
}

async function sendStaffLoginPasswordReset() {
  var email = state.staffResetEmail.trim();

  if (!email) {
    setState({
      staffResetStatus: "Enter your email address.",
      staffResetStatusType: "error"
    });
    return false;
  }

  if (!isValidEmail(email)) {
    setState({
      staffResetStatus: "Enter a valid email address.",
      staffResetStatusType: "error"
    });
    return false;
  }

  try {
    setState({
      isSaving: true,
      pendingAction: "staff-login-reset",
      staffResetStatus: "Sending reset link...",
      staffResetStatusType: "info"
    });
    await sendPasswordResetEmail(auth, email);
    setState({
      isSaving: false,
      pendingAction: "",
      staffResetStatus: "If an account exists for this email, a reset link has been sent.",
      staffResetStatusType: "success"
    });
    return true;
  } catch (error) {
    if (error && error.code === "auth/invalid-email") {
      setState({
        isSaving: false,
        pendingAction: "",
        staffResetStatus: "Enter a valid email address.",
        staffResetStatusType: "error"
      });
      return false;
    }

    setState({
      isSaving: false,
      pendingAction: "",
      staffResetStatus: "If an account exists for this email, a reset link has been sent.",
      staffResetStatusType: "success"
    });
    return true;
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
  return "./index.html";
}

async function updateAssignmentStatus(assignmentId, status) {
  await saveIntent("UpdateCourseAssignmentIntent", {
    assignmentId: assignmentId,
    status: status
  }, "Course assignment updated.");
  await refreshAllData();
}

async function createAssignment() {
  setState({ pendingAction: "create-assignment", message: "Creating assignment...", messageType: "info" });
  var saved = await saveIntent("CreateCourseAssignmentIntent", buildAssignmentPayload(state.assignmentForm), "Course assignment created.");

  if (saved) {
    state.assignmentForm = createAssignmentForm();
    closeAssignmentCoursePicker(false);
    closeAssignmentTargetPicker(false);
    await refreshAllData();
    setState({ pendingAction: "", message: "Course assignment created.", messageType: "success" });
    return;
  }

  setState({ pendingAction: "" });
}

async function disableAssignment(assignmentId) {
  setState({ pendingAction: "pause-assignment:" + assignmentId, message: "Disabling assignment...", messageType: "info" });
  var saved = await saveIntent("DisableCourseAssignmentIntent", {
    assignmentId: assignmentId
  }, "Course assignment disabled.");

  if (saved) {
    await refreshAllData();
    setState({ pendingAction: "", message: "Course assignment disabled.", messageType: "success" });
    return;
  }

  setState({ pendingAction: "" });
}

async function viewAssignment(assignmentId) {
  var assignment = findAssignment(assignmentId);

  if (!assignment) {
    setState({ message: "Course assignment was not found.", messageType: "error" });
    return;
  }

  var url = buildCourseCreatorCourseUrl(assignment.courseId);

  console.info("[admin-nav] Course assignment view clicked", { assignmentId: assignmentId, courseId: assignment.courseId, url: url });

  if (!url) {
    setState({ message: "Course Creator link is not configured.", messageType: "error" });
    return;
  }

  setState({ pendingAction: "view-assignment:" + assignmentId, message: "Opening course in Course Creator...", messageType: "info" });
  await waitForMilliseconds(120);

  var openedWindow = window.open(url, "_blank");

  setState({
    pendingAction: "",
    message: openedWindow ? "Opening " + readCourseName(assignment.courseId) + " in Course Creator." : "Course Creator link is not configured.",
    messageType: openedWindow ? "success" : "error"
  });
}

function openAssignmentCoursePicker() {
  setState({
    assignmentCoursePicker: {
      isOpen: true,
      searchText: "",
      statusFilter: "",
      isLoading: true
    },
    message: ""
  });
  window.setTimeout(function () {
    if (state.assignmentCoursePicker && state.assignmentCoursePicker.isOpen) {
      state.assignmentCoursePicker.isLoading = false;
      render();
    }
  }, 120);
}

function closeAssignmentCoursePicker(shouldRender) {
  state.assignmentCoursePicker = {
    isOpen: false,
    searchText: "",
    statusFilter: "",
    isLoading: false
  };

  if (shouldRender !== false) {
    render();
  }
}

function selectAssignmentCourse(courseId) {
  state.assignmentForm.courseId = courseId || "";
  closeAssignmentCoursePicker(false);
  setState({ message: "Course selected. Choose a target next.", messageType: "success" });
}

function openAssignmentTargetPicker() {
  setState({
    assignmentTargetPicker: {
      isOpen: true,
      targetType: state.assignmentForm.targetType || "class",
      searchText: "",
      locationId: state.assignmentForm.locationId || state.filters.locationId || "",
      classId: state.assignmentForm.classId || "",
      includeAllLocations: false,
      isLoading: true
    },
    message: ""
  });
  window.setTimeout(function () {
    if (state.assignmentTargetPicker && state.assignmentTargetPicker.isOpen) {
      state.assignmentTargetPicker.isLoading = false;
      render();
    }
  }, 120);
}

function closeAssignmentTargetPicker(shouldRender) {
  state.assignmentTargetPicker = {
    isOpen: false,
    targetType: "class",
    searchText: "",
    locationId: "",
    classId: "",
    includeAllLocations: false,
    isLoading: false
  };

  if (shouldRender !== false) {
    render();
  }
}

function selectAssignmentClass(classId) {
  var classRecord = findClass(classId);
  var locationId = readClassLocationId(classRecord);

  state.assignmentForm.targetType = "class";
  state.assignmentForm.locationId = locationId;
  state.assignmentForm.classId = classId || "";
  state.assignmentForm.studentId = "";
  state.assignmentForm.targetId = classId || "";
  closeAssignmentTargetPicker(false);
  setState({ message: "Class target selected.", messageType: "success" });
}

function selectAssignmentStudent(studentId) {
  var student = findAssignmentPickerStudent(studentId);
  var locationId = readStudentLocationId(student);
  var classId = student ? readSafeString(student.classId) : "";

  state.assignmentForm.targetType = "student";
  state.assignmentForm.locationId = locationId;
  state.assignmentForm.classId = classId;
  state.assignmentForm.studentId = studentId || "";
  state.assignmentForm.targetId = studentId || "";
  closeAssignmentTargetPicker(false);
  setState({ message: "Student target selected.", messageType: "success" });
}

function openDeleteAssignmentModal(assignmentId) {
  setState({
    assignmentDelete: {
      assignmentId: assignmentId || "",
      status: "",
      message: ""
    },
    message: ""
  });
}

function closeDeleteAssignmentModal() {
  setState({
    assignmentDelete: {
      assignmentId: "",
      status: "",
      message: ""
    }
  });
}

async function deleteAssignmentWithConfirmation() {
  var assignmentId = state.assignmentDelete.assignmentId;

  if (!assignmentId) {
    closeDeleteAssignmentModal();
    return;
  }

  setState({
    isSaving: true,
    pendingAction: "delete-assignment:" + assignmentId,
    assignmentDelete: {
      assignmentId: assignmentId,
      status: "deleting",
      message: "Deleting assignment..."
    }
  });

  var result = await runAdminIntent("DeleteCourseAssignmentIntent", { assignmentId: assignmentId });

  if (isSuccess(result)) {
    setState({
      isSaving: false,
      pendingAction: "",
      assignmentDelete: {
        assignmentId: assignmentId,
        status: "deleted",
        message: "Assignment deleted."
      },
      message: "Course assignment deleted.",
      messageType: "success"
    });
    await waitForMilliseconds(650);
    closeDeleteAssignmentModal();
    await refreshAllData();
    setState({ message: "Course assignment deleted.", messageType: "success" });
    return;
  }

  setState({
    isSaving: false,
    pendingAction: "",
    assignmentDelete: {
      assignmentId: assignmentId,
      status: "",
      message: ""
    },
    message: readIntentError(result),
    messageType: "error"
  });
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

async function updateUserStatus(userId, status) {
  if (!userId) {
    setState({ message: "Choose a user first.", messageType: "error" });
    return false;
  }

  try {
    setState({ isSaving: true, pendingAction: "disable-user:" + userId, message: "Updating user status...", messageType: "info" });
    await setDoc(doc(db, "users", userId), {
      status: status,
      updatedAt: serverTimestamp()
    }, { merge: true });
    setState({ isSaving: false, pendingAction: "", activeUserId: "", message: "User disabled.", messageType: "success" });
    await refreshAllData();
    setState({ message: "User disabled.", messageType: "success" });
    return true;
  } catch (error) {
    setState({ isSaving: false, pendingAction: "", message: "Could not update user status: " + (error.message || "Unknown error"), messageType: "error" });
    return false;
  }
}

async function deleteUserProfile(userId) {
  var user = findUser(userId);
  var label = user ? (user.displayName || user.email || user.id) : userId;

  if (!userId) {
    setState({ message: "Choose a user first.", messageType: "error" });
    return false;
  }

  if (!window.confirm("Delete user profile for " + label + "? This removes the Firestore profile but does not delete the Firebase Auth account.")) {
    return false;
  }

  try {
    setState({ isSaving: true, pendingAction: "delete-user:" + userId, message: "Deleting user profile...", messageType: "info" });
    await deleteDoc(doc(db, "users", userId));
    setState({ isSaving: false, pendingAction: "", activeUserId: "", message: "User profile deleted.", messageType: "success" });
    await refreshAllData();
    setState({ message: "User profile deleted.", messageType: "success" });
    return true;
  } catch (error) {
    setState({ isSaving: false, pendingAction: "", message: "Could not delete user profile: " + (error.message || "Unknown error"), messageType: "error" });
    return false;
  }
}

function openFruitPasswordReset(userId) {
  var fruitPassword = createRandomFruitPassword();
  var user = getSafeUser(findUser(userId));

  if (!userId || user.roles.indexOf("student") === -1) {
    setState({ message: "Fruit password reset is only available for student users.", messageType: "error" });
    return;
  }

  setState({ resetStudentId: userId, resetFruitPassword: fruitPassword, fruitResetSaveStatus: "", fruitResetSaveMessage: "", message: "" });
}

async function sendStaffPasswordReset(userId) {
  var user = getSafeUser(findUser(userId));

  if (!user.email) {
    setState({ message: "This user does not have an email address for password reset.", messageType: "error" });
    return false;
  }

  if (user.roles.indexOf("student") !== -1 && user.roles.length === 1) {
    setState({ message: "Student-only users use fruit login. Use Reset Fruit instead.", messageType: "error" });
    return false;
  }

  try {
    setState({ isSaving: true, pendingAction: "send-password-reset:" + userId, message: "Sending Firebase password reset email...", messageType: "info" });
    await sendPasswordResetEmail(auth, user.email);
    setState({ isSaving: false, pendingAction: "", message: "Firebase password reset email sent to " + user.email + ".", messageType: "success" });
    return true;
  } catch (error) {
    setState({ isSaving: false, pendingAction: "", message: "Could not send password reset email: " + (error.message || "Unknown error"), messageType: "error" });
    return false;
  }
}

function createRandomFruitPassword() {
  var values = [];

  while (values.length < 4) {
    values.push(fruits[Math.floor(Math.random() * fruits.length)]);
  }

  return values;
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
    setState({ fruitResetSaveStatus: "error", fruitResetSaveMessage: "Choose a student and exactly four fruits.", message: "", messageType: "error" });
    return;
  }

  var fruitPassword = state.resetFruitPassword.slice();
  var studentId = state.resetStudentId;
  var result = null;

  setState({
    isSaving: true,
    pendingAction: "confirm-reset-fruit",
    fruitResetSaveStatus: "saving",
    fruitResetSaveMessage: "Saving fruit password...",
    message: ""
  });

  result = await runAdminIntent("ResetStudentFruitPasswordIntent", {
    studentId: state.resetStudentId,
    fruitPassword: fruitPassword
  });

  if (isSuccess(result)) {
    var student = findStudent(studentId) || findUser(studentId);
    var label = fruitPassword.map(readFruitLabel).join(" ");

    setState({
      isSaving: false,
      pendingAction: "",
      fruitResetSaveStatus: "saved",
      fruitResetSaveMessage: "Fruit password saved!"
    });

    await waitForMilliseconds(900);

    if (state.resetStudentId !== studentId || state.fruitResetSaveStatus !== "saved") {
      return;
    }

    setState({
      resetStudentId: "",
      resetFruitPassword: [],
      fruitResetSaveStatus: "",
      fruitResetSaveMessage: "",
      message: "Fruit password reset for " + ((student && (student.name || student.displayName)) || "student") + ": " + label,
      messageType: "success"
    });

    await refreshAllData();
    setState({ message: "Fruit password reset for " + ((student && (student.name || student.displayName)) || "student") + ": " + label, messageType: "success" });
    return;
  }

  setState({
    isSaving: false,
    pendingAction: "",
    fruitResetSaveStatus: "error",
    fruitResetSaveMessage: readIntentError(result),
    message: "",
    messageType: "error"
  });
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
    classId: "",
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
  return {
    assignmentType: "course",
    courseId: "",
    moduleId: "",
    targetType: "class",
    targetId: "",
    locationId: "",
    classId: "",
    studentId: "",
    status: "active",
    startsAt: null,
    dueAt: null,
    visibility: "visible"
  };
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

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(readSafeString(value).trim());
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

function readExecutiveMetrics() {
  var locations = readOverviewLocations();
  var teacherCount = readTeacherCount();
  var points = readTotalIntentionPoints();
  var engagement = readAverageEngagement();

  return [
    { label: "Total Schools / Locations", value: formatNumber(locations.length), icon: "⌂", color: "#2563eb", tone: "blue", change: formatChange(readCreatedChange(locations)), changeTone: readChangeTone(readCreatedChange(locations)), sparkline: countGrowthByBucket(locations, makeDateBuckets("week")) },
    { label: "Total Students", value: formatNumber(state.students.length), icon: "✦", color: "#14b8a6", tone: "teal", change: formatChange(readCreatedChange(state.students)), changeTone: readChangeTone(readCreatedChange(state.students)), sparkline: countGrowthByBucket(state.students, makeDateBuckets("week")) },
    { label: "Total Teachers", value: formatNumber(teacherCount), icon: "✎", color: "#f59e0b", tone: "amber", change: formatChange(readCreatedChange(readTeacherRecords())), changeTone: readChangeTone(readCreatedChange(readTeacherRecords())), sparkline: countGrowthByBucket(readTeacherRecords(), makeDateBuckets("week")) },
    { label: "Intention Points Earned", value: formatNumber(points), icon: "◆", color: "#8b5cf6", tone: "purple", change: formatChange(readActivityChange()), changeTone: readChangeTone(readActivityChange()), sparkline: buildPointSparkline() },
    { label: "Avg. Engagement", value: engagement + "%", icon: "⌁", color: "#f43f5e", tone: "rose", change: formatChange(readEngagementChange()), changeTone: readChangeTone(readEngagementChange()), sparkline: buildEngagementSeries("week").primary }
  ];
}

function readOverviewLocations() {
  var locations = state.locations.map(getSafeLocation);

  if (state.overviewRegionFilter) {
    locations = locations.filter(function (location) {
      return readSafeString(location.region || "Unassigned") === state.overviewRegionFilter;
    });
  }

  if (state.overviewSchoolTypeFilter) {
    locations = locations.filter(function (location) {
      return readSafeString(location.type || "Private location") === state.overviewSchoolTypeFilter;
    });
  }

  return locations;
}

function readUniqueLocationValues(field) {
  var values = [];
  var index = 0;

  while (index < state.locations.length) {
    var location = getSafeLocation(state.locations[index]);
    var value = field === "type" ? readSafeString(location.type || "Private location") : readSafeString(location.region || "Unassigned");
    if (value && values.indexOf(value) === -1) {
      values.push(value);
    }
    index = index + 1;
  }

  return values.sort();
}

function readTeacherRecords() {
  return state.users.map(getSafeUser).filter(function (user) {
    return user.roles.indexOf("teacher") !== -1;
  });
}

function readTeacherCount() {
  var teachers = readTeacherRecords();

  if (teachers.length > 0) {
    return teachers.length;
  }

  return countUniqueTeacherIds();
}

function countUniqueTeacherIds() {
  var ids = [];
  var index = 0;

  while (index < state.classes.length) {
    addUniqueId(ids, state.classes[index].teacherId);
    addUniqueId(ids, state.classes[index].teacherUid);
    addUniqueId(ids, state.classes[index].primaryTeacherId);
    if (Array.isArray(state.classes[index].teacherIds)) {
      var teacherIndex = 0;
      while (teacherIndex < state.classes[index].teacherIds.length) {
        addUniqueId(ids, state.classes[index].teacherIds[teacherIndex]);
        teacherIndex = teacherIndex + 1;
      }
    }
    index = index + 1;
  }

  return ids.length;
}

function addUniqueId(ids, id) {
  var safeId = readSafeString(id);
  if (safeId && ids.indexOf(safeId) === -1) {
    ids.push(safeId);
  }
}

function readTotalIntentionPoints() {
  var studentPoints = sumBy(state.students, readPointsFromRecord);
  var activityPoints = sumBy(state.overviewData.activityLogs, readPointsFromRecord);
  var auditPoints = sumBy(state.overviewData.auditLogs, readPointsFromRecord);
  return studentPoints + activityPoints + auditPoints;
}

function readAverageEngagement() {
  var values = [];
  var index = 0;

  while (index < state.students.length) {
    var value = readEngagementFromRecord(state.students[index]);
    if (value !== null) {
      values.push(value);
    }
    index = index + 1;
  }

  if (values.length === 0) {
    return readDerivedEngagementPercent();
  }

  return Math.round(sumBy(values, function (value) { return value; }) / values.length);
}

function readDerivedEngagementPercent() {
  var checklist = buildCompletionChecklist();
  var complete = countItems(checklist, function (item) { return item.status === "complete"; });
  var warning = countItems(checklist, function (item) { return item.status === "warning"; });

  if (checklist.length === 0) {
    return 0;
  }

  return Math.round(((complete + warning * 0.5) / checklist.length) * 100);
}

function readPointsFromRecord(record) {
  return readFirstNumber(record, ["intentionPoints", "pointsEarned", "points", "totalPoints", "rewardPoints", "xp"]);
}

function readEngagementFromRecord(record) {
  var value = readFirstNumber(record, ["engagement", "engagementScore", "engagementPercent", "completionRate", "progress"]);

  if (!value) {
    return value === 0 ? 0 : null;
  }

  if (value > 0 && value <= 1) {
    return Math.round(value * 100);
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function readFirstNumber(record, keys) {
  var index = 0;

  while (index < keys.length) {
    var value = record ? record[keys[index]] : null;
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
    index = index + 1;
  }

  return 0;
}

function buildPointSparkline() {
  var buckets = makeDateBuckets("week");
  var values = [];
  var index = 0;

  while (index < buckets.length) {
    values.push(sumRecordsByBucket(state.overviewData.activityLogs.concat(state.students), buckets[index], readPointsFromRecord));
    index = index + 1;
  }

  return values;
}

function readCreatedChange(items) {
  var now = Date.now();
  var currentStart = now - (30 * 24 * 60 * 60 * 1000);
  var previousStart = now - (60 * 24 * 60 * 60 * 1000);
  var current = 0;
  var previous = 0;
  var index = 0;

  while (index < items.length) {
    var createdAt = getCreatedAtMillis(items[index]);
    if (createdAt && createdAt >= currentStart) {
      current = current + 1;
    } else if (createdAt && createdAt >= previousStart) {
      previous = previous + 1;
    }
    index = index + 1;
  }

  return current - previous;
}

function readActivityChange() {
  var current = sumRecentRecords(state.overviewData.activityLogs, 30, readPointsFromRecord);
  var previous = sumPreviousRecords(state.overviewData.activityLogs, 30, readPointsFromRecord);
  return current - previous;
}

function readEngagementChange() {
  var series = buildEngagementSeries("month").primary;

  if (series.length < 2) {
    return 0;
  }

  return Math.round(series[series.length - 1] - series[0]);
}

function formatChange(value) {
  if (value > 0) {
    return "+" + formatNumber(value) + " this period";
  }

  if (value < 0) {
    return formatNumber(value) + " this period";
  }

  return "Stable this period";
}

function readChangeTone(value) {
  if (value > 0) {
    return "is-positive";
  }

  if (value < 0) {
    return "is-negative";
  }

  return "is-neutral";
}

function buildEngagementChart(range) {
  var series = buildEngagementSeries(range);
  var maxValue = Math.max(100, maxArrayValue(series.primary), maxArrayValue(series.secondary));

  if (series.primary.length === 0 || (maxArrayValue(series.primary) === 0 && maxArrayValue(series.secondary) === 0)) {
    return { isEmpty: true, svg: "" };
  }

  return {
    isEmpty: false,
    svg: buildTwoLineSvg(series.primary, series.secondary, series.labels, maxValue)
  };
}

function buildEngagementSeries(range) {
  var buckets = makeDateBuckets(range);
  var primary = [];
  var secondary = [];
  var labels = [];
  var activityLogs = state.overviewData.activityLogs;
  var index = 0;

  while (index < buckets.length) {
    var activityCount = countRecordsInBucket(activityLogs, buckets[index]);
    var createdStudents = countRecordsInBucket(state.students, buckets[index]);
    primary.push(activityCount > 0 ? activityCount : Math.max(0, createdStudents * 8));
    secondary.push(countGrowthByBucket(state.students, buckets)[index]);
    labels.push(buckets[index].label);
    index = index + 1;
  }

  if (maxArrayValue(primary) === 0 && state.students.length > 0) {
    primary = primary.map(function (_value, valueIndex) {
      return Math.round((valueIndex + 1) * (readAverageEngagement() / primary.length));
    });
  }

  return { primary: primary, secondary: secondary, labels: labels };
}

function buildTwoLineSvg(primary, secondary, labels, maxValue) {
  var width = 760;
  var height = 280;
  var left = 42;
  var right = 18;
  var top = 20;
  var bottom = 42;
  var plotWidth = width - left - right;
  var plotHeight = height - top - bottom;
  var html = '<svg class="sa-growth-svg sa-engagement-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Engagement over time">';
  var gridIndex = 0;

  while (gridIndex <= 4) {
    var y = top + (plotHeight / 4) * gridIndex;
    html += '<line x1="' + left + '" y1="' + y + '" x2="' + (width - right) + '" y2="' + y + '"></line>';
    gridIndex = gridIndex + 1;
  }

  html += '<polyline points="' + escapeHtml(buildPolylinePoints(secondary, labels.length, left, top, plotWidth, plotHeight, maxValue)) + '" style="stroke:#14b8a6"></polyline>';
  html += '<polyline points="' + escapeHtml(buildPolylinePoints(primary, labels.length, left, top, plotWidth, plotHeight, maxValue)) + '" style="stroke:#6366f1"></polyline>';

  var labelIndexes = [0, Math.floor((labels.length - 1) / 2), labels.length - 1];
  var index = 0;
  while (index < labelIndexes.length) {
    var bucketIndex = labelIndexes[index];
    var x = left + (labels.length === 1 ? 0 : (plotWidth / (labels.length - 1)) * bucketIndex);
    html += '<text class="sa-chart-label" x="' + x + '" y="' + (height - 12) + '">' + escapeHtml(labels[bucketIndex]) + '</text>';
    index = index + 1;
  }

  html += '</svg>';
  return html;
}

function readIntentionCategoryData() {
  var stats = readLearningActivityStats();
  var points = readTotalIntentionPoints();

  return [
    { label: "Lessons", value: Math.max(stats.lessonsCompleted * 10, Math.round(points * 0.38)), color: "#6366f1" },
    { label: "Quests", value: Math.max(stats.questsCompleted * 15, Math.round(points * 0.24)), color: "#14b8a6" },
    { label: "Projects", value: Math.max(stats.projectsSubmitted * 25, Math.round(points * 0.22)), color: "#f59e0b" },
    { label: "Activities", value: Math.max(stats.activitiesLogged * 4, Math.round(points * 0.16)), color: "#f43f5e" }
  ];
}

function readLearningActivityStats() {
  return {
    lessonsCompleted: countCompletedLearningItems(state.overviewData.modules.concat(state.courses), ["completedCount", "lessonsCompleted", "completionCount"]),
    questsCompleted: countCompletedLearningItems(state.assignments, ["questsCompleted", "completedQuests", "completionCount"]),
    projectsSubmitted: countCompletedLearningItems(state.assignments.concat(state.overviewData.activityLogs), ["projectsSubmitted", "submissions", "submissionCount"]),
    activitiesLogged: state.overviewData.activityLogs.length + state.overviewData.auditLogs.length
  };
}

function countCompletedLearningItems(items, keys) {
  var total = 0;
  var index = 0;

  while (index < items.length) {
    total += readFirstNumber(items[index], keys);
    if (readSafeString(items[index].status).toLowerCase() === "completed") {
      total += 1;
    }
    index = index + 1;
  }

  return total;
}

function readSchoolsByRegion() {
  var counts = {};
  var locations = readOverviewLocations();
  var index = 0;

  while (index < locations.length) {
    var region = readSafeString(locations[index].region || "Unassigned");
    counts[region] = (counts[region] || 0) + 1;
    index = index + 1;
  }

  return Object.keys(counts).map(function (region) {
    return { region: region, count: counts[region] };
  }).sort(function (a, b) {
    return b.count - a.count || a.region.localeCompare(b.region);
  });
}

function readTopSchools() {
  var studentCounts = countStudentsByLocation();
  var pointCounts = sumPointsByLocation();
  var locations = readOverviewLocations();

  return locations.map(function (location) {
    var students = studentCounts[location.id] || 0;
    var points = pointCounts[location.id] || 0;
    var engagement = students ? Math.min(100, Math.round((points / Math.max(students, 1)) / 10) + 62) : readDerivedEngagementPercent();
    return {
      id: location.id,
      name: location.name || location.id || "Untitled location",
      students: students,
      engagement: engagement,
      points: points,
      trend: engagement >= 75 ? "Rising" : (engagement >= 50 ? "Steady" : "Needs focus")
    };
  }).sort(function (a, b) {
    return b.engagement - a.engagement || b.points - a.points || b.students - a.students;
  });
}

function countStudentsByLocation() {
  var classLocations = {};
  var counts = {};
  var classIndex = 0;

  while (classIndex < state.classes.length) {
    classLocations[state.classes[classIndex].id] = state.classes[classIndex].locationId;
    classIndex = classIndex + 1;
  }

  var studentIndex = 0;
  while (studentIndex < state.students.length) {
    var locationId = state.students[studentIndex].locationId || classLocations[state.students[studentIndex].classId];
    addCount(counts, locationId);
    studentIndex = studentIndex + 1;
  }

  return counts;
}

function sumPointsByLocation() {
  var classLocations = {};
  var counts = {};
  var classIndex = 0;

  while (classIndex < state.classes.length) {
    classLocations[state.classes[classIndex].id] = state.classes[classIndex].locationId;
    classIndex = classIndex + 1;
  }

  var studentIndex = 0;
  while (studentIndex < state.students.length) {
    var locationId = state.students[studentIndex].locationId || classLocations[state.students[studentIndex].classId];
    counts[locationId] = (counts[locationId] || 0) + readPointsFromRecord(state.students[studentIndex]);
    studentIndex = studentIndex + 1;
  }

  return counts;
}

function readExecutiveSummary() {
  var issues = readOverviewIssues();
  var criticalIssues = issues.studentsMissingCredentials + issues.locationsMissingSlugs + issues.locationsWithNoClasses;
  var summary = criticalIssues > 0
    ? "OquWay is operational, with " + criticalIssues + " priority setup items requiring leadership attention."
    : "OquWay is operational with core setup signals in healthy shape.";

  return {
    summary: summary,
    studentGrowth: formatChange(readCreatedChange(state.students)).replace(" this period", ""),
    teacherGrowth: formatChange(readCreatedChange(readTeacherRecords())).replace(" this period", ""),
    engagementGrowth: formatChange(readEngagementChange()).replace(" this period", ""),
    nextSteps: readNextSteps()
  };
}

function readNextSteps() {
  var issues = buildActionCenterItems().sort(compareActionPriority);
  var steps = [];
  var index = 0;

  while (index < issues.length && steps.length < 3) {
    if (issues[index].count > 0) {
      steps.push(issues[index].message);
    }
    index = index + 1;
  }

  if (steps.length === 0) {
    steps.push("Review analytics weekly");
    steps.push("Expand school onboarding");
    steps.push("Keep login tools ready for classrooms");
  }

  return steps;
}

function readPlatformHealth() {
  var learningReady = state.courses.length > 0 || state.overviewData.modules.length > 0;
  var analyticsReady = state.overviewData.activityLogs.length > 0 || state.overviewData.auditLogs.length > 0;
  var rewardReady = readTotalIntentionPoints() > 0 || state.students.length > 0;

  return [
    { label: "Authentication Service", tone: auth.currentUser ? "good" : "danger", status: auth.currentUser ? "Online" : "Needs sign-in" },
    { label: "Database", tone: state.overviewData.lastRefreshAt ? "good" : "warning", status: state.overviewData.lastRefreshAt ? "Connected" : "No successful load" },
    { label: "Storage", tone: state.overviewData.storageAvailable ? "good" : "warning", status: state.overviewData.storageAvailable ? "Configured" : "Config unavailable" },
    { label: "Learning Engine", tone: learningReady ? "good" : "warning", status: learningReady ? "Content loaded" : "Awaiting content" },
    { label: "Reward System", tone: rewardReady ? "good" : "warning", status: rewardReady ? "Ready" : "Awaiting learner activity" },
    { label: "Analytics Service", tone: analyticsReady ? "good" : "warning", status: analyticsReady ? "Signals available" : "Using fallback signals" }
  ];
}

function compareActionPriority(a, b) {
  var toneRank = { danger: 3, warning: 2, muted: 1, good: 0 };
  return (toneRank[b.tone] || 0) - (toneRank[a.tone] || 0) || b.count - a.count;
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

function buildSparklineSvg(values, color) {
  var safeValues = values && values.length ? values : [0, 0, 0, 0, 0, 0, 0];
  var maxValue = Math.max(1, maxArrayValue(safeValues));
  var points = buildPolylinePoints(safeValues, safeValues.length, 4, 4, 112, 28, maxValue);

  return '<svg class="sa-sparkline" viewBox="0 0 120 36" aria-hidden="true"><polyline points="' + escapeHtml(points) + '" style="stroke:' + escapeHtml(color) + '"></polyline></svg>';
}

function buildDonutSvg(data, total) {
  var radius = 45;
  var circumference = 2 * Math.PI * radius;
  var offset = 0;
  var html = '<svg class="sa-donut-svg" viewBox="0 0 120 120" role="img" aria-label="Intention points by category"><circle class="sa-donut-track" cx="60" cy="60" r="' + radius + '"></circle>';
  var index = 0;

  while (index < data.length) {
    var length = total ? (data[index].value / total) * circumference : 0;
    html += '<circle class="sa-donut-segment" cx="60" cy="60" r="' + radius + '" stroke="' + escapeHtml(data[index].color) + '" stroke-dasharray="' + length + ' ' + (circumference - length) + '" stroke-dashoffset="' + (-offset) + '"></circle>';
    offset += length;
    index = index + 1;
  }

  html += '</svg>';
  return html;
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

function sumBy(items, reader) {
  var total = 0;
  var index = 0;

  while (index < items.length) {
    total += reader(items[index]) || 0;
    index = index + 1;
  }

  return total;
}

function maxArrayValue(values) {
  var maxValue = 0;
  var index = 0;

  while (index < values.length) {
    if (values[index] > maxValue) {
      maxValue = values[index];
    }
    index = index + 1;
  }

  return maxValue;
}

function countRecordsInBucket(items, bucket) {
  var count = 0;
  var index = 0;

  while (index < items.length) {
    var time = normalizeTimestamp(items[index].createdAt || items[index].updatedAt || items[index].timestamp);
    if (time && time >= bucket.start && time <= bucket.end) {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}

function sumRecordsByBucket(items, bucket, reader) {
  var total = 0;
  var index = 0;

  while (index < items.length) {
    var time = normalizeTimestamp(items[index].createdAt || items[index].updatedAt || items[index].timestamp);
    if (time && time >= bucket.start && time <= bucket.end) {
      total += reader(items[index]) || 0;
    }
    index = index + 1;
  }

  return total;
}

function sumRecentRecords(items, days, reader) {
  var now = Date.now();
  var start = now - (days * 24 * 60 * 60 * 1000);
  var total = 0;
  var index = 0;

  while (index < items.length) {
    var time = normalizeTimestamp(items[index].createdAt || items[index].updatedAt || items[index].timestamp);
    if (time && time >= start) {
      total += reader(items[index]) || 0;
    }
    index = index + 1;
  }

  return total;
}

function sumPreviousRecords(items, days, reader) {
  var now = Date.now();
  var currentStart = now - (days * 24 * 60 * 60 * 1000);
  var previousStart = now - (days * 2 * 24 * 60 * 60 * 1000);
  var total = 0;
  var index = 0;

  while (index < items.length) {
    var time = normalizeTimestamp(items[index].createdAt || items[index].updatedAt || items[index].timestamp);
    if (time && time >= previousStart && time < currentStart) {
      total += reader(items[index]) || 0;
    }
    index = index + 1;
  }

  return total;
}

function formatNumber(value) {
  return Math.round(value || 0).toLocaleString();
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
    var matchesRole = userMatchesRoleFilter(user, state.userFilters.role);
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

function userMatchesRoleFilter(user, roleFilter) {
  var safeFilter = readSafeString(roleFilter);
  var card = findRoleFilterCard(safeFilter);
  var roles = user && Array.isArray(user.roles) ? user.roles : [];
  var index = 0;

  if (!safeFilter) {
    return true;
  }

  if (!card || card.roles.length === 0) {
    return roles.indexOf(safeFilter) !== -1;
  }

  while (index < card.roles.length) {
    if (roles.indexOf(card.roles[index]) !== -1) {
      return true;
    }
    index = index + 1;
  }

  return false;
}

function findRoleFilterCard(roleFilter) {
  var index = 0;

  while (index < roleFilterCards.length) {
    if (roleFilterCards[index].key === readSafeString(roleFilter)) {
      return roleFilterCards[index];
    }
    index = index + 1;
  }

  return roleFilterCards[0];
}

function readUsersByRole(role) {
  var users = [];
  var index = 0;

  while (index < state.users.length) {
    var user = getSafeUser(state.users[index]);

    if (user.roles.indexOf(role) !== -1) {
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

  if (label.indexOf("Send") !== -1) {
    return "Sending...";
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
    classId: readSafeString(safeUser.classId),
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
    classId: safeUser.classId,
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
    classId: readSafeString(safeForm.classId).trim(),
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
    locationId: payload.primaryLocationId,
    status: payload.status,
    name: payload.displayName,
    classId: payload.classId,
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

function findAssignment(id) {
  return findById(state.assignments, id);
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

function readUserClassSummary(user) {
  var safeUser = getSafeUser(user);
  var classIds = safeUser.classIds.slice();

  if (safeUser.classId && classIds.indexOf(safeUser.classId) === -1) {
    classIds.unshift(safeUser.classId);
  }

  if (classIds.length === 0) {
    return "No classes";
  }

  return classIds.map(readClassName).join(", ");
}

function readUserLastActive(user) {
  if (!user) {
    return null;
  }

  return user.lastActiveAt || user.lastLoginAt || user.lastSeenAt || user.updatedAt || user.createdAt || null;
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

function readCourseDescription(course) {
  if (!course) {
    return "";
  }

  if (typeof course.description === "string") {
    return course.description;
  }

  if (course.description && typeof course.description.en === "string") {
    return course.description.en;
  }

  if (typeof course.summary === "string") {
    return course.summary;
  }

  return "";
}

function readCourseModuleCount(course) {
  if (!course) {
    return 0;
  }

  if (Array.isArray(course.modules)) {
    return course.modules.length;
  }

  if (Array.isArray(course.moduleIds)) {
    return course.moduleIds.length;
  }

  if (typeof course.moduleCount === "number") {
    return course.moduleCount;
  }

  return 0;
}

function readCourseUpdatedAt(course) {
  return course ? (course.updatedAt || course.modifiedAt || course.createdAt || null) : null;
}

function readStudentLocationId(student) {
  if (!student) {
    return "";
  }

  return readSafeString(student.locationId || student.primaryLocationId || student.schoolId || (readIdArray(student.locationIds)[0] || ""));
}

function readAssignmentTargetName(assignment) {
  if (!assignment) {
    return "";
  }

  var targetType = assignment.targetType || "class";
  var targetId = assignment.targetId || assignment.classId || assignment.studentId || assignment.locationId;

  if (targetType === "location") {
    return readLocationName(targetId);
  }

  if (targetType === "class") {
    return readClassName(assignment.classId || targetId);
  }

  if (targetType === "student") {
    var student = findStudent(assignment.studentId || targetId);
    return student && student.name ? student.name : targetId;
  }

  return targetId || "";
}

function readAssignmentScopeLine(assignment) {
  var parts = [];

  if (assignment.locationId) {
    parts.push(readLocationName(assignment.locationId));
  }

  if (assignment.classId) {
    parts.push(readClassName(assignment.classId));
  }

  if (assignment.studentId) {
    parts.push("Student ID: " + assignment.studentId);
  }

  if (parts.length === 0 && assignment.targetId) {
    parts.push("Target ID: " + assignment.targetId);
  }

  return parts.join(" / ");
}

function readAssignmentFormTargetSummary(form) {
  if (!form.courseId) {
    return "Choose a course first.";
  }

  if (form.targetType === "student") {
    return "Assign to " + (form.studentId ? readAssignmentStudentName(form.studentId) : "an individual student") + ".";
  }

  return "Assign to " + (form.classId ? readClassName(form.classId) : "a class") + ".";
}

function readAssignmentPickerCourses() {
  var picker = state.assignmentCoursePicker || {};
  var query = readSafeString(picker.searchText).toLowerCase();
  var statusFilter = readSafeString(picker.statusFilter);

  return state.courses.filter(function (course) {
    var status = readSafeString(course.status || "draft");
    var text = [readCourseTitle(course), readCourseDescription(course), course.id].join(" ").toLowerCase();

    return (!statusFilter || status === statusFilter)
      && (!query || text.indexOf(query) !== -1);
  }).sort(function (a, b) {
    return readCourseTitle(a).localeCompare(readCourseTitle(b));
  });
}

function readAssignmentPickerClasses() {
  var picker = state.assignmentTargetPicker || {};
  var query = readSafeString(picker.searchText).toLowerCase();

  return state.classes.filter(function (classRecord) {
    var locationId = readClassLocationId(classRecord);
    var locationMatches = picker.includeAllLocations || !picker.locationId || locationId === picker.locationId;
    var text = [readClassName(classRecord.id), classRecord.id, readLocationName(locationId)].join(" ").toLowerCase();

    return locationMatches && (!query || text.indexOf(query) !== -1);
  }).sort(function (a, b) {
    return readClassName(a.id).localeCompare(readClassName(b.id));
  });
}

function readAssignmentPickerClassesForFilter() {
  var picker = state.assignmentTargetPicker || {};

  return state.classes.filter(function (classRecord) {
    var locationId = readClassLocationId(classRecord);
    return picker.includeAllLocations || !picker.locationId || locationId === picker.locationId;
  }).sort(function (a, b) {
    return readClassName(a.id).localeCompare(readClassName(b.id));
  });
}

function readAssignmentPickerStudents() {
  var picker = state.assignmentTargetPicker || {};
  var query = readSafeString(picker.searchText).toLowerCase();

  return readAssignmentCandidateStudents().filter(function (student) {
    var locationId = readStudentLocationId(student);
    var locationMatches = picker.includeAllLocations || !picker.locationId || locationId === picker.locationId;
    var classMatches = !picker.classId || readSafeString(student.classId) === picker.classId || readIdArray(student.classIds).indexOf(picker.classId) !== -1;
    var text = [student.name, student.displayName, student.email, student.username, student.id, readClassName(student.classId), readLocationName(locationId)].join(" ").toLowerCase();

    return locationMatches && classMatches && (!query || text.indexOf(query) !== -1);
  }).sort(function (a, b) {
    return (a.name || a.displayName || a.id).localeCompare(b.name || b.displayName || b.id);
  });
}

function readAssignmentCandidateStudents() {
  var students = state.students.slice();

  state.users.forEach(function (user) {
    var safeUser = getSafeUser(user);
    var exists = findById(students, safeUser.id);

    if (!exists && safeUser.roles.indexOf("student") !== -1) {
      students.push(Object.assign({}, user, {
        name: user.name || user.displayName || user.email || user.id,
        locationId: user.locationId || user.primaryLocationId || (safeUser.locationIds.length > 0 ? safeUser.locationIds[0] : ""),
        classId: user.classId || (safeUser.classIds.length > 0 ? safeUser.classIds[0] : "")
      }));
    }
  });

  return students;
}

function findAssignmentPickerStudent(studentId) {
  return findById(readAssignmentCandidateStudents(), studentId);
}

function buildAssignmentPayload(form) {
  var payload = Object.assign({}, form);

  payload.targetId = form.targetType === "student" ? form.studentId : form.classId;
  payload.assignmentType = payload.assignmentType || "course";
  payload.visibility = payload.visibility || "visible";

  return payload;
}

function readAssignmentStudentName(studentId) {
  var student = findStudent(studentId);

  return student ? (student.name || student.displayName || student.id) : studentId;
}

function canCreateAssignment() {
  var form = state.assignmentForm;

  if (!form.courseId || !form.locationId) {
    return false;
  }

  if (form.targetType === "student") {
    return !!form.studentId;
  }

  return !!form.classId;
}

function readAssignmentStats() {
  var activeAssignments = state.assignments.filter(function (assignment) { return (assignment.status || "active") === "active"; });
  var courseIds = [];
  var classIds = [];
  var studentIds = [];
  var index = 0;

  while (index < activeAssignments.length) {
    addUniqueValue(courseIds, activeAssignments[index].courseId);
    if ((activeAssignments[index].targetType || "class") === "class") {
      addUniqueValue(classIds, activeAssignments[index].classId || activeAssignments[index].targetId);
      addStudentsForClass(studentIds, activeAssignments[index].classId || activeAssignments[index].targetId);
    }
    if (activeAssignments[index].targetType === "student") {
      addUniqueValue(studentIds, activeAssignments[index].studentId || activeAssignments[index].targetId);
    }
    index = index + 1;
  }

  return {
    active: activeAssignments.length,
    courses: courseIds.length,
    classes: classIds.length,
    students: studentIds.length
  };
}

function addStudentsForClass(studentIds, classId) {
  var index = 0;

  if (!classId) {
    return;
  }

  while (index < state.students.length) {
    if (studentBelongsToClass(state.students[index], classId)) {
      addUniqueValue(studentIds, state.students[index].id || state.students[index].studentId);
    }
    index = index + 1;
  }
}

function studentBelongsToClass(student, classId) {
  return student
    && (student.classId === classId
      || readIdArray(student.classIds).indexOf(classId) !== -1
      || readIdArray(student.assignedClasses).indexOf(classId) !== -1
      || readIdArray(student.classRefs).indexOf(classId) !== -1);
}

function addUniqueValue(values, value) {
  if (value && values.indexOf(value) === -1) {
    values.push(value);
  }
}

function readIdArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value;
}

function readAdminName() {
  if (state.admin && state.admin.name && isSuperAdminRole(state.admin.role) && adminEmailMatchesActor()) {
    return state.admin.name;
  }

  if (state.actor && state.actor.email) {
    return state.actor.email;
  }

  return "Super Admin";
}

function adminEmailMatchesActor() {
  if (!state.admin || !state.actor) {
    return false;
  }

  if (!state.admin.email || !state.actor.email) {
    return true;
  }

  return state.admin.email.toLowerCase() === state.actor.email.toLowerCase();
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
