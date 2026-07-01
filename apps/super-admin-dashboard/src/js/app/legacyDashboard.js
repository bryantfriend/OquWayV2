import { getIdTokenResult, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, collection, db, deleteDoc, doc, functions, getDoc, getDocs, httpsCallable, serverTimestamp, setDoc, storage } from "../../../../../packages/firebase/index.js?v=1.1.82-shared-command-center-shell";
import { getIntentDefinition, runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.82-shared-command-center-shell";
import { collectUserRoles, getUserProfile, isTeacherUser, normalizeRoles, normalizeUserRole } from "../../../../../packages/domain/users/index.js?v=1.1.82-shared-command-center-shell";
import { COURSE_CREATOR_URL, roleFilterCards, userRoleFilterOptions, userStatuses } from "../../../../../packages/shared/constants/admin.js?v=1.1.82-shared-command-center-shell";
import { userRoles } from "../../../../../packages/shared/constants/roles.js?v=1.1.82-shared-command-center-shell";
import { createCommandCenterDangerZone, createCommandCenterHeader, createCommandCenterKpiGrid, createCommandCenterShell, createCommandCenterTabs, createEmptyState, createStatusBadge } from "../../../../../packages/ui/index.js?v=1.1.82-shared-command-center-shell";

var appElement = document.getElementById("app");
var appVersion = "1.1.85";
var adminCallableFunctions = functions;
var state = {
  isLoading: true,
  isRefreshing: false,
  isSaving: false,
  pendingAction: "",
  activeLocationId: "",
  locationCreateOpen: false,
  locationCommandCenter: createLocationCommandCenterState(),
  classCommandCenter: createClassCommandCenterState(),
  userCommandCenter: createUserCommandCenterState(),
  courseCommandCenter: createCourseCommandCenterState(),
  moduleCommandCenter: createModuleCommandCenterState(),
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
  userFilters: createUserFilters(),
  assignmentFilters: {
    courseId: "",
    targetType: "",
    status: ""
  },
  locationForm: createLocationForm(),
  userForm: createUserForm(),
  activeUserId: "",
  userCreateOpen: false,
  userEditModal: createUserEditModalState(),
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
  assignmentStaffPicker: {
    isOpen: false,
    assignmentId: "",
    mode: "responsible",
    searchText: "",
    selectedIds: []
  },
  classPicker: {
    isOpen: false,
    formId: "",
    mode: "primary",
    searchText: "",
    includeAllLocations: false,
    selectedIds: []
  },
  classStaffPicker: {
    isOpen: false,
    classId: "",
    mode: "primary",
    searchText: "",
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
      isSaving: false,
      pendingAction: "",
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
    isSaving: false,
    pendingAction: "",
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

    if (!actorHasSuperAdminRole(actor)) {
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
    state.isSaving = false;
    state.pendingAction = "";
    await loadAdminProfile();
    await refreshAllData();
  } catch (error) {
    setState({
      isLoading: false,
      isSaving: false,
      pendingAction: "",
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
    roles: mergeRoleLists([role], tokenResult && tokenResult.claims ? readRolesFromSource(tokenResult.claims) : [], profileResult.roles || []),
    tokenRole: tokenRole,
    profileRole: profileRole,
    profileMissing: profileResult ? profileResult.missing : false
  };
}

function readRoleFromTokenClaims(claims) {
  var roles = readRolesFromSource(claims);
  var role = readPrimaryAdminRole(roles);

  if (isSuperAdminRole(role)) {
    return role;
  }

  return normalizeAdminRole(role);
}

async function loadRoleFromProfile(userId) {
  try {
    var data = await getUserProfile(userId, { authUid: userId });

    if (data) {
      var roles = normalizeRoles(data.roles, data.role || "");
      return {
        role: Array.isArray(data.roles) ? readPrimaryAdminRole(roles) : data.role || "",
        roles: roles,
        missing: false
      };
    }
  } catch (error) {
    throw error;
  }

  return {
    role: "",
    roles: [],
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
    users: dedupeVisibleUserProfiles(overviewData.users.map(getSafeUser)),
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
  var externalTaskResult = await readOptionalCollection("externalTaskSubmissions");

  overviewData.users = usersResult.items;
  overviewData.modules = modulesResult.items;
  overviewData.auditLogs = auditResult.items;
  overviewData.activityLogs = activityResult.items;
  overviewData.externalTaskSubmissions = externalTaskResult.items;
  overviewData.collectionStatus = {
    users: usersResult,
    modules: modulesResult,
    auditLogs: auditResult,
    activityLogs: activityResult,
    externalTaskSubmissions: externalTaskResult
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

  if (!state.actor || !actorHasSuperAdminRole(state.actor)) {
    appElement.innerHTML = buildAccessDeniedView();
    return;
  }

  appElement.innerHTML = buildDashboardView();
}

function buildLoadingView() {
  var title = state.authPhase === "profileLoading" ? "Checking admin access..." : "Loading Super Admin Dashboard";
  var note = state.authPhase === "profileLoading" ? "Verifying your profile and permissions." : "Checking access and loading school data.";

  return '<section class="sa-loading sa-loading-polished" aria-busy="true">'
    + buildMotionLoader("dashboard")
    + '<h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(note) + '</p>'
    + '<div class="sa-loading-steps" aria-hidden="true"><span>Auth</span><span>Profiles</span><span>Classes</span><span>Reports</span></div>'
    + '<div class="sa-skeleton-stack"><span></span><span></span><span></span></div></section>';
}

function buildAccessDeniedView() {
  return '<section class="sa-access-card"><h1>Super Admin Access Required</h1><p>' + escapeHtml(state.message || "Sign in with a super admin or platform admin account.") + '</p><div class="sa-form sa-form-2"><button type="button" class="sa-btn sa-btn-secondary" data-action="go-admin-login">Go to Login</button><button type="button" class="sa-btn" data-action="sign-out">Sign out</button></div></section>';
}

function buildLoginView() {
  return '<section class="sa-access-card sa-login-card"><p class="sa-eyebrow">Admin Login</p><h1>Sign in to Super Admin</h1><p>Use a super admin or platform admin account. We will bring you back here after login.</p>'
    + buildMessage()
    + '<div class="sa-form"><label>Email<input type="email" data-login-field="email" value="' + escapeHtml(state.loginEmail) + '" placeholder="admin@example.com"></label><label><span class="sa-password-label-row"><span>Password</span><button type="button" class="sa-text-link" data-action="open-staff-login-reset">Forgot password?</button></span><input type="password" data-login-field="password" value="' + escapeHtml(state.loginPassword) + '" placeholder="Password"></label><button type="button" class="sa-btn" data-action="admin-login"' + disabled(state.isSaving) + '>' + buildButtonContent("Log in", "admin-login") + '</button><button type="button" class="sa-btn sa-btn-secondary" data-action="go-admin-login">Go to Login</button></div></section>'
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
  html += buildClassCommandCenterModal();
  html += buildUserCommandCenterModal();
  html += buildUserEditModal();
  html += buildCourseCommandCenterModal();
  html += buildModuleCommandCenterModal();
  html += buildClassPickerModal();
  html += buildClassStaffPickerModal();
  html += buildAssignmentCoursePickerModal();
  html += buildAssignmentTargetPickerModal();
  html += buildAssignmentStaffPickerModal();
  html += buildAssignmentDeleteModal();
  html += buildLocationCommandCenterModal();
  html += buildOperationToast();
  html += '</section>';

  return html;
}

function buildMotionLoader(tone) {
  var safeTone = tone || "default";

  return '<div class="sa-motion-loader sa-motion-loader-' + escapeHtml(safeTone) + '" aria-hidden="true">'
    + '<div class="sa-motion-orbit"><span></span><span></span><span></span></div>'
    + '<div class="sa-motion-stack"><i></i><i></i><i></i></div>'
    + '</div>';
}

function buildInlineLoadingState(title, note, tone) {
  return '<div class="sa-inline-loading" aria-busy="true">'
    + buildMotionLoader(tone || "inline")
    + '<div><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(note || "One moment while OquWay prepares this view.") + '</span></div>'
    + '</div>';
}

function buildOperationToast() {
  if (!state.pendingAction || (!state.isSaving && !state.isRefreshing)) {
    return "";
  }

  var details = readOperationDetails();

  return '<aside class="sa-operation-toast" role="status" aria-live="polite" aria-busy="true">'
    + buildMotionLoader("toast")
    + '<div><strong>' + escapeHtml(details.title) + '</strong><span>' + escapeHtml(details.note) + '</span></div>'
    + '</aside>';
}

function readOperationDetails() {
  var action = state.pendingAction || "";

  if (action === "refresh-data") {
    return { title: "Refreshing dashboard", note: "Syncing locations, users, classes, courses, and assignments." };
  }

  if (action === "admin-login") {
    return { title: "Signing in", note: "Checking Firebase Auth and admin access." };
  }

  if (action.indexOf("authorize-teacher-login") === 0) {
    return { title: "Authorizing teacher", note: "Creating claims, profile links, and setup email state." };
  }

  if (action.indexOf("repair-teacher-auth-profile") === 0) {
    return { title: "Repairing login profile", note: "Updating the linked Firebase Auth mirror profile." };
  }

  if (action.indexOf("update-user") === 0 || action.indexOf("create-user") === 0) {
    return { title: "Saving user profile", note: "Writing identity, role, class, and location updates." };
  }

  if (action.indexOf("create-class") === 0 || action.indexOf("update-class") === 0) {
    return { title: "Saving class", note: "Updating class details and location scope." };
  }

  if (action.indexOf("class-staff") === 0) {
    return { title: "Saving class staff", note: "Updating the class teacher and assistant assignments." };
  }

  if (action.indexOf("assignment-staff") === 0) {
    return { title: "Saving course staff", note: "Updating the responsible teacher and assistant assignments." };
  }

  if (action.indexOf("create-student") === 0 || action.indexOf("update-student") === 0) {
    return { title: "Saving student", note: "Updating classroom identity and login readiness." };
  }

  if (action.indexOf("create-location") === 0 || action.indexOf("update-location") === 0) {
    return { title: "Saving location", note: "Checking details and updating the location record." };
  }

  if (action.indexOf("create-assignment") === 0) {
    return { title: "Creating assignment", note: "Connecting the selected course to its learning target." };
  }

  if (action.indexOf("delete-assignment") === 0 || action.indexOf("delete-user") === 0) {
    return { title: "Removing record", note: "Finishing the requested cleanup." };
  }

  if (action.indexOf("send-password-reset") === 0 || action === "staff-login-reset") {
    return { title: "Sending reset email", note: "Asking Firebase Auth to deliver the password reset link." };
  }

  if (action === "confirm-reset-fruit") {
    return { title: "Saving fruit login", note: "Locking in the new classroom password." };
  }

  if (action.indexOf("save-intent") === 0) {
    return { title: "Saving admin update", note: "Running the admin workflow and refreshing state." };
  }

  return { title: "Saving changes", note: "Updating OquWay admin data." };
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
    + '<article class="sa-card sa-course-catalog-card"><div class="sa-section-title"><div><h2>Premium Course Catalog</h2><p>Open courses and modules in command-center views for oversight, assignments, and diagnostics.</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="refresh-data"' + disabled(isBusy()) + '>' + buildButtonContent("Refresh", "refresh-data") + '</button></div>' + buildCourseInventoryRows() + '</article>'
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
  var html = '<div class="sa-course-catalog-grid">';
  var index = 0;

  if (state.courses.length === 0) {
    return '<div class="sa-empty"><strong>No courses loaded.</strong><span>Courses will appear here when the course collections are available.</span></div>';
  }

  while (index < state.courses.length) {
    html += buildCourseCatalogCard(state.courses[index]);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildCourseCatalogCard(course) {
  var context = readCourseCommandContext(course);
  var status = readCourseStatus(course);

  return '<button type="button" class="sa-course-catalog-item" data-action="open-course-command-center" data-id="' + escapeHtml(course.id || "") + '">'
    + '<span class="sa-course-catalog-cover">' + escapeHtml(readCourseInitials(course)) + '</span>'
    + '<span class="sa-course-catalog-main"><strong>' + escapeHtml(readCourseTitle(course)) + '</strong><small>' + escapeHtml(readCourseDescription(course) || course.id || "No description") + '</small><em>Updated ' + escapeHtml(formatDateTime(readCourseUpdatedAt(course))) + '</em></span>'
    + '<span class="sa-course-catalog-status">' + buildStatusBadge(status) + '<small>' + escapeHtml(readCourseVisibility(course)) + '</small></span>'
    + '<span><strong>' + context.modules.length + '</strong><small>Modules</small></span>'
    + '<span><strong>' + context.locations.length + '</strong><small>Locations</small></span>'
    + '<span><strong>' + context.classes.length + '</strong><small>Classes</small></span>'
    + '<span><strong>' + context.students.length + '</strong><small>Students</small></span>'
    + '<span class="sa-course-catalog-actions"><i>Open Command Center</i></span>'
    + '</button>';
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
  html += '<label>Role' + buildBasicOptionsSelect('data-user-filter="role"', state.userFilters.role, userRoleFilterOptions, "All roles") + '</label>';
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
  var html = '<article class="sa-user-card">';

  html += '<div class="sa-user-summary">';
  html += '<div class="sa-user-profile-cell">' + buildAvatar(user) + '<div class="sa-user-main"><h3>' + escapeHtml(user.displayName || user.name || user.email || user.id) + '</h3><p>' + escapeHtml(user.email || "No email") + '</p><small>' + escapeHtml(user.phone || "No phone") + '</small></div></div>';
  html += '<div class="sa-role-badges">' + buildRoleBadges(user.roles) + '</div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(readUserLocationSummary(user)) + '</span></div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(readUserClassSummary(user)) + '</span></div>';
  html += '<div>' + buildStatusBadge(user.status) + '</div>';
  html += '<div class="sa-user-meta"><span>' + escapeHtml(formatDateTime(readUserLastActive(user))) + '</span></div>';
  html += '<div class="sa-row-actions">' + buildUserActionButtons(user) + '</div>';
  html += '</div>';

  html += '</article>';
  return html;
}

function buildUserActionButtons(user) {
  var capabilities = readUserActionCapabilities(user);
  var html = '<button type="button" class="sa-btn sa-btn-secondary" data-action="edit-user" data-id="' + escapeHtml(user.id) + '"' + disabled(!capabilities.canEdit) + '>Open</button>';

  if (isTeacherUser(user)) {
    logTeacherActionRender(user, capabilities);
    html += buildTeacherLoginActionButton(user, capabilities);
  }

  if (user.roles.indexOf("student") !== -1 && user.roles.length === 1) {
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="reset-fruit-user" data-id="' + escapeHtml(user.id) + '"' + disabled(isBusy()) + '>Reset Fruit</button>';
  } else {
    var resetLabel = isTeacherUser(user) && hasTeacherLoginAuthorization(user) ? "Send Password Reset" : "Reset Password";
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="send-password-reset" data-id="' + escapeHtml(user.id) + '"' + disabled(!capabilities.canResetPassword) + '>' + escapeHtml(resetLabel) + '</button>';
  }

  if (user.status === "active") {
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="disable-user" data-id="' + escapeHtml(user.id) + '"' + disabled(!capabilities.canDisable) + '>Disable</button>';
  }

  html += '<button type="button" class="sa-btn sa-danger-btn" data-action="delete-user" data-id="' + escapeHtml(user.id) + '"' + disabled(!capabilities.canDelete) + '>Delete</button>';
  return html;
}

function buildTeacherLoginActionButton(user, capabilities) {
  if (isHealthyTeacherAuthProfile(user)) {
    return '<button type="button" class="sa-btn sa-btn-secondary sa-status-btn" disabled>Login Authorized</button>';
  }

  if (hasTeacherLoginAuthorization(user)) {
    return '<button type="button" class="sa-btn sa-btn-secondary sa-status-btn" disabled>Login Authorized</button><button type="button" class="sa-btn sa-btn-secondary" data-action="repair-teacher-auth-profile" data-id="' + escapeHtml(user.id) + '"' + disabled(!capabilities.canRepair) + '>' + buildButtonContent("Repair Login Profile", "repair-teacher-auth-profile:" + user.id) + '</button>';
  }

  return '<button type="button" class="sa-btn" data-action="authorize-teacher-login" data-id="' + escapeHtml(user.id) + '"' + disabled(!capabilities.canAuthorize) + '>' + buildButtonContent("Authorize Teacher Login", "authorize-teacher-login:" + user.id) + '</button>';
}

function readUserActionCapabilities(user) {
  var safeUser = getSafeUser(user);
  var busy = isBusy();
  var isTeacher = safeUser.roles.indexOf("teacher") !== -1;
  var hasEmail = Boolean(safeUser.email);
  var hasAuthUid = Boolean(safeUser.authUid);
  var hasTeacherRequiredFields = readTeacherLoginMissingFields(safeUser).length === 0;
  var canDeleteByRole = actorHasSuperAdminRole(state.actor);

  return {
    canEdit: true,
    canAuthorize: !busy && isTeacher && !hasTeacherLoginAuthorization(safeUser) && hasTeacherRequiredFields,
    canRepair: !busy && isTeacher && hasAuthUid && !isHealthyTeacherAuthProfile(safeUser),
    canResetPassword: !busy && hasEmail,
    canDisable: !busy && safeUser.status === "active",
    canDelete: !busy && canDeleteByRole
  };
}

function isHealthyTeacherAuthProfile(user) {
  var safeUser = getSafeUser(user);
  var hasClassScope = Boolean(safeUser.classId || safeUser.classIds.length > 0);
  var hasLocationScope = Boolean(safeUser.primaryLocationId || safeUser.locationIds.length > 0);
  var isActiveAuthProfile = safeUser.id === safeUser.authUid || safeUser.isAuthProfile === true;

  return Boolean(
    safeUser.email
    && safeUser.authUid
    && safeUser.loginEnabled
    && safeUser.roles.indexOf("teacher") !== -1
    && hasClassScope
    && hasLocationScope
    && isActiveAuthProfile
  );
}

function logTeacherActionRender(user, capabilities) {
  var safeUser = getSafeUser(user);

  console.info("[teacher-actions:render]", {
    userId: safeUser.id,
    email: Boolean(safeUser.email),
    authUid: Boolean(safeUser.authUid),
    loginEnabled: safeUser.loginEnabled,
    canEdit: capabilities.canEdit,
    canAuthorize: capabilities.canAuthorize,
    canRepair: capabilities.canRepair,
    canResetPassword: capabilities.canResetPassword,
    canDisable: capabilities.canDisable,
    canDelete: capabilities.canDelete
  });
}

function buildUserCommandCenterModal() {
  var command = state.userCommandCenter || createUserCommandCenterState();

  if (!command.isOpen) {
    return "";
  }

  var user = getSafeUser(findUser(command.userId));

  if (!user.id) {
    return '<div class="sa-location-command-backdrop sa-user-command-backdrop" role="dialog" aria-modal="true" aria-label="User Command Center"><section class="sa-location-command-modal sa-user-command-modal">' + createEmptyState("User not found.", "Return to the user list and open a current profile.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '<button type="button" class="sa-location-command-close" data-action="close-user-command-center" aria-label="Close">x</button></section></div>';
  }

  var context = readUserCommandContext(user);

  return '<div class="sa-location-command-backdrop sa-user-command-backdrop" role="dialog" aria-modal="true" aria-label="User Command Center">'
    + '<section class="sa-location-command-modal sa-user-command-modal">'
    + buildUserCommandHeader(user, context)
    + '<div class="sa-location-command-shell sa-user-command-shell">'
    + buildUserCommandTabs(command.activeTab)
    + '<main class="sa-location-command-content sa-user-command-content">' + buildUserCommandBody(command.activeTab, user, context) + '</main>'
    + buildUserCommandSideRail(user, context)
    + '</div>'
    + '</section>'
    + '</div>';
}

function buildUserCommandHeader(user, context) {
  var roleLabel = readRoleLabel(context.primaryRole || user.role || "user");
  var locationName = context.location ? context.location.name : readUserLocationSummary(user);
  var className = context.primaryClass ? context.primaryClass.name : readUserClassSummary(user);

  return '<header class="sa-location-command-header sa-user-command-header">'
    + '<div class="sa-location-command-identity sa-user-command-identity">'
    + buildAvatar(user)
    + '<div><div class="sa-location-command-title"><h2>' + escapeHtml(readUserCommandName(user)) + '</h2><span class="sa-user-command-role-pill">' + escapeHtml(roleLabel) + '</span>' + createStatusBadge(user.status, { className: "sa-command-status", statusClassPrefix: "sa-command-status-" }) + '</div>'
    + '<p>' + escapeHtml(locationName || "No location") + '<span></span>' + escapeHtml(className || "No class") + '<span></span>User ID: ' + escapeHtml(user.id) + '</p>'
    + '<p><small>Last login: ' + escapeHtml(formatDateTime(readUserLastActive(user)) || "Not recorded") + '</small><span></span><small>Auth UID: ' + escapeHtml(user.authUid || "Not linked") + '</small></p></div>'
    + '</div>'
    + '<div class="sa-location-command-header-actions sa-user-command-header-actions">'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-user-edit-modal" data-id="' + escapeHtml(user.id) + '">Edit User</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="user-command-tab" data-id="permissions">Login Tools</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="send-password-reset" data-id="' + escapeHtml(user.id) + '"' + disabled(!readUserActionCapabilities(user).canResetPassword) + '>Reset Password</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="disable-user" data-id="' + escapeHtml(user.id) + '"' + disabled(!readUserActionCapabilities(user).canDisable) + '>Disable Login</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="user-command-tab" data-id="danger">More Actions</button>'
    + '<button type="button" class="sa-location-command-close" data-action="close-user-command-center" aria-label="Close">x</button>'
    + '</div>'
    + '</header>';
}

function buildUserCommandTabs(activeTab) {
  var tabs = [
    { key: "overview", label: "Overview", icon: "O" },
    { key: "classes", label: "Classes", icon: "C" },
    { key: "courses", label: "Courses", icon: "B" },
    { key: "activity", label: "Activity", icon: "A" },
    { key: "schedule", label: "Schedule", icon: "S" },
    { key: "permissions", label: "Permissions", icon: "P" },
    { key: "audit", label: "Audit Log", icon: "L" },
    { key: "danger", label: "Danger Zone", icon: "!" }
  ];
  var html = '<nav class="sa-location-command-tabs sa-user-command-tabs">';

  tabs.forEach(function (tab) {
    html += '<button type="button" class="' + (activeTab === tab.key ? "is-active" : "") + '" data-action="user-command-tab" data-id="' + escapeHtml(tab.key) + '"><span>' + escapeHtml(tab.icon) + '</span>' + escapeHtml(tab.label) + '</button>';
  });

  html += '<small>User Command Center</small></nav>';
  return html;
}

function buildUserCommandSideRail(user, context) {
  var roleViews = [
    { role: "student", title: "Student", note: "Learning overview, courses, tasks, progress." },
    { role: "teacher", title: "Teacher", note: "Classes, reviews, assigned courses." },
    { role: "parent", title: "Parent", note: "Children and attendance signals." },
    { role: "assistant", title: "Assistant", note: "Operational support and assigned classes." },
    { role: "admin", title: "Admin", note: "Operational management and login tools." }
  ];
  var html = '<aside class="sa-user-command-rail"><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Role Adaptive Views</h3></div><p>The content adapts to this profile role.</p><div class="sa-user-role-view-list">';

  roleViews.forEach(function (view) {
    var isActive = context.primaryRole === view.role || (view.role === "admin" && isAdminLikeUser(user));
    html += '<button type="button" class="' + (isActive ? "is-active" : "") + '" data-action="user-command-tab" data-id="overview"><strong>' + escapeHtml(view.title) + '</strong><span>' + escapeHtml(view.note) + '</span><i>' + (isActive ? "Active" : "") + '</i></button>';
  });

  html += '</div></article><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Quick Actions</h3></div><div class="sa-user-command-quick-list">'
    + '<button type="button" data-action="send-password-reset" data-id="' + escapeHtml(user.id) + '"' + disabled(!readUserActionCapabilities(user).canResetPassword) + '>Send password reset</button>'
    + '<button type="button" data-action="open-user-edit-modal" data-id="' + escapeHtml(user.id) + '">Edit profile fields</button>'
    + '<button type="button" data-action="user-command-tab" data-id="audit">View audit trail</button>'
    + '<button type="button" data-action="user-command-tab" data-id="danger">Sensitive actions</button>'
    + '</div></article></aside>';

  return html;
}

function buildUserCommandBody(activeTab, user, context) {
  if (activeTab === "classes") return buildUserCommandClassesTab(user, context);
  if (activeTab === "courses") return buildUserCommandCoursesTab(user, context);
  if (activeTab === "activity") return buildUserCommandActivityTab(user, context);
  if (activeTab === "schedule") return buildUserCommandScheduleTab(user, context);
  if (activeTab === "permissions") return buildUserCommandPermissionsTab(user, context);
  if (activeTab === "audit") return buildUserCommandAuditTab(user, context);
  if (activeTab === "danger") return buildUserCommandDangerTab(user, context);
  return buildUserCommandOverviewTab(user, context);
}

function buildUserCommandOverviewTab(user, context) {
  if (context.primaryRole === "student") {
    return buildStudentUserOverview(user, context);
  }

  if (context.primaryRole === "teacher") {
    return buildTeacherUserOverview(user, context);
  }

  if (context.primaryRole === "parent") {
    return buildParentUserOverview(user, context);
  }

  return buildAdminUserOverview(user, context);
}

function buildStudentUserOverview(user, context) {
  return '<section class="sa-location-command-overview sa-user-command-overview">'
    + '<div class="sa-command-kpi-grid sa-user-command-kpis">'
    + buildUserCommandKpiCard("Courses Assigned", context.courses.length, "courses", "blue", "Active course assignments")
    + buildUserCommandKpiCard("Modules Completed", readUserMetricNumber(user, ["modulesCompleted", "completedModules", "moduleCompletionCount"]), "activity", "green", "From profile/progress fields")
    + buildUserCommandKpiCard("Steps Completed", readUserMetricNumber(user, ["stepsCompleted", "completedSteps", "stepCompletionCount"]), "activity", "purple", "From profile/progress fields")
    + buildUserCommandKpiCard("Pending Reviews", countPendingSubmissions(context.submissions), "activity", "orange", "External tasks")
    + buildUserCommandKpiCard("Current Streak", readUserMetricNumber(user, ["currentStreak", "streak", "streakDays"]), "activity", "rose", "Learning streak")
    + buildUserCommandKpiCard("Intention Points", readUserMetricNumber(user, ["intentionPoints", "points", "pointBalance"]), "activity", "amber", "Available balance")
    + buildUserCommandKpiCard("Attendance", readAttendanceLabel(user), "classes", "sky", "Most recent attendance")
    + '</div>'
    + '<div class="sa-command-grid sa-command-grid-main">'
    + buildUserCommandChartCard("Activity Trend", "Activity trend data is not connected for this user yet.")
    + buildUserCommandChartCard("Completion Trend", "Completion trend data is not connected for this user yet.")
    + buildUserCommandChartCard("Attendance Trend", "Attendance trend data is not connected for this user yet.")
    + buildUserRecentActivityCard(context)
    + '</div>'
    + '</section>';
}

function buildTeacherUserOverview(user, context) {
  return '<section class="sa-location-command-overview sa-user-command-overview">'
    + '<div class="sa-command-kpi-grid sa-user-command-kpis">'
    + buildUserCommandKpiCard("Classes Taught", context.classes.length, "classes", "blue", "Primary or assistant")
    + buildUserCommandKpiCard("Students", countStudentsAcrossClasses(context.classes), "classes", "green", "Visible class students")
    + buildUserCommandKpiCard("Courses Assigned", context.courses.length, "courses", "purple", "Responsible or assistant")
    + buildUserCommandKpiCard("Pending Reviews", countPendingSubmissions(context.submissions), "activity", "orange", "External tasks")
    + buildUserCommandKpiCard("External Tasks Reviewed", countReviewedSubmissionsForUser(user.id), "activity", "rose", "Review records")
    + buildUserCommandKpiCard("Attendance Recorded", countUserActivityMatches(user.id, ["attendance"]), "activity", "sky", "Activity logs")
    + '</div>'
    + '<div class="sa-command-grid sa-command-grid-main">'
    + buildUserCommandChartCard("Review Activity", "Review activity chart data is not connected for this teacher yet.")
    + buildUserCommandChartCard("Class Activity", "Class activity chart data is not connected for this teacher yet.")
    + buildUserCommandChartCard("Course Progress", "Course progress chart data is not connected for this teacher yet.")
    + buildUserRecentActivityCard(context)
    + '</div>'
    + '</section>';
}

function buildParentUserOverview(user, context) {
  return '<section class="sa-command-tab-stack"><div class="sa-command-kpi-grid sa-user-command-kpis">'
    + buildUserCommandKpiCard("Children", context.children.length, "classes", "purple", "Linked child profiles")
    + buildUserCommandKpiCard("Locations", context.locations.length, "classes", "blue", "Location scope")
    + buildUserCommandKpiCard("Attendance Signals", 0, "activity", "orange", "Not connected")
    + buildUserCommandKpiCard("Pending Items", countPendingSubmissions(context.submissions), "activity", "rose", "Child submissions where available")
    + '</div>' + buildUserCommandChildrenPanel(context) + '</section>';
}

function buildAdminUserOverview(user, context) {
  return '<section class="sa-command-tab-stack"><div class="sa-command-kpi-grid sa-user-command-kpis">'
    + buildUserCommandKpiCard("Locations Managed", context.locations.length, "permissions", "blue", "Location scope")
    + buildUserCommandKpiCard("Users Managed", countManagedUsers(user), "activity", "green", "Activity/audit references")
    + buildUserCommandKpiCard("Classes Managed", context.classes.length, "classes", "purple", "Scoped classes")
    + buildUserCommandKpiCard("Courses Managed", context.courses.length, "courses", "orange", "Scoped assignments")
    + '</div>' + buildUserRecentActivityCard(context) + '</section>';
}

function buildUserCommandKpiCard(label, value, target, tone, note) {
  return '<button type="button" class="sa-command-kpi sa-command-kpi-' + escapeHtml(tone) + '" data-action="user-command-tab" data-id="' + escapeHtml(target) + '">'
    + '<span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong><small>' + escapeHtml(note || "Open details") + '</small></button>';
}

function buildUserCommandChartCard(title, emptyMessage) {
  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>' + escapeHtml(title) + '</h3><select disabled><option>30 Days</option></select></div>'
    + createEmptyState(title + " unavailable", emptyMessage, { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</article>';
}

function buildUserRecentActivityCard(context) {
  var html = '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Recent Activity</h3><button type="button" class="sa-text-link" data-action="user-command-tab" data-id="activity">View All</button></div>';

  if (context.activity.length === 0) {
    return html + createEmptyState("No recent activity.", "Activity logs will appear here when connected to this user.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</article>';
  }

  html += '<div class="sa-command-activity-list">';
  context.activity.slice(0, 6).forEach(function (item) {
    html += '<div><span>' + escapeHtml(item.type) + '</span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(formatDateTime(item.time)) + '</small></div>';
  });
  html += '</div></article>';
  return html;
}

function buildUserCommandClassesTab(user, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.classes.length === 0 && context.children.length === 0) {
    return html + createEmptyState("No classes connected.", "Class relationships for this user are not available yet.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Class</span><span>Location</span><span>Teacher</span><span>Students</span><span>Status</span></div>';
  context.classes.forEach(function (classRecord) {
    var form = normalizeClassForm(classRecord);
    html += '<button type="button" class="sa-command-table-row" data-action="user-command-navigate" data-id="classes">'
      + '<span><strong>' + escapeHtml(form.name || form.classId || "Untitled class") + '</strong><small>' + escapeHtml(form.classId || classRecord.id) + '</small></span>'
      + '<span>' + escapeHtml(readLocationName(form.locationId) || "No location") + '</span>'
      + '<span>' + escapeHtml(readTeacherName(form.primaryTeacherId)) + '</span>'
      + '<span>' + countStudentsForClass(form.classId) + '</span>'
      + '<span>' + buildStatusBadge(form.status || "active") + '</span></button>';
  });
  html += '</div>';

  if (context.children.length > 0) {
    html += buildUserCommandChildrenPanel(context);
  }

  html += '</section>';
  return html;
}

function buildUserCommandChildrenPanel(context) {
  if (context.children.length === 0) {
    return createEmptyState("No linked children.", "Parent-child relationships are not connected for this user yet.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" });
  }

  var html = '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Linked Children</h3></div><div class="sa-command-table"><div class="sa-command-table-head"><span>Student</span><span>Class</span><span>Location</span><span>Status</span><span>ID</span></div>';
  context.children.forEach(function (child) {
    html += '<button type="button" class="sa-command-table-row" data-action="edit-user" data-id="' + escapeHtml(child.id) + '"><span><strong>' + escapeHtml(readUserCommandName(child)) + '</strong><small>' + escapeHtml(child.email || child.id) + '</small></span><span>' + escapeHtml(readUserClassSummary(child)) + '</span><span>' + escapeHtml(readUserLocationSummary(child)) + '</span><span>' + buildStatusBadge(child.status) + '</span><span>' + escapeHtml(child.id) + '</span></button>';
  });
  html += '</div></article>';
  return html;
}

function buildUserCommandCoursesTab(user, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.courses.length === 0) {
    return html + createEmptyState("No courses connected.", "Course assignments for this user are not available yet.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Course</span><span>Assignment</span><span>Progress</span><span>Last Activity</span><span>Status</span></div>';
  context.courses.forEach(function (course) {
    var assignment = readCourseAssignmentForUserCourse(user, course.id);
    html += '<button type="button" class="sa-command-table-row" data-action="user-command-navigate" data-id="lessons">'
      + '<span><strong>' + escapeHtml(readCourseTitle(course)) + '</strong><small>' + escapeHtml(readCourseDescription(course) || course.id) + '</small></span>'
      + '<span>' + escapeHtml(readAssignmentTargetName(assignment) || assignment.targetType || "Assigned") + '</span>'
      + '<span>' + escapeHtml(readCourseProgressLabel(user, course, assignment)) + '</span>'
      + '<span>' + escapeHtml(formatDateTime(readCourseUpdatedAt(course)) || "No activity") + '</span>'
      + '<span>' + buildStatusBadge(course.status || assignment.status || "active") + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildUserCommandActivityTab(user, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.activity.length === 0 && context.submissions.length === 0) {
    return html + createEmptyState("No recent activity.", "Activity records for this user are not available yet.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Activity Feed</h3></div><div class="sa-command-activity-list">';
  context.activity.forEach(function (item) {
    html += '<div><span>' + escapeHtml(item.type) + '</span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(formatDateTime(item.time)) + '</small></div>';
  });
  context.submissions.slice(0, 8).forEach(function (submission) {
    html += '<div><span>External Task</span><strong>' + escapeHtml(submission.stepTitle || submission.title || "External task submission") + '</strong><small>' + escapeHtml(readSafeString(submission.reviewStatus || submission.status || "pending")) + ' - ' + escapeHtml(formatDateTime(submission.updatedAt || submission.createdAt)) + '</small></div>';
  });
  html += '</div></article></section>';
  return html;
}

function buildUserCommandScheduleTab(user, context) {
  return '<section class="sa-command-tab-stack">' + createEmptyState("No schedule data yet.", "Schedule records are not connected to this user profile yet.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
}

function buildUserCommandPermissionsTab(user, context) {
  return '<section class="sa-command-tab-stack"><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Permissions Debug</h3><span class="sa-user-command-super">Super Admin Only</span></div>'
    + '<dl class="sa-command-summary-list">'
    + '<dt>Primary Role</dt><dd>' + escapeHtml(readRoleLabel(context.primaryRole || user.role || "user")) + '</dd>'
    + '<dt>Roles</dt><dd>' + escapeHtml(user.roles.map(readRoleLabel).join(", ") || "No roles") + '</dd>'
    + '<dt>Location</dt><dd>' + escapeHtml(readUserLocationSummary(user)) + '</dd>'
    + '<dt>Status</dt><dd>' + createStatusBadge(user.status, { className: "sa-command-mini-status", statusClassPrefix: "sa-command-status-" }) + '</dd>'
    + '<dt>Login Method</dt><dd>' + escapeHtml(readUserLoginMethod(user)) + '</dd>'
    + '<dt>Auth UID</dt><dd>' + escapeHtml(user.authUid || "Not linked") + '</dd>'
    + '<dt>User Document ID</dt><dd>' + escapeHtml(user.id) + '</dd>'
    + '<dt>Profile User ID</dt><dd>' + escapeHtml(user.profileUserId || "Not linked") + '</dd>'
    + '</dl></article></section>';
}

function buildUserCommandAuditTab(user, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.audit.length === 0) {
    return html + createEmptyState("No audit log entries yet.", "Audit records will appear here when this profile has logged admin events.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Audit Log</h3></div><div class="sa-command-table"><div class="sa-command-table-head"><span>Action</span><span>Performed By</span><span>Date</span><span>Status</span><span>Record</span></div>';
  context.audit.forEach(function (entry) {
    html += '<div class="sa-command-table-row"><span><strong>' + escapeHtml(entry.action || entry.type || "Audit entry") + '</strong><small>' + escapeHtml(entry.message || entry.description || "") + '</small></span><span>' + escapeHtml(entry.performedByName || entry.actorName || entry.performedBy || entry.actorId || "System") + '</span><span>' + escapeHtml(formatDateTime(entry.createdAt || entry.updatedAt || entry.time)) + '</span><span>' + buildStatusBadge(entry.status || "active") + '</span><span>' + escapeHtml(entry.id || "") + '</span></div>';
  });
  html += '</div></article></section>';
  return html;
}

function buildUserCommandDangerTab(user, context) {
  return '<section class="sa-command-tab-stack"><article class="sa-command-panel sa-command-danger-panel"><div class="sa-command-panel-head"><h3>Danger Zone</h3><span class="sa-user-command-super">Super Admin Only</span></div><p>Destructive or sensitive user operations must run through ICF intents. Unsupported actions are intentionally disabled in Phase 1.</p><div class="sa-command-danger-actions">'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="disable-user" data-id="' + escapeHtml(user.id) + '"' + disabled(!readUserActionCapabilities(user).canDisable) + '>Disable Login</button>'
    + '<button type="button" class="sa-btn sa-danger-btn" disabled>Enable User Login</button>'
    + '<button type="button" class="sa-btn sa-danger-btn" disabled>Assign User To Location</button>'
    + '<button type="button" class="sa-btn sa-danger-btn" disabled>Transfer User Location</button>'
    + '<button type="button" class="sa-btn sa-danger-btn" disabled>Archive User</button>'
    + '<button type="button" class="sa-btn sa-danger-btn" data-action="delete-user" data-id="' + escapeHtml(user.id) + '"' + disabled(!readUserActionCapabilities(user).canDelete) + '>Delete User</button>'
    + '</div><small>User: ' + escapeHtml(readUserCommandName(user)) + ' (' + escapeHtml(user.id) + ')</small></article></section>';
}

function buildCourseCommandCenterModal() {
  var command = state.courseCommandCenter || createCourseCommandCenterState();

  if (!command.isOpen) {
    return "";
  }

  var course = findCourse(command.courseId);

  if (!course) {
    return buildMissingCommandModal("Course Command Center", "Course not found.", "Return to Courses & Modules and open a current course.", "close-course-command-center");
  }

  var context = readCourseCommandContext(course);

  return '<div class="sa-location-command-backdrop sa-course-command-backdrop" role="dialog" aria-modal="true" aria-label="Course Command Center">'
    + '<section class="sa-location-command-modal sa-course-command-modal">'
    + buildCourseCommandHeader(course, context)
    + '<div class="sa-location-command-shell sa-course-command-shell">'
    + buildCourseCommandTabs(command.activeTab)
    + '<main class="sa-location-command-content sa-course-command-content">' + buildCourseCommandBody(command.activeTab, course, context) + '</main>'
    + buildCourseCommandSideRail(course, context)
    + '</div></section></div>';
}

function buildModuleCommandCenterModal() {
  var command = state.moduleCommandCenter || createModuleCommandCenterState();

  if (!command.isOpen) {
    return "";
  }

  var course = findCourse(command.courseId);
  var moduleRecord = findModuleForCourse(command.courseId, command.moduleId);

  if (!moduleRecord) {
    return buildMissingCommandModal("Module Command Center", "Module not found.", "Open a current module from the Course Command Center modules tab.", "close-module-command-center");
  }

  var context = readModuleCommandContext(course, moduleRecord);

  return '<div class="sa-location-command-backdrop sa-module-command-backdrop" role="dialog" aria-modal="true" aria-label="Module Command Center">'
    + '<section class="sa-location-command-modal sa-module-command-modal">'
    + buildModuleCommandHeader(moduleRecord, context)
    + '<div class="sa-location-command-shell sa-module-command-shell">'
    + buildModuleCommandTabs(command.activeTab)
    + '<main class="sa-location-command-content sa-module-command-content">' + buildModuleCommandBody(command.activeTab, moduleRecord, context) + '</main>'
    + buildModuleCommandSideRail(moduleRecord, context)
    + '</div></section></div>';
}

function buildMissingCommandModal(label, title, message, closeAction) {
  return '<div class="sa-location-command-backdrop" role="dialog" aria-modal="true" aria-label="' + escapeHtml(label) + '"><section class="sa-location-command-modal sa-course-command-modal">'
    + createEmptyState(title, message, { className: "sa-command-empty", titleTag: "strong", messageTag: "span" })
    + '<button type="button" class="sa-location-command-close" data-action="' + escapeHtml(closeAction) + '" aria-label="Close">x</button></section></div>';
}

function buildCourseCommandHeader(course, context) {
  return '<header class="sa-location-command-header sa-course-command-header">'
    + '<div class="sa-location-command-identity sa-course-command-identity">'
    + '<span class="sa-course-command-cover">' + escapeHtml(readCourseInitials(course)) + '</span>'
    + '<div><div class="sa-location-command-title"><h2>' + escapeHtml(readCourseTitle(course)) + '</h2><span class="sa-user-command-role-pill">' + escapeHtml(readCourseVersion(course)) + '</span>' + createStatusBadge(readCourseStatus(course), { className: "sa-command-status", statusClassPrefix: "sa-command-status-" }) + '</div>'
    + '<p>' + escapeHtml(readCourseDescription(course) || "No description") + '</p>'
    + '<p><small>Language: ' + escapeHtml(readCourseLanguage(course)) + '</small><span></span><small>Created: ' + escapeHtml(formatDateTime(course.createdAt)) + '</small><span></span><small>Last Updated: ' + escapeHtml(formatDateTime(readCourseUpdatedAt(course))) + '</small></p></div>'
    + '</div><div class="sa-location-command-header-actions sa-course-command-header-actions">'
    + '<button type="button" class="sa-btn" data-action="open-course-creator-course" data-id="' + escapeHtml(course.id) + '">Open in Course Creator</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-course-creator-course" data-id="' + escapeHtml(course.id) + '">Edit Course Info</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="course-command-tab" data-id="assignments">Assign Course</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="export-course-json" data-id="' + escapeHtml(course.id) + '">Export JSON</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="course-command-tab" data-id="danger">More Actions</button>'
    + '<button type="button" class="sa-location-command-close" data-action="close-course-command-center" aria-label="Close">x</button>'
    + '</div></header>';
}

function buildModuleCommandHeader(moduleRecord, context) {
  return '<header class="sa-location-command-header sa-module-command-header">'
    + '<div class="sa-location-command-identity sa-course-command-identity">'
    + '<span class="sa-module-command-cover">' + escapeHtml(readModuleInitials(moduleRecord)) + '</span>'
    + '<div><div class="sa-location-command-title"><h2>' + escapeHtml(readModuleTitle(moduleRecord)) + '</h2>' + createStatusBadge(readModuleStatus(moduleRecord), { className: "sa-command-status", statusClassPrefix: "sa-command-status-" }) + '</div>'
    + '<p>Course: ' + escapeHtml(readCourseTitle(context.course)) + '<span></span>Tracks: ' + context.tracks.length + '<span></span>Pages: ' + context.pages.length + '<span></span>Steps: ' + context.steps.length + '</p>'
    + '<p><small>Last Updated: ' + escapeHtml(formatDateTime(readModuleUpdatedAt(moduleRecord))) + '</small></p></div>'
    + '</div><div class="sa-location-command-header-actions sa-module-command-header-actions">'
    + '<button type="button" class="sa-btn" data-action="open-module-editor" data-id="' + escapeHtml(context.courseId + "::" + moduleRecord.id) + '">Open in Module Editor</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-module-editor" data-id="' + escapeHtml(context.courseId + "::" + moduleRecord.id) + '">Preview Module</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" disabled>Publish Settings</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="module-command-tab" data-id="danger">More Actions</button>'
    + '<button type="button" class="sa-location-command-close" data-action="close-module-command-center" aria-label="Close">x</button>'
    + '</div></header>';
}

function buildCourseCommandTabs(activeTab) {
  return buildCommandTabs("course-command-tab", activeTab, [
    ["overview", "Overview", "O"], ["modules", "Modules", "M"], ["assignments", "Assignments", "A"], ["students", "Students", "S"], ["analytics", "Analytics", "N"], ["versions", "Versions", "V"], ["audit", "Audit Log", "L"], ["danger", "Danger Zone", "!"]
  ], "Course Command Center");
}

function buildModuleCommandTabs(activeTab) {
  return buildCommandTabs("module-command-tab", activeTab, [
    ["overview", "Overview", "O"], ["tracks", "Tracks", "T"], ["pages", "Pages", "P"], ["steps", "Steps", "S"], ["assignments", "Assignments", "A"], ["analytics", "Analytics", "N"], ["preview", "Preview", "V"], ["audit", "Audit Log", "L"], ["danger", "Danger Zone", "!"]
  ], "Module Command Center");
}

function buildCommandTabs(action, activeTab, tabs, label) {
  var html = '<nav class="sa-location-command-tabs sa-course-command-tabs">';

  tabs.forEach(function (tab) {
    html += '<button type="button" class="' + (activeTab === tab[0] ? "is-active" : "") + '" data-action="' + escapeHtml(action) + '" data-id="' + escapeHtml(tab[0]) + '"><span>' + escapeHtml(tab[2]) + '</span>' + escapeHtml(tab[1]) + '</button>';
  });

  html += '<small>' + escapeHtml(label) + '</small></nav>';
  return html;
}

function buildCourseCommandBody(activeTab, course, context) {
  if (activeTab === "modules") return buildCourseModulesTab(course, context);
  if (activeTab === "assignments") return buildCourseAssignmentsTab(course, context);
  if (activeTab === "students") return buildCourseStudentsTab(course, context);
  if (activeTab === "analytics") return buildCourseAnalyticsTab(course, context);
  if (activeTab === "versions") return buildCourseVersionsTab(course, context);
  if (activeTab === "audit") return buildCourseAuditTab(course, context);
  if (activeTab === "danger") return buildCourseDangerTab(course, context);
  return buildCourseOverviewTab(course, context);
}

function buildModuleCommandBody(activeTab, moduleRecord, context) {
  if (activeTab === "tracks") return buildModuleTracksTab(moduleRecord, context);
  if (activeTab === "pages") return buildModulePagesTab(moduleRecord, context);
  if (activeTab === "steps") return buildModuleStepsTab(moduleRecord, context);
  if (activeTab === "assignments") return buildModuleAssignmentsTab(moduleRecord, context);
  if (activeTab === "analytics") return buildModuleAnalyticsTab(moduleRecord, context);
  if (activeTab === "preview") return buildModulePreviewTab(moduleRecord, context);
  if (activeTab === "audit") return buildModuleAuditTab(moduleRecord, context);
  if (activeTab === "danger") return buildModuleDangerTab(moduleRecord, context);
  return buildModuleOverviewTab(moduleRecord, context);
}

function buildCourseOverviewTab(course, context) {
  return '<section class="sa-location-command-overview sa-course-command-overview"><div class="sa-command-kpi-grid sa-course-command-kpis">'
    + buildUserCommandKpiCard("Modules", context.modules.length, "modules", "blue", context.publishedModules + " published")
    + buildUserCommandKpiCard("Published Modules", context.publishedModules, "modules", "green", "Ready modules")
    + buildUserCommandKpiCard("Draft Modules", context.draftModules, "modules", "purple", "In progress")
    + buildUserCommandKpiCard("Assigned Classes", context.classes.length, "assignments", "sky", "Across assignments")
    + buildUserCommandKpiCard("Assigned Students", context.students.length, "students", "orange", "Visible students")
    + buildUserCommandKpiCard("Active Locations", context.locations.length, "assignments", "amber", "Location scope")
    + buildUserCommandKpiCard("Completion", readCourseCompletionLabel(context), "analytics", "blue", "Operational signal")
    + buildUserCommandKpiCard("Pending Reviews", countPendingSubmissions(context.submissions), "analytics", "rose", "External tasks")
    + '</div><div class="sa-command-grid sa-command-grid-main">'
    + buildUserCommandChartCard("Course Activity Trend", "Course activity trend data is not connected yet.")
    + buildUserCommandChartCard("Module Completion Trend", "Module completion trend data is not connected yet.")
    + buildUserCommandChartCard("External Task Review Trend", "External task review trend data is not connected yet.")
    + buildCourseAtAGlanceCard(course, context)
    + '</div></section>';
}

function buildModuleOverviewTab(moduleRecord, context) {
  return '<section class="sa-location-command-overview sa-module-command-overview"><div class="sa-command-kpi-grid sa-course-command-kpis">'
    + buildUserCommandKpiCard("Tracks", context.tracks.length, "tracks", "blue", context.tracks.length >= 3 ? "Publish-ready count" : "Minimum 3 recommended")
    + buildUserCommandKpiCard("Pages", context.pages.length, "pages", "green", "Module pages")
    + buildUserCommandKpiCard("Steps", context.steps.length, "steps", "purple", "Interactive steps")
    + buildUserCommandKpiCard("Published Status", readModuleStatus(moduleRecord), "preview", "sky", "Current state")
    + buildUserCommandKpiCard("Students Started", context.studentsStarted, "analytics", "orange", "Operational signal")
    + buildUserCommandKpiCard("Students Completed", context.studentsCompleted, "analytics", "blue", "Completion signal")
    + buildUserCommandKpiCard("Average Progress", readModuleProgressLabel(moduleRecord, context), "analytics", "amber", "If available")
    + buildUserCommandKpiCard("Pending Reviews", countPendingSubmissions(context.submissions), "analytics", "rose", "External tasks")
    + '</div><div class="sa-command-grid sa-command-grid-main">'
    + buildModulePerformanceCard(context)
    + buildModuleExternalTaskCard(context)
    + buildUserCommandChartCard("Track Distribution", "Track distribution data is not connected yet.")
    + buildUserRecentActivityCard({ activity: context.activity, submissions: context.submissions })
    + '</div></section>';
}

function buildCourseModulesTab(course, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.modules.length === 0) {
    return html + createEmptyState("No modules found.", "Modules will appear here when connected to this course.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table sa-course-modules-table"><div class="sa-command-table-head"><span>Module</span><span>Status</span><span>Tracks</span><span>Pages</span><span>Steps</span><span>Updated</span></div>';
  context.modules.forEach(function (moduleRecord) {
    var summary = readModuleStructureSummary(moduleRecord);
    html += '<button type="button" class="sa-command-table-row" data-action="open-module-command-center" data-id="' + escapeHtml(course.id + "::" + moduleRecord.id) + '"><span><strong>' + escapeHtml(readModuleTitle(moduleRecord)) + '</strong><small>' + escapeHtml(readModuleEstimatedTime(moduleRecord)) + '</small></span><span>' + buildStatusBadge(readModuleStatus(moduleRecord)) + '</span><span>' + summary.tracks + '</span><span>' + summary.pages + '</span><span>' + summary.steps + '</span><span>' + escapeHtml(formatDateTime(readModuleUpdatedAt(moduleRecord))) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildCourseAssignmentsTab(course, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.assignments.length === 0) {
    return html + createEmptyState("No assignments found.", "Use existing assignment tools to assign this course to locations, classes, or students.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Assigned To</span><span>Type</span><span>Location</span><span>Class</span><span>Status</span></div>';
  context.assignments.forEach(function (assignment) {
    html += '<button type="button" class="sa-command-table-row" data-action="view-assignment" data-id="' + escapeHtml(assignment.id || "") + '"><span><strong>' + escapeHtml(readAssignmentTargetName(assignment)) + '</strong><small>' + escapeHtml(formatDateTime(assignment.assignedAt || assignment.createdAt || assignment.updatedAt)) + '</small></span><span>' + escapeHtml(assignment.targetType || "class") + '</span><span>' + escapeHtml(readLocationName(assignment.locationId || readAssignmentLocationId(assignment))) + '</span><span>' + escapeHtml(readClassName(assignment.classId || assignment.targetId)) + '</span><span>' + buildStatusBadge(assignment.status || "active") + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildCourseStudentsTab(course, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.students.length === 0) {
    return html + createEmptyState("No assigned students found.", "Assigned students will appear when course assignments connect to student or class profiles.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table sa-command-users-table"><div class="sa-command-table-head"><span>Avatar</span><span>Name</span><span>Location</span><span>Class</span><span>Status</span></div>';
  context.students.forEach(function (student) {
    var safeStudent = getSafeUser(student);
    html += '<button type="button" class="sa-command-table-row" data-action="edit-user" data-id="' + escapeHtml(safeStudent.id) + '"><span>' + buildAvatar(safeStudent) + '</span><span><strong>' + escapeHtml(readUserCommandName(safeStudent)) + '</strong><small>' + escapeHtml(readCourseProgressLabel(safeStudent, course, {})) + '</small></span><span>' + escapeHtml(readUserLocationSummary(safeStudent)) + '</span><span>' + escapeHtml(readUserClassSummary(safeStudent)) + '</span><span>' + buildStatusBadge(safeStudent.status) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildCourseAnalyticsTab(course, context) {
  return '<section class="sa-command-tab-stack"><div class="sa-command-kpi-grid">'
    + buildUserCommandKpiCard("Student Activity", context.activity.length, "analytics", "blue", "Activity records")
    + buildUserCommandKpiCard("Module Completion", context.publishedModules, "modules", "green", "Published modules")
    + buildUserCommandKpiCard("Step Completion", sumBy(context.modules, function (moduleRecord) { return readModuleStructureSummary(moduleRecord).steps; }), "modules", "purple", "Step inventory")
    + buildUserCommandKpiCard("External Tasks", context.submissions.length, "analytics", "orange", "Submissions")
    + buildUserCommandKpiCard("Pending Reviews", countPendingSubmissions(context.submissions), "analytics", "rose", "Review queue")
    + '</div>' + buildUserCommandChartCard("Operational Analytics", "Detailed course analytics are not connected yet.") + '</section>';
}

function buildCourseVersionsTab(course, context) {
  var versions = Array.isArray(course.versions) ? course.versions : [];
  return '<section class="sa-command-tab-stack">' + (versions.length ? buildSimpleRecordList("Course Versions", versions) : createEmptyState("No course version history yet.", "Version records will appear here when connected.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" })) + '</section>';
}

function buildCourseAuditTab(course, context) {
  return '<section class="sa-command-tab-stack">' + (context.audit.length ? buildSimpleRecordList("Audit Log", context.audit) : createEmptyState("No audit log entries yet.", "Audit records will appear here when connected to this course.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" })) + '</section>';
}

function buildCourseDangerTab(course, context) {
  return '<section class="sa-command-tab-stack"><article class="sa-command-panel sa-command-danger-panel"><div class="sa-command-panel-head"><h3>Danger Zone</h3><span class="sa-user-command-super">ICF Only</span></div><p>Destructive course actions remain disabled unless an existing ICF intent is explicitly wired.</p><div class="sa-command-danger-actions"><button type="button" class="sa-btn sa-danger-btn" disabled>Archive Course</button><button type="button" class="sa-btn sa-danger-btn" disabled>Restore Course</button><button type="button" class="sa-btn sa-danger-btn" disabled>Delete Course</button></div><small>Course: ' + escapeHtml(readCourseTitle(course)) + '</small></article></section>';
}

function buildModuleTracksTab(moduleRecord, context) {
  return buildModuleStructureTable("Tracks", context.tracks, ["Track", "Color", "Pages", "Steps", "Status"], function (track) {
    return [readSafeString(track.title || track.name || track.id || "Untitled track"), readSafeString(track.color || track.tone || "Default"), countPagesForTrack(context.pages, track), countStepsForTrack(context.steps, track), readSafeString(track.status || "draft")];
  }, "No tracks found.", "Tracks will appear when module track data is connected.");
}

function buildModulePagesTab(moduleRecord, context) {
  return buildModuleStructureTable("Pages", context.pages, ["Page", "Track", "Blocks", "Steps", "Status"], function (page) {
    return [readSafeString(page.title || page.name || page.id || "Untitled page"), readSafeString(page.trackTitle || page.trackId || "Default"), readBlockCount(page), countStepsForPage(context.steps, page), readSafeString(page.status || "draft")];
  }, "No pages found.", "Pages will appear when module page data is connected.");
}

function buildModuleStepsTab(moduleRecord, context) {
  return buildModuleStructureTable("Steps", context.steps, ["Step", "Type", "Completion Rule", "Status", "Warning"], function (step) {
    return [readSafeString(step.title || step.name || step.id || "Untitled step"), readSafeString(step.type || step.stepType || step.kind || "Unknown"), readSafeString(step.completionRule || step.requiredForCompletion || "Default"), readSafeString(step.status || "draft"), readStepValidationWarning(step)];
  }, "No steps found.", "Steps will appear when module step data is connected.");
}

function buildModuleStructureTable(title, records, headings, rowReader, emptyTitle, emptyMessage) {
  var html = '<section class="sa-command-tab-stack">';

  if (records.length === 0) {
    return html + createEmptyState(emptyTitle, emptyMessage, { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head">';
  headings.forEach(function (heading) { html += '<span>' + escapeHtml(heading) + '</span>'; });
  html += '</div>';
  records.forEach(function (record) {
    var values = rowReader(record);
    html += '<div class="sa-command-table-row">';
    values.forEach(function (value, index) {
      html += '<span>' + (index === 3 && headings[index] === "Status" ? buildStatusBadge(value) : escapeHtml(String(value))) + '</span>';
    });
    html += '</div>';
  });
  html += '</div></section>';
  return html;
}

function buildModuleAssignmentsTab(moduleRecord, context) {
  return '<section class="sa-command-tab-stack">' + createEmptyState("This module inherits assignment access from its course.", "Use the Course Command Center assignments tab to inspect access.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
}

function buildModuleAnalyticsTab(moduleRecord, context) {
  return '<section class="sa-command-tab-stack"><div class="sa-command-kpi-grid">'
    + buildUserCommandKpiCard("Started", context.studentsStarted, "analytics", "blue", "Students started")
    + buildUserCommandKpiCard("Completed", context.studentsCompleted, "analytics", "green", "Students completed")
    + buildUserCommandKpiCard("Average Time", readModuleEstimatedTime(moduleRecord), "analytics", "purple", "If available")
    + buildUserCommandKpiCard("External Tasks", context.submissions.length, "analytics", "orange", "Submissions")
    + '</div>' + buildUserCommandChartCard("Most Active Steps", "Step activity analytics are not connected yet.") + '</section>';
}

function buildModulePreviewTab(moduleRecord, context) {
  return '<section class="sa-command-tab-stack"><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Preview</h3><button type="button" class="sa-btn" data-action="open-module-editor" data-id="' + escapeHtml(context.courseId + "::" + moduleRecord.id) + '">Open Preview</button></div><p>Use the existing Module Editor preview route for student-facing review.</p></article></section>';
}

function buildModuleAuditTab(moduleRecord, context) {
  return '<section class="sa-command-tab-stack">' + (context.audit.length ? buildSimpleRecordList("Audit Log", context.audit) : createEmptyState("No audit log entries yet.", "Audit records will appear here when connected to this module.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" })) + '</section>';
}

function buildModuleDangerTab(moduleRecord, context) {
  return '<section class="sa-command-tab-stack"><article class="sa-command-panel sa-command-danger-panel"><div class="sa-command-panel-head"><h3>Danger Zone</h3><span class="sa-user-command-super">ICF Only</span></div><p>Destructive module actions remain disabled unless an existing ICF intent is explicitly wired.</p><div class="sa-command-danger-actions"><button type="button" class="sa-btn sa-danger-btn" disabled>Archive Module</button><button type="button" class="sa-btn sa-danger-btn" disabled>Restore Module</button><button type="button" class="sa-btn sa-danger-btn" disabled>Delete Module</button></div><small>Module: ' + escapeHtml(readModuleTitle(moduleRecord)) + '</small></article></section>';
}

function buildCourseCommandSideRail(course, context) {
  return '<aside class="sa-user-command-rail sa-course-command-rail"><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Role Adaptive Views</h3></div><p>This command center adapts around course operations and learning access.</p><div class="sa-user-role-view-list"><button class="is-active" data-action="course-command-tab" data-id="overview"><strong>Course</strong><span>Overview, modules, assignments, analytics.</span><i>Active</i></button><button data-action="course-command-tab" data-id="students"><strong>Student</strong><span>Assigned learners and progress signals.</span><i></i></button><button data-action="course-command-tab" data-id="assignments"><strong>Teacher/Admin</strong><span>Ownership, classes, locations.</span><i></i></button><button data-action="course-command-tab" data-id="danger"><strong>Super Admin Only</strong><span>Audit and danger-zone actions.</span><i></i></button></div></article><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Quick Actions</h3></div><div class="sa-user-command-quick-list"><button data-action="open-course-creator-course" data-id="' + escapeHtml(course.id) + '">Open in Course Creator</button><button data-action="course-command-tab" data-id="modules">View modules</button><button data-action="course-command-tab" data-id="assignments">View assignments</button><button data-action="export-course-json" data-id="' + escapeHtml(course.id) + '">Export JSON</button></div></article></aside>';
}

function buildModuleCommandSideRail(moduleRecord, context) {
  return '<aside class="sa-user-command-rail sa-module-command-rail"><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Quick Actions</h3></div><div class="sa-user-command-quick-list"><button data-action="open-module-editor" data-id="' + escapeHtml(context.courseId + "::" + moduleRecord.id) + '">Open in Module Editor</button><button data-action="module-command-tab" data-id="tracks">View tracks</button><button data-action="module-command-tab" data-id="steps">View steps</button><button data-action="module-command-tab" data-id="preview">Preview</button></div></article><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Need Help?</h3></div><p>Module structure is shown from loaded track, page, block, and step fields without changing Step Engine contracts.</p></article></aside>';
}

function buildCourseAtAGlanceCard(course, context) {
  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Course At A Glance</h3><button type="button" class="sa-text-link" data-action="course-command-tab" data-id="analytics">Show more</button></div><dl class="sa-command-summary-list"><dt>Total Steps</dt><dd>' + sumBy(context.modules, function (moduleRecord) { return readModuleStructureSummary(moduleRecord).steps; }) + '</dd><dt>External Tasks</dt><dd>' + context.submissions.length + '</dd><dt>Visibility</dt><dd>' + escapeHtml(readCourseVisibility(course)) + '</dd><dt>Category</dt><dd>' + escapeHtml(readCourseCategory(course)) + '</dd></dl></article>';
}

function buildModulePerformanceCard(context) {
  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Performance Summary</h3></div><dl class="sa-command-summary-list"><dt>Start Rate</dt><dd>' + context.studentsStarted + '</dd><dt>Completion Count</dt><dd>' + context.studentsCompleted + '</dd><dt>Average Progress</dt><dd>' + escapeHtml(readModuleProgressLabel(context.module, context)) + '</dd><dt>Average Time</dt><dd>' + escapeHtml(readModuleEstimatedTime(context.module)) + '</dd></dl></article>';
}

function buildModuleExternalTaskCard(context) {
  var completed = countItems(context.submissions, function (item) { return readSafeString(item.reviewStatus || item.status) === "complete"; });
  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>External Task Status</h3></div><div class="sa-command-review-ring"><strong>' + context.submissions.length + '</strong><span>Total</span></div><div class="sa-command-review-list"><span><i class="complete"></i>Completed <b>' + completed + '</b></span><span><i></i>Pending Review <b>' + countPendingSubmissions(context.submissions) + '</b></span><span><i class="needs"></i>Needs Work <b>' + countItems(context.submissions, function (item) { return readSafeString(item.reviewStatus || item.status) === "needsWork"; }) + '</b></span></div></article>';
}

function buildSimpleRecordList(title, records) {
  var html = '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>' + escapeHtml(title) + '</h3></div><div class="sa-command-activity-list">';
  records.slice(0, 12).forEach(function (record) {
    html += '<div><span>' + escapeHtml(record.type || record.action || record.status || "Record") + '</span><strong>' + escapeHtml(record.title || record.name || record.message || record.id || "Untitled") + '</strong><small>' + escapeHtml(formatDateTime(record.createdAt || record.updatedAt || record.time)) + '</small></div>';
  });
  html += '</div></article>';
  return html;
}

function buildUserEditModal() {
  var modal = state.userEditModal || createUserEditModalState();

  if (!modal.isOpen || !modal.draft) {
    return "";
  }

  var form = modal.draft;
  var user = findUser(modal.userId) || form;
  var title = form.displayName || form.email || form.userId || "User profile";
  var subtitle = (form.roles || []).map(readRoleLabel).join(" / ") || "No role";
  var actionKey = "update-user:" + modal.userId;
  var html = '<div class="sa-modal-backdrop sa-user-edit-backdrop"><section class="sa-modal sa-user-edit-modal" role="dialog" aria-modal="true" aria-label="Edit user">';

  html += '<div class="sa-user-edit-hero">';
  html += '<div class="sa-user-edit-identity">' + buildAvatar(Object.assign({}, user, form)) + '<div><p class="sa-eyebrow">Edit User</p><h2>' + escapeHtml(title || "Untitled User") + '</h2><div class="sa-user-edit-meta"><span>' + escapeHtml(subtitle) + '</span>' + buildStatusBadge(form.status) + '</div><div class="sa-role-badges">' + buildRoleBadges(form.roles) + '</div></div></div>';
  html += '<button type="button" class="sa-modal-close" data-action="close-user-edit-modal" aria-label="Close user editor">&times;</button>';
  html += '</div>';

  if (modal.error) {
    html += '<div class="sa-message sa-message-error">' + escapeHtml(modal.error) + '</div>';
  }

  html += '<div class="sa-user-edit-body">' + buildUserForm(modal.userId, form, false) + '</div>';
  html += '<div class="sa-modal-actions sa-user-edit-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-user-edit-modal"' + disabled(isBusy()) + '>Cancel</button><button type="button" class="sa-btn" data-action="update-user" data-id="' + escapeHtml(modal.userId) + '"' + disabled(isBusy()) + '>' + buildButtonContent("Save User", actionKey) + '</button></div>';
  html += '</section></div>';

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

  if (isCreate) {
    html += '<div class="sa-location-actions"><button type="button" class="sa-btn" data-action="create-user" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>' + buildButtonContent("Create Profile", "create-user:new") + '</button></div>';
  }

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
  html += '<div class="sa-row-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="edit-location" data-id="' + escapeHtml(location.id) + '"' + disabled(isBusy()) + '>Open Command Center</button><button type="button" class="sa-btn ' + (location.status === "archived" ? "sa-btn-secondary" : "sa-danger-btn") + '" data-action="' + actionName + '" data-id="' + escapeHtml(location.id) + '"' + disabled(isBusy()) + '>' + buildButtonContent(actionLabel, actionName + ":" + location.id) + '</button></div>';
  html += '</div>';

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

function buildLocationCommandCenterModal() {
  var command = state.locationCommandCenter || createLocationCommandCenterState();

  if (!command.isOpen) {
    return "";
  }

  var location = getSafeLocation(findLocation(command.locationId));
  var stats = readLocationCommandStats(location.id);

  return '<div class="sa-location-command-backdrop" role="dialog" aria-modal="true" aria-label="Location Command Center">'
    + '<section class="sa-location-command-modal">'
    + '<header class="sa-location-command-header">'
    + '<div class="sa-location-command-identity">'
    + buildLocationPhoto(location)
    + '<div><div class="sa-location-command-title"><h2>' + escapeHtml(location.name || "Untitled Location") + '</h2>' + createStatusBadge(location.status, { className: "sa-command-status", statusClassPrefix: "sa-command-status-" }) + '</div>'
    + '<p>Location Code: ' + escapeHtml(location.schoolCode || location.loginSlug || location.id) + '<span></span>Created: ' + escapeHtml(formatDateTime(location.createdAt)) + '<span></span>Last Activity: ' + escapeHtml(formatDateTime(readLocationLastActivity(location.id))) + '</p></div>'
    + '</div>'
    + '<div class="sa-location-command-header-actions">'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="location-command-navigate" data-id="users">Open Global View</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="location-command-tab" data-id="loginSettings">More Actions</button>'
    + '<button type="button" class="sa-location-command-close" data-action="close-location-command-center" aria-label="Close">x</button>'
    + '</div>'
    + '</header>'
    + '<div class="sa-location-command-shell">'
    + buildLocationCommandTabs(command.activeTab)
    + '<main class="sa-location-command-content">' + buildLocationCommandBody(command, location, stats) + '</main>'
    + '</div>'
    + '</section>'
    + '</div>';
}

function buildLocationCommandTabs(activeTab) {
  var tabs = [
    { key: "overview", label: "Overview", icon: "⌂" },
    { key: "users", label: "Users", icon: "◉" },
    { key: "classes", label: "Classes", icon: "◫" },
    { key: "courses", label: "Courses", icon: "▣" },
    { key: "assignments", label: "Assignments", icon: "☑" },
    { key: "loginSettings", label: "Login Settings", icon: "⚿" },
    { key: "reports", label: "Reports", icon: "▥" },
    { key: "danger", label: "Danger Zone", icon: "!" }
  ];
  var html = '<nav class="sa-location-command-tabs">';
  var index = 0;

  while (index < tabs.length) {
    html += '<button type="button" class="' + (activeTab === tabs[index].key ? "is-active" : "") + '" data-action="location-command-tab" data-id="' + escapeHtml(tabs[index].key) + '"><span>' + escapeHtml(tabs[index].icon) + '</span>' + escapeHtml(tabs[index].label) + '</button>';
    index = index + 1;
  }

  html += '<small>' + escapeHtml(readRoleLabel(state.actor && state.actor.role ? state.actor.role : "superAdmin")) + '</small></nav>';
  return html;
}

function buildLocationCommandBody(command, location, stats) {
  if (command.activeTab === "users") return buildLocationCommandUsersTab(command, location);
  if (command.activeTab === "classes") return buildLocationCommandClassesTab(location);
  if (command.activeTab === "courses") return buildLocationCommandCoursesTab(location);
  if (command.activeTab === "assignments") return buildLocationCommandAssignmentsTab(location);
  if (command.activeTab === "loginSettings") return buildLocationCommandLoginSettingsTab(location);
  if (command.activeTab === "reports") return buildLocationCommandReportsTab(location);
  if (command.activeTab === "danger") return buildLocationCommandDangerTab(location);
  return buildLocationCommandOverviewTab(command, location, stats);
}

function buildLocationCommandOverviewTab(command, location, stats) {
  return '<section class="sa-location-command-overview">'
    + '<div class="sa-command-kpi-grid">'
    + buildLocationKpiCard("Students", stats.students, "users-student", "blue")
    + buildLocationKpiCard("Teachers", stats.teachers, "users-teacher", "purple")
    + buildLocationKpiCard("Parents", stats.parents, "users-parent", "green")
    + buildLocationKpiCard("Admins", stats.admins, "users-admin", "red")
    + buildLocationKpiCard("Classes", stats.classes, "classes", "sky")
    + buildLocationKpiCard("Courses", stats.courses, "courses", "indigo")
    + buildLocationKpiCard("Assignments", stats.assignments, "assignments", "orange")
    + buildLocationKpiCard("Pending Reviews", stats.pendingReviews, "reviews", "rose")
    + '</div>'
    + '<div class="sa-command-grid sa-command-grid-main">'
    + buildLocationCommandChartCard("Enrollment Trend", command.chartRange, "No enrollment trend data is available for this location yet.")
    + buildLocationCommandChartCard("Activity Trend", command.chartRange, "No activity trend data is available for this location yet.")
    + buildLocationReviewTrendCard(stats)
    + buildLocationRecentActivityCard(location.id)
    + '</div>'
    + '<div class="sa-command-grid sa-command-grid-bottom">'
    + buildLocationQuickActionsCard()
    + buildLocationSummaryCard(location, stats)
    + buildLocationHealthCard(stats)
    + '</div>'
    + '</section>';
}

function buildLocationKpiCard(label, value, target, tone) {
  return '<button type="button" class="sa-command-kpi sa-command-kpi-' + escapeHtml(tone) + '" data-action="location-command-navigate" data-id="' + escapeHtml(target) + '">'
    + '<span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong><small>Open ' + escapeHtml(label) + ' -></small></button>';
}

function buildLocationCommandChartCard(title, range, emptyMessage) {
  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>' + escapeHtml(title) + '</h3>' + buildLocationRangeControl(range) + '</div>'
    + createEmptyState(title + " unavailable", emptyMessage, {
      className: "sa-command-empty",
      titleTag: "strong",
      messageTag: "span"
    })
    + '</article>';
}

function buildLocationRangeControl(range) {
  return '<select data-location-command-filter="chartRange"><option value="week"' + selected(range, "week") + '>7 Days</option><option value="month"' + selected(range, "month") + '>30 Days</option><option value="year"' + selected(range, "year") + '>This Year</option></select>';
}

function buildLocationReviewTrendCard(stats) {
  var total = stats.pendingReviews + stats.completedReviews + stats.needsWorkReviews;

  return '<article class="sa-command-panel sa-command-review-panel"><div class="sa-command-panel-head"><h3>Review Trend</h3></div>'
    + '<div class="sa-command-review-ring"><strong>' + escapeHtml(String(total)) + '</strong><span>Total</span></div>'
    + '<div class="sa-command-review-list"><span><i class="pending"></i>Pending <b>' + stats.pendingReviews + '</b></span><span><i class="complete"></i>Completed <b>' + stats.completedReviews + '</b></span><span><i class="needs"></i>Needs Work <b>' + stats.needsWorkReviews + '</b></span></div>'
    + '</article>';
}

function buildLocationRecentActivityCard(locationId) {
  var activity = readLocationRecentActivity(locationId);
  var html = '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Recent Activity</h3><button type="button" class="sa-text-link" data-action="location-command-tab" data-id="reports">View All</button></div>';

  if (activity.length === 0) {
    return html + createEmptyState("No recent activity.", "Activity logs will appear here when connected to this location.", {
      className: "sa-command-empty",
      titleTag: "strong",
      messageTag: "span"
    }) + '</article>';
  }

  html += '<div class="sa-command-activity-list">';
  activity.slice(0, 6).forEach(function (item) {
    html += '<div><span>' + escapeHtml(item.type) + '</span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(formatDateTime(item.time)) + '</small></div>';
  });
  html += '</div></article>';
  return html;
}

function buildLocationQuickActionsCard() {
  var actions = [
    ["View All Users", "users"],
    ["View Classes", "classes"],
    ["View Courses", "courses"],
    ["View Assignments", "assignments"],
    ["Login Settings", "loginSettings"],
    ["Reports", "reports"]
  ];
  var html = '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Quick Actions</h3></div><div class="sa-command-action-grid">';

  actions.forEach(function (action) {
    var target = action[1] === "loginSettings" || action[1] === "reports" ? "location-command-tab" : "location-command-navigate";
    html += '<button type="button" class="sa-command-action" data-action="' + target + '" data-id="' + escapeHtml(action[1]) + '">' + escapeHtml(action[0]) + '</button>';
  });

  html += '</div></article>';
  return html;
}

function buildLocationSummaryCard(location, stats) {
  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Location Summary</h3></div>'
    + '<dl class="sa-command-summary-list">'
    + '<dt>Location Name</dt><dd>' + escapeHtml(location.name || "Untitled Location") + '</dd>'
    + '<dt>Location Code</dt><dd>' + escapeHtml(location.schoolCode || location.loginSlug || location.id) + '</dd>'
    + '<dt>Status</dt><dd>' + createStatusBadge(location.status, { className: "sa-command-mini-status", statusClassPrefix: "sa-command-status-" }) + '</dd>'
    + '<dt>Students</dt><dd>' + escapeHtml(String(stats.students)) + '</dd>'
    + '<dt>Classes</dt><dd>' + escapeHtml(String(stats.classes)) + '</dd>'
    + '<dt>Primary Language</dt><dd>' + escapeHtml((location.languages && location.languages[0]) || "Not set") + '</dd>'
    + '</dl>'
    + '</article>';
}

function buildLocationHealthCard(stats) {
  var score = 60;
  if (stats.students > 0) score += 10;
  if (stats.teachers > 0) score += 10;
  if (stats.classes > 0) score += 10;
  if (stats.assignments > 0) score += 10;

  return '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Health Score</h3></div>'
    + '<div class="sa-command-health-score"><strong>' + score + '</strong><span>' + (score >= 90 ? "Excellent" : score >= 75 ? "Healthy" : "Needs setup") + '</span></div>'
    + '<div class="sa-command-health-list"><span>Student Activity <b>' + (stats.students > 0 ? "Ready" : "Empty") + '</b></span><span>Teacher Coverage <b>' + (stats.teachers > 0 ? "Ready" : "Missing") + '</b></span><span>Assignments <b>' + (stats.assignments > 0 ? "Ready" : "Empty") + '</b></span></div>'
    + '</article>';
}

function buildLocationCommandUsersTab(command, location) {
  var users = readLocationCommandUsers(location.id, command.userRoleFilter, command.userSearchText);
  var html = '<section class="sa-command-tab-stack"><div class="sa-command-toolbar"><label>Role' + buildBasicOptionsSelect('data-location-command-filter="userRole"', command.userRoleFilter, ["student", "teacher", "parent", "admin", "assistant"], "All") + '</label><label>Search<input data-location-command-filter="userSearch" value="' + escapeHtml(command.userSearchText) + '" placeholder="Name, email, UID"></label></div>';

  if (users.length === 0) {
    return html + createEmptyState("No users found.", "Try another role filter or search term.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table sa-command-users-table"><div class="sa-command-table-head"><span>Avatar</span><span>Name</span><span>Role</span><span>Primary Class</span><span>Status</span></div>';
  users.forEach(function (user) {
    html += '<button type="button" class="sa-command-table-row" data-action="edit-user" data-id="' + escapeHtml(user.id) + '">'
      + '<span>' + buildAvatar(user) + '</span><span><strong>' + escapeHtml(user.displayName || user.name || user.email || user.id) + '</strong><small>' + escapeHtml(user.email || user.id) + '</small></span><span>' + buildRoleBadges(user.roles) + '</span><span>' + escapeHtml(readUserClassSummary(user)) + '</span><span>' + buildStatusBadge(user.status) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildLocationCommandClassesTab(location) {
  var classes = readLocationCommandClasses(location.id);
  var html = '<section class="sa-command-tab-stack">';

  if (classes.length === 0) {
    return html + createEmptyState("No classes found.", "Classes assigned to this location will appear here.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Class</span><span>Teacher</span><span>Students</span><span>Courses</span><span>Status</span></div>';
  classes.forEach(function (classRecord) {
    var form = normalizeClassForm(classRecord);
    html += '<button type="button" class="sa-command-table-row" data-action="location-command-navigate" data-id="classes">'
      + '<span><strong>' + escapeHtml(form.name || form.id || "Untitled class") + '</strong><small>' + escapeHtml(readLocationName(form.locationId)) + '</small></span>'
      + '<span>' + escapeHtml(readTeacherName(form.primaryTeacherId)) + '</span>'
      + '<span>' + countStudentsForClass(form.classId) + '</span>'
      + '<span>' + countAssignmentsForClass(form.classId) + '</span>'
      + '<span>' + buildStatusBadge(form.status) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildLocationCommandCoursesTab(location) {
  var courses = readLocationCommandCourses(location.id);
  var html = '<section class="sa-command-tab-stack">';

  if (courses.length === 0) {
    return html + createEmptyState("No courses found.", "Courses connected by this location's assignments will appear here.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Course</span><span>Assigned Classes</span><span>Assigned Students</span><span>Modules</span><span>Status</span></div>';
  courses.forEach(function (course) {
    var assignmentStats = readCourseAssignmentStatsForLocation(course.id, location.id);
    html += '<button type="button" class="sa-command-table-row" data-action="location-command-navigate" data-id="courses">'
      + '<span><strong>' + escapeHtml(readCourseTitle(course)) + '</strong><small>' + escapeHtml(readCourseDescription(course) || course.id) + '</small></span>'
      + '<span>' + assignmentStats.classes + '</span><span>' + assignmentStats.students + '</span><span>' + readCourseModuleCount(course) + '</span><span>' + buildStatusBadge(course.status || "draft") + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildLocationCommandAssignmentsTab(location) {
  var assignments = readLocationCommandAssignments(location.id);
  var html = '<section class="sa-command-tab-stack">';

  if (assignments.length === 0) {
    return html + createEmptyState("No assignments found.", "Class and student course assignments for this location will appear here.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Course</span><span>Assigned To</span><span>Type</span><span>Assigned Date</span><span>Status</span></div>';
  assignments.forEach(function (assignment) {
    html += '<button type="button" class="sa-command-table-row" data-action="view-assignment" data-id="' + escapeHtml(assignment.id) + '">'
      + '<span><strong>' + escapeHtml(readCourseName(assignment.courseId)) + '</strong><small>' + escapeHtml(assignment.courseId || "") + '</small></span>'
      + '<span>' + escapeHtml(readAssignmentTargetName(assignment)) + '</span>'
      + '<span>' + escapeHtml(assignment.targetType || "class") + '</span>'
      + '<span>' + escapeHtml(formatDateTime(assignment.assignedAt || assignment.createdAt || assignment.updatedAt)) + '</span>'
      + '<span>' + buildStatusBadge(assignment.status || "active") + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildLocationCommandLoginSettingsTab(location) {
  var slug = normalizeLoginSlug(location.loginSlug);
  var loginUrl = slug ? buildLoginLink(slug) : "";

  return '<section class="sa-command-tab-stack">'
    + '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Login Settings</h3></div>'
    + '<dl class="sa-command-summary-list"><dt>Location Name</dt><dd>' + escapeHtml(location.name || "Untitled Location") + '</dd><dt>Location Code</dt><dd>' + escapeHtml(location.schoolCode || location.id) + '</dd><dt>Student Login URL</dt><dd>' + escapeHtml(loginUrl || "Coming Soon") + '</dd><dt>Teacher Login URL</dt><dd>Coming Soon</dd><dt>Parent Login URL</dt><dd>Coming Soon</dd></dl>'
    + '<div class="sa-command-toggle-grid"><span>Student Login <b>' + (location.allowStudentLogin ? "Enabled" : "Disabled") + '</b></span><span>Teacher Login <b>Coming Soon</b></span><span>Parent Login <b>' + (location.parentPortalEnabled ? "Enabled" : "Coming Soon") + '</b></span></div></article>'
    + '<article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Location Profile Editor</h3><p>Existing global location save flow.</p></div>' + buildLocationDetailForm(location.id, location, false) + '</article>'
    + '</section>';
}

function buildLocationCommandReportsTab(location) {
  var sections = ["Enrollment", "Attendance", "Course Completion", "External Tasks", "Intention Points", "Activity Reports"];
  var html = '<section class="sa-command-tab-stack"><div class="sa-command-report-grid">';

  sections.forEach(function (section) {
    html += '<article class="sa-command-panel"><h3>' + escapeHtml(section) + '</h3>' + createEmptyState(section + " report unavailable", "Connect report data to show this location's report.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</article>';
  });

  html += '</div></section>';
  return html;
}

function buildLocationCommandDangerTab(location) {
  return '<section class="sa-command-tab-stack"><article class="sa-command-panel sa-command-danger-panel"><div class="sa-command-panel-head"><h3>Danger Zone</h3></div><p>Destructive operations must run through ICF intents. These controls remain disabled until the matching intents are wired.</p><div class="sa-command-danger-actions"><button type="button" class="sa-btn sa-danger-btn" disabled>Archive Location</button><button type="button" class="sa-btn sa-danger-btn" disabled>Disable Location</button><button type="button" class="sa-btn sa-danger-btn" disabled>Transfer Students</button><button type="button" class="sa-btn sa-danger-btn" disabled>Transfer Teachers</button></div><small>Location: ' + escapeHtml(location.name || location.id) + '</small></article></section>';
}

function buildClassCommandCenterModal() {
  var command = state.classCommandCenter || createClassCommandCenterState();

  if (!command.isOpen) {
    return "";
  }

  var classRecord = findClass(command.classId);

  if (!classRecord) {
    return buildMissingCommandModal("Class Command Center", "Class not found.", "Return to Classes and open a current class.", "close-class-command-center");
  }

  var context = readClassCommandContext(classRecord);

  return createCommandCenterShell({
    label: "Class Command Center",
    header: buildClassCommandHeader(classRecord, context),
    tabsHtml: buildClassCommandTabs(command.activeTab),
    content: buildClassCommandBody(command.activeTab, classRecord, context),
    rightRail: buildClassCommandSideRail(classRecord, context),
    classNames: {
      backdrop: "sa-location-command-backdrop sa-class-command-backdrop",
      modal: "sa-location-command-modal sa-class-command-modal",
      shell: "sa-location-command-shell sa-class-command-shell",
      content: "sa-location-command-content sa-class-command-content"
    }
  });
}

function buildClassCommandHeader(classRecord, context) {
  var form = context.form;

  return createCommandCenterHeader({
    title: form.name || form.classId || "Untitled class",
    avatarHtml: '<span class="sa-class-command-icon sa-class-command-icon-large">' + escapeHtml(readInitials(form.name || form.classId || "CL")) + '</span>',
    statusBadge: createStatusBadge(form.status, { className: "sa-command-status", statusClassPrefix: "sa-command-status-" }),
    metadata: [
      readLocationName(form.locationId) || "No location",
      "Teacher: " + readTeacherName(form.primaryTeacherId),
      "Students: " + context.students.length,
      "Courses: " + context.courses.length,
      "Last Activity: " + readClassLastActivityLabel(context)
    ],
    actions: [
      { label: "Edit Class", action: "class-command-tab", id: "overview", className: "sa-btn sa-btn-secondary" },
      { label: "Assign Course", action: "class-command-tab", id: "assignments", className: "sa-btn sa-btn-secondary" },
      { label: "Manage Students", action: "class-command-tab", id: "students", className: "sa-btn sa-btn-secondary" },
      { label: "Open Teacher View", action: "", id: "", className: "sa-btn sa-btn-secondary", disabled: true },
      { label: "More Actions", action: "class-command-tab", id: "danger", className: "sa-btn sa-btn-secondary" }
    ],
    closeAction: "close-class-command-center",
    classNames: {
      header: "sa-location-command-header sa-class-command-header",
      identity: "sa-location-command-identity sa-class-command-identity",
      titleRow: "sa-location-command-title",
      headerActions: "sa-location-command-header-actions sa-class-command-header-actions",
      closeButton: "sa-location-command-close"
    }
  });
}

function buildClassCommandTabs(activeTab) {
  return createCommandCenterTabs([
    ["overview", "Overview", "O"], ["students", "Students", "S"], ["teachers", "Teachers", "T"], ["courses", "Courses", "C"], ["assignments", "Assignments", "A"], ["activity", "Activity", "V"], ["schedule", "Schedule", "D"], ["reports", "Reports", "R"], ["audit", "Audit Log", "L"], ["danger", "Danger Zone", "!"]
  ], activeTab, {
    action: "class-command-tab",
    className: "sa-location-command-tabs sa-course-command-tabs",
    label: "Class Command Center"
  });
}

function buildClassCommandBody(activeTab, classRecord, context) {
  if (activeTab === "students") return buildClassStudentsTab(classRecord, context);
  if (activeTab === "teachers") return buildClassTeachersTab(classRecord, context);
  if (activeTab === "courses") return buildClassCoursesTab(classRecord, context);
  if (activeTab === "assignments") return buildClassAssignmentsTab(classRecord, context);
  if (activeTab === "activity") return buildClassActivityTab(classRecord, context);
  if (activeTab === "schedule") return buildClassScheduleTab(classRecord, context);
  if (activeTab === "reports") return buildClassReportsTab(classRecord, context);
  if (activeTab === "audit") return buildClassAuditTab(classRecord, context);
  if (activeTab === "danger") return buildClassDangerTab(classRecord, context);
  return buildClassOverviewTab(classRecord, context);
}

function buildClassOverviewTab(classRecord, context) {
  return '<section class="sa-location-command-overview sa-class-command-overview">'
    + createCommandCenterKpiGrid([
      { label: "Students", value: context.students.length, icon: "students", action: "class-command-tab", id: "students", className: "sa-command-kpi", detail: "Enrolled learners" },
      { label: "Teachers", value: context.teachers.length, icon: "teachers", action: "class-command-tab", id: "teachers", className: "sa-command-kpi", detail: "Primary and assistants" },
      { label: "Assigned Courses", value: context.courses.length, icon: "courses", action: "class-command-tab", id: "courses", className: "sa-command-kpi", detail: "Course assignments" },
      { label: "Modules Completed", value: readClassMetricLabel(context, ["modulesCompleted", "completedModules"]), icon: "activity", action: "class-command-tab", id: "activity", className: "sa-command-kpi", detail: "If available" },
      { label: "Steps Completed", value: readClassMetricLabel(context, ["stepsCompleted", "completedSteps"]), icon: "activity", action: "class-command-tab", id: "activity", className: "sa-command-kpi", detail: "If available" },
      { label: "Pending Reviews", value: countPendingSubmissions(context.submissions), icon: "reports", action: "class-command-tab", id: "reports", className: "sa-command-kpi", detail: "External tasks" },
      { label: "Attendance", value: readClassAttendanceLabel(context), icon: "reports", action: "class-command-tab", id: "reports", className: "sa-command-kpi", detail: "If available" },
      { label: "Activity Score", value: readClassActivityScoreLabel(context), icon: "activity", action: "class-command-tab", id: "activity", className: "sa-command-kpi", detail: "If available" }
    ], { className: "sa-command-kpi-grid sa-class-command-kpis" })
    + '<div class="sa-command-grid sa-command-grid-main">'
    + buildUserCommandChartCard("Class Activity Trend", "Class activity trend data is not connected yet.")
    + buildUserCommandChartCard("Course Progress Trend", "Course progress trend data is not connected yet.")
    + buildLocationReviewTrendCard({ pendingReviews: countPendingSubmissions(context.submissions), completedReviews: countReviewedClassSubmissions(context), needsWorkReviews: countNeedsWorkClassSubmissions(context) })
    + buildUserCommandChartCard("Attendance Trend", "Attendance trend data is not connected yet.")
    + '</div><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Edit Class</h3><p>Existing ICF save flow.</p></div>' + buildClassForm(context.form.classId, context.form) + '</article></section>';
}

function buildClassStudentsTab(classRecord, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.students.length === 0) {
    return html + createEmptyState("No students in this class.", "Students assigned to this class will appear here.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table sa-class-students-table"><div class="sa-command-table-head"><span>Avatar</span><span>Name</span><span>Status</span><span>Course Progress</span><span>Pending Reviews</span><span>Last Activity</span><span>Login</span></div>';
  context.students.forEach(function (student) {
    var safeStudent = getSafeUser(student);
    html += '<button type="button" class="sa-command-table-row" data-action="open-user-command-center" data-id="' + escapeHtml(safeStudent.id) + '"><span>' + buildAvatar(safeStudent) + '</span><span><strong>' + escapeHtml(readUserCommandName(safeStudent)) + '</strong><small>' + escapeHtml(safeStudent.email || safeStudent.id) + '</small></span><span>' + buildStatusBadge(safeStudent.status) + '</span><span>' + escapeHtml(readClassStudentProgressLabel(safeStudent, context)) + '</span><span>' + countStudentPendingReviews(safeStudent, context) + '</span><span>' + escapeHtml(formatDateTime(readUserLastActive(safeStudent))) + '</span><span>' + escapeHtml(readUserLoginMethod(safeStudent)) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildClassTeachersTab(classRecord, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.teachers.length === 0) {
    return html + createEmptyState("No teachers assigned.", "Assign a primary teacher or assistants from this class command center.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table sa-class-teachers-table"><div class="sa-command-table-head"><span>Avatar</span><span>Name</span><span>Role</span><span>Courses Taught</span><span>Pending Reviews</span><span>Last Activity</span></div>';
  context.teachers.forEach(function (teacher) {
    var safeTeacher = getSafeUser(teacher);
    html += '<button type="button" class="sa-command-table-row" data-action="open-user-command-center" data-id="' + escapeHtml(safeTeacher.id) + '"><span>' + buildAvatar(safeTeacher) + '</span><span><strong>' + escapeHtml(readUserCommandName(safeTeacher)) + '</strong><small>' + escapeHtml(safeTeacher.email || safeTeacher.id) + '</small></span><span>' + escapeHtml(readClassTeacherRole(safeTeacher, context)) + '</span><span>' + countTeacherCoursesForClass(safeTeacher, context) + '</span><span>' + countPendingSubmissions(context.submissions) + '</span><span>' + escapeHtml(formatDateTime(readUserLastActive(safeTeacher))) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildClassCoursesTab(classRecord, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.courses.length === 0) {
    return html + createEmptyState("No courses assigned.", "Class course assignments will appear here after assignment.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table sa-class-courses-table"><div class="sa-command-table-head"><span>Course</span><span>Progress</span><span>Assigned Students</span><span>Modules</span><span>Pending Reviews</span><span>Status</span></div>';
  context.courses.forEach(function (course) {
    var courseContext = readCourseCommandContext(course);
    html += '<button type="button" class="sa-command-table-row" data-action="open-course-command-center" data-id="' + escapeHtml(course.id || "") + '"><span><strong>' + escapeHtml(readCourseTitle(course)) + '</strong><small>' + escapeHtml(readCourseDescription(course) || course.id || "") + '</small></span><span>' + escapeHtml(readClassCourseProgressLabel(course, context)) + '</span><span>' + context.students.length + '</span><span>' + courseContext.modules.length + '</span><span>' + countPendingSubmissions(readClassCourseSubmissions(course, context)) + '</span><span>' + buildStatusBadge(readCourseStatus(course)) + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildClassAssignmentsTab(classRecord, context) {
  var html = '<section class="sa-command-tab-stack">';

  if (context.assignments.length === 0) {
    return html + createEmptyState("No class assignments found.", "Use the assignment tools to assign courses to this class.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += '<div class="sa-command-table"><div class="sa-command-table-head"><span>Course</span><span>Assignment Date</span><span>Assigned By</span><span>Status</span><span>Visibility</span></div>';
  context.assignments.forEach(function (assignment) {
    html += '<button type="button" class="sa-command-table-row" data-action="view-assignment" data-id="' + escapeHtml(assignment.id || "") + '"><span><strong>' + escapeHtml(readCourseName(assignment.courseId)) + '</strong><small>' + escapeHtml(assignment.courseId || "") + '</small></span><span>' + escapeHtml(formatDateTime(assignment.assignedAt || assignment.createdAt || assignment.updatedAt)) + '</span><span>' + escapeHtml(readAssignmentActorName(assignment)) + '</span><span>' + buildStatusBadge(assignment.status || "active") + '</span><span>' + escapeHtml(assignment.visibility || "visible") + '</span></button>';
  });
  html += '</div></section>';
  return html;
}

function buildClassActivityTab(classRecord, context) {
  var records = context.activity.concat(context.submissions.map(function (submission) {
    return {
      type: "External Task",
      title: submission.stepTitle || submission.title || "External task submission",
      time: normalizeTimestamp(submission.updatedAt || submission.createdAt),
      status: submission.reviewStatus || submission.status || "pending"
    };
  })).sort(compareByTimeDesc);
  var html = '<section class="sa-command-tab-stack">';

  if (records.length === 0) {
    return html + createEmptyState("No recent activity.", "Module completions, step completions, submissions, reviews, and course opens will appear here when connected.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  html += buildSimpleRecordList("Class Activity", records);
  html += '</section>';
  return html;
}

function buildClassScheduleTab(classRecord, context) {
  var schedule = readClassScheduleRecords(classRecord);

  if (schedule.length === 0) {
    return '<section class="sa-command-tab-stack">' + createEmptyState("No schedule data yet.", "Class schedule records are not connected to this class yet.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</section>';
  }

  return '<section class="sa-command-tab-stack">' + buildSimpleRecordList("Class Schedule", schedule) + '</section>';
}

function buildClassReportsTab(classRecord, context) {
  var reports = ["Attendance", "Course Completion", "External Tasks", "Intention Points", "Activity"];
  var html = '<section class="sa-command-tab-stack"><div class="sa-command-report-grid">';

  reports.forEach(function (report) {
    html += '<article class="sa-command-panel"><h3>' + escapeHtml(report) + '</h3>' + createEmptyState(report + " report unavailable", "Connect report data to show this class report.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" }) + '</article>';
  });

  html += '</div></section>';
  return html;
}

function buildClassAuditTab(classRecord, context) {
  return '<section class="sa-command-tab-stack">' + (context.audit.length ? buildSimpleRecordList("Audit Log", context.audit) : createEmptyState("No audit log entries yet.", "Audit records will appear here when connected to this class.", { className: "sa-command-empty", titleTag: "strong", messageTag: "span" })) + '</section>';
}

function buildClassDangerTab(classRecord, context) {
  return '<section class="sa-command-tab-stack">' + createCommandCenterDangerZone({
    className: "sa-command-panel sa-command-danger-panel",
    actionsClassName: "sa-command-danger-actions",
    message: "Destructive class actions remain disabled unless the matching ICF intent is implemented and explicitly wired.",
    actions: [
      { label: "Archive Class", className: "sa-btn sa-danger-btn", disabled: true },
      { label: "Restore Class", className: "sa-btn sa-danger-btn", disabled: true },
      { label: "Transfer Students", className: "sa-btn sa-danger-btn", disabled: true },
      { label: "Delete Class", className: "sa-btn sa-danger-btn", disabled: true }
    ],
    footerHtml: '<small>Class: ' + escapeHtml(context.form.name || context.form.classId) + '</small>'
  }) + '</section>';
}

function buildClassCommandSideRail(classRecord, context) {
  return '<aside class="sa-user-command-rail sa-class-command-rail"><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Class Staff</h3></div><div class="sa-user-command-quick-list"><button data-action="open-class-teacher-picker" data-id="' + escapeHtml(context.form.classId) + '">Assign Teacher</button><button data-action="open-class-assistant-picker" data-id="' + escapeHtml(context.form.classId) + '">Manage Assistants</button><button data-action="class-command-tab" data-id="students">Manage Students</button><button data-action="class-command-tab" data-id="assignments">Assign Course</button></div></article><article class="sa-command-panel"><div class="sa-command-panel-head"><h3>Class Summary</h3></div><dl class="sa-command-summary-list"><dt>Location</dt><dd>' + escapeHtml(readLocationName(context.form.locationId)) + '</dd><dt>Teacher</dt><dd>' + escapeHtml(readTeacherName(context.form.primaryTeacherId)) + '</dd><dt>Students</dt><dd>' + context.students.length + '</dd><dt>Courses</dt><dd>' + context.courses.length + '</dd><dt>Pending Reviews</dt><dd>' + countPendingSubmissions(context.submissions) + '</dd></dl></article></aside>';
}

function buildClassesTab() {
  return '<section class="sa-stack">'
    + '<article class="sa-card"><h2>Create Class / Group</h2>' + buildClassForm("new", state.classForm) + '</article>'
    + '<article class="sa-card"><h2>Classes</h2>' + buildClassFilterToolbar() + buildClassRows() + '</article>'
    + '</section>';
}

function buildClassFilterToolbar() {
  var visibleClasses = readVisibleClasses();
  var selectedLocationName = state.filters.locationId ? readLocationName(state.filters.locationId) : "All Locations";
  var loadingText = state.isRefreshing && state.classes.length === 0 ? "Loading classes..." : "Showing " + visibleClasses.length + " " + (visibleClasses.length === 1 ? "class" : "classes");

  return '<div class="sa-class-filter-toolbar">'
    + '<label>Location' + buildOptionsSelect('data-class-location-filter="true"', state.filters.locationId, state.locations, "All Locations") + '</label>'
    + '<div class="sa-class-filter-summary"><strong>' + escapeHtml(loadingText) + '</strong><span>' + escapeHtml(selectedLocationName) + '</span></div>'
    + '</div>';
}

function buildClassRows() {
  var classes = readVisibleClasses();
  var html = '<div class="sa-class-command-grid">';
  var index = 0;

  if (state.isRefreshing && state.classes.length === 0) {
    return buildInlineLoadingState("Loading classes...", "Class records are being refreshed.", "classes");
  }

  if (state.classes.length === 0) {
    return '<div class="sa-empty">No classes found.</div>';
  }

  if (classes.length === 0) {
    return '<div class="sa-empty"><strong>No classes found for this location.</strong><span>Select All Locations to see every class.</span></div>';
  }

  while (index < classes.length) {
    var classRecord = classes[index];
    html += buildClassOwnershipRow(classRecord);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildClassOwnershipRow(classRecord) {
  var form = normalizeClassForm(classRecord);
  var primaryTeacher = findUser(form.primaryTeacherId);
  var assistants = readUsersByIds(form.assistantIds);
  var context = readClassCommandContext(classRecord);

  return '<article class="sa-row sa-class-row sa-class-command-card">'
    + '<button type="button" class="sa-class-command-open" data-action="open-class-command-center" data-id="' + escapeHtml(form.classId) + '">'
    + '<span class="sa-class-command-icon">' + escapeHtml(readInitials(form.name || form.classId || "CL")) + '</span>'
    + '<span class="sa-class-command-main"><strong>' + escapeHtml(form.name || form.classId || "Untitled class") + '</strong><small>' + escapeHtml(readLocationName(form.locationId) || "No location") + '</small></span>'
    + '<span><strong>' + escapeHtml(readTeacherName(form.primaryTeacherId)) + '</strong><small>Primary teacher</small></span>'
    + '<span><strong>' + context.students.length + '</strong><small>Students</small></span>'
    + '<span><strong>' + context.courses.length + '</strong><small>Courses</small></span>'
    + '<span><strong>' + countPendingSubmissions(context.submissions) + '</strong><small>Pending reviews</small></span>'
    + '<span><strong>' + escapeHtml(readClassActivityStatus(context)) + '</strong><small>Activity</small></span>'
    + '<span>' + buildStatusBadge(form.status || "active") + '<small>Open Command Center</small></span>'
    + '<span><strong>Actions</strong><small>Open / assign / manage</small></span>'
    + '</button>'
    + '<div class="sa-class-staff-grid">'
    + buildClassStaffPanel("Class Teacher", primaryTeacher ? [primaryTeacher] : [], "No teacher assigned")
    + buildClassStaffPanel("Assistants", assistants, "None")
    + '</div>'
    + '<div class="sa-class-command-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="open-class-command-center" data-id="' + escapeHtml(form.classId) + '"' + disabled(isBusy()) + '>Open Command Center</button><button type="button" class="sa-btn sa-btn-secondary" data-action="open-class-teacher-picker" data-id="' + escapeHtml(form.classId) + '"' + disabled(isBusy()) + '>Assign Teacher</button><button type="button" class="sa-btn sa-btn-secondary" data-action="open-class-assistant-picker" data-id="' + escapeHtml(form.classId) + '"' + disabled(isBusy()) + '>Manage Assistants</button></div>'
    + '</article>';
}

function buildClassStaffPanel(label, users, emptyLabel) {
  var html = '<section class="sa-class-staff-panel"><span>' + escapeHtml(label) + '</span>';

  if (!users || users.length === 0) {
    return html + '<div class="sa-staff-empty">' + escapeHtml(emptyLabel) + '</div></section>';
  }

  html += '<div class="sa-staff-chip-list">';
  users.forEach(function (user) {
    html += buildStaffChip(getSafeUser(user));
  });
  html += '</div></section>';
  return html;
}

function buildStaffChip(user) {
  var name = user.displayName || user.email || user.id;
  return '<span class="sa-staff-chip"><span class="sa-staff-avatar">' + escapeHtml(readInitials(name)) + '</span><span><strong>' + escapeHtml(name) + '</strong><small>' + escapeHtml(user.roles.map(readRoleLabel).join(", ") || "Staff") + '</small></span></span>';
}

function buildClassForm(formId, form) {
  var actionName = formId === "new" ? "create-class" : "update-class";
  var buttonLabel = formId === "new" ? "Create" : "Save";

  return '<div class="sa-form sa-form-6 sa-class-form">'
    + buildInput("class", formId, "name", "Name", form.name)
    + buildLocationSelect("class", formId, form.locationId)
    + buildSelect("class", formId, "status", form.status, ["active", "inactive", "archived"])
    + buildSelect("class", formId, "isVisible", form.isVisible ? "true" : "false", ["true", "false"])
    + buildInput("class", formId, "photoDataUrl", "Photo URL", form.photoDataUrl)
    + '<button type="button" class="sa-btn" data-action="' + actionName + '" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>' + buildButtonContent(buttonLabel, actionName + ":" + formId) + '</button>'
    + buildClassStaffActions(formId, form)
    + '</div>';
}

function buildClassStaffActions(formId, form) {
  if (formId === "new") {
    return '<div class="sa-class-staff-actions"><span class="sa-staff-empty">Save the class before assigning staff.</span></div>';
  }

  return '<div class="sa-class-staff-actions">'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-class-teacher-picker" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>Assign Teacher</button>'
    + '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-class-assistant-picker" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>Manage Assistants</button>'
    + '<input type="hidden" data-field-kind="class" data-field-id="' + escapeHtml(formId) + '" data-field="primaryTeacherId" value="' + escapeHtml(form.primaryTeacherId) + '">'
    + '<input type="hidden" data-field-kind="class" data-field-id="' + escapeHtml(formId) + '" data-field="assistantIds" value="' + escapeHtml(form.assistantIds.join(",")) + '">'
    + '</div>';
}

function readVisibleClasses() {
  var classes = readVisibleClassesForLocation(state.filters.locationId);

  return classes.sort(function (a, b) {
    return readSafeString(a.name || a.title || a.id).localeCompare(readSafeString(b.name || b.title || b.id));
  });
}

function classMatchesLocationFilter(classRecord, selectedLocationId) {
  if (!selectedLocationId) {
    return true;
  }

  var location = findLocation(selectedLocationId);
  var locationNames = [
    readSafeString(location.name),
    readSafeString(location.displayName),
    readSafeString(location.title)
  ].filter(Boolean).map(function (value) {
    return value.toLowerCase();
  });
  var classLocationIds = readClassLocationIds(classRecord);
  var classLocationNames = [
    classRecord && classRecord.locationName,
    classRecord && classRecord.schoolName,
    classRecord && classRecord.locName
  ].map(readSafeString).filter(Boolean).map(function (value) {
    return value.toLowerCase();
  });

  if (classLocationIds.indexOf(selectedLocationId) !== -1) {
    return true;
  }

  return classLocationNames.some(function (name) {
    return locationNames.indexOf(name) !== -1;
  });
}

function readClassLocationIds(classRecord) {
  return normalizeIdList([
    classRecord && classRecord.locationId,
    classRecord && classRecord.locId,
    classRecord && classRecord.schoolId,
    classRecord && classRecord.primaryLocationId,
    classRecord && classRecord.locationIds,
    classRecord && classRecord.schoolIds
  ]);
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
  var actionName = formId === "new" ? "create-student" : "update-student";
  var buttonLabel = formId === "new" ? "Create Student" : "Save Student";
  var html = '<div class="sa-form sa-form-student">';

  html += buildInput("student", formId, "name", "Name", form.name);
  html += buildLocationSelect("student", formId, form.locationId);
  html += buildClassSelect("student", formId, form.classId);
  html += buildSelect("student", formId, "status", form.status, ["active", "inactive", "archived", "approved"]);
  html += buildInput("student", formId, "photoUrl", "Photo URL", form.photoUrl);
  html += buildInput("student", formId, "email", "Email", form.email);
  html += buildInput("student", formId, "username", "Username", form.username);
  html += '<button type="button" class="sa-btn" data-action="' + actionName + '" data-id="' + escapeHtml(formId) + '"' + disabled(isBusy()) + '>' + buildButtonContent(buttonLabel, actionName + ":" + formId) + '</button>';
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
  html += '<section class="sa-assignment-step sa-assignment-staff-step"><span>4</span><h3>Course Staff</h3><p>Choose the course teacher and assistants for this assignment.</p>'
    + buildAssignmentStaffSummary(form)
    + '<div class="sa-class-staff-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="open-new-assignment-teacher-picker"' + disabled(isBusy()) + '>Assign Teacher</button><button type="button" class="sa-btn sa-btn-secondary" data-action="open-new-assignment-assistant-picker"' + disabled(isBusy()) + '>Manage Assistants</button></div>'
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

function buildAssignmentStaffSummary(record) {
  var safeRecord = normalizeAssignmentOwnership(record || {});
  var responsibleTeacher = findUser(safeRecord.responsibleTeacherId);
  var assistants = readUsersByIds(safeRecord.assistantIds);
  var assistantIndex = 0;

  if (!responsibleTeacher && safeRecord.responsibleTeacherId && safeRecord.responsibleTeacherName) {
    responsibleTeacher = {
      id: safeRecord.responsibleTeacherId,
      displayName: safeRecord.responsibleTeacherName,
      roles: ["teacher"]
    };
  }

  while (assistantIndex < safeRecord.assistantIds.length) {
    if (!assistants.some(function (assistant) { return assistant.id === safeRecord.assistantIds[assistantIndex]; }) && safeRecord.assistantNames[assistantIndex]) {
      assistants.push({
        id: safeRecord.assistantIds[assistantIndex],
        displayName: safeRecord.assistantNames[assistantIndex],
        roles: ["assistant"]
      });
    }
    assistantIndex = assistantIndex + 1;
  }

  return '<div class="sa-assignment-staff-summary">'
    + buildClassStaffPanel("Teacher", responsibleTeacher ? [responsibleTeacher] : [], "No teacher assigned")
    + buildClassStaffPanel("Assistants", assistants, "None")
    + '</div>';
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
    html += '<div class="sa-assignment-staff-cell">' + buildAssignmentStaffSummary(assignment) + '</div>';
    html += '<div><span class="sa-status sa-status-' + escapeHtml(assignment.status || "active") + '">' + escapeHtml(assignment.status || "active") + '</span><small>Assigned: ' + escapeHtml(assignedDate || "unknown") + '</small></div>';
    html += '<div class="sa-row-actions">';
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-assignment-teacher-picker" data-id="' + escapeHtml(assignment.id) + '"' + disabled(isBusy()) + '>Assign Teacher</button>';
    html += '<button type="button" class="sa-btn sa-btn-secondary" data-action="open-assignment-assistant-picker" data-id="' + escapeHtml(assignment.id) + '"' + disabled(isBusy()) + '>Manage Assistants</button>';
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

function buildClassStaffPickerModal() {
  var picker = state.classStaffPicker;

  if (!picker || !picker.isOpen) {
    return "";
  }

  var classRecord = findClass(picker.classId);
  var users = readClassStaffPickerUsers(picker);
  var isPrimary = picker.mode === "primary";
  var title = isPrimary ? "Assign Teacher" : "Manage Assistants";
  var html = '<div class="sa-modal-backdrop sa-class-staff-backdrop"><section class="sa-modal sa-class-staff-modal" role="dialog" aria-modal="true">';

  html += '<div class="sa-section-title"><div><p class="sa-eyebrow">Class Staff</p><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(classRecord.name || picker.classId || "Class") + '</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="close-class-staff-picker">Close</button></div>';
  html += '<div class="sa-form"><label>Search<input type="search" data-class-staff-picker-search="true" value="' + escapeHtml(picker.searchText) + '" placeholder="Search name, role, location, or email"></label></div>';
  html += '<div class="sa-staff-picker-list">';

  if (users.length === 0) {
    html += '<div class="sa-empty"><strong>No staff found.</strong><span>Try a different search or confirm the user has teacher or assistant role.</span></div>';
  } else {
    users.forEach(function (user) {
      var selectedUser = getSafeUser(user);
      var isSelected = picker.selectedIds.indexOf(selectedUser.id) !== -1;
      html += '<button type="button" class="sa-staff-picker-row' + (isSelected ? ' is-selected' : '') + '" data-class-staff-picker-id="' + escapeHtml(selectedUser.id) + '">'
        + buildStaffChip(selectedUser)
        + '<span class="sa-staff-picker-meta">' + escapeHtml(readUserLocationSummary(selectedUser)) + '</span>'
        + '<small>' + escapeHtml(selectedUser.email || "No email") + '</small>'
        + '<em>' + (isSelected ? "Selected" : (isPrimary ? "Assign" : "Add")) + '</em>'
        + '</button>';
    });
  }

  html += '</div><div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-class-staff-picker">Cancel</button><button type="button" class="sa-btn" data-action="save-class-staff-picker" data-id="' + escapeHtml(picker.classId) + '"' + disabled(isPrimary && picker.selectedIds.length > 1) + '>' + buildButtonContent(isPrimary ? "Save Teacher" : "Save Assistants", "class-staff:" + picker.classId) + '</button></div></section></div>';
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
    html += buildInlineLoadingState("Loading courses...", "Preparing the course picker.", "courses");
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
    html += buildInlineLoadingState("Loading targets...", "Preparing classes and students.", "targets");
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

function buildAssignmentStaffPickerModal() {
  var picker = state.assignmentStaffPicker;

  if (!picker || !picker.isOpen) {
    return "";
  }

  var assignment = picker.assignmentId === "new" ? state.assignmentForm : findAssignment(picker.assignmentId);
  var users = readAssignmentStaffPickerUsers(picker, assignment || {});
  var isResponsible = picker.mode === "responsible";
  var title = isResponsible ? "Assign Teacher" : "Manage Assistants";
  var assignmentLabel = assignment && assignment.courseId ? readCourseName(assignment.courseId) : "New assignment";
  var html = '<div class="sa-modal-backdrop sa-assignment-staff-backdrop"><section class="sa-modal sa-class-staff-modal" role="dialog" aria-modal="true">';

  html += '<div class="sa-section-title"><div><p class="sa-eyebrow">Course Staff</p><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(assignmentLabel) + '</p></div><button type="button" class="sa-btn sa-btn-secondary" data-action="close-assignment-staff-picker">Close</button></div>';
  html += '<div class="sa-form"><label>Search<input type="search" data-assignment-staff-picker-search="true" value="' + escapeHtml(picker.searchText) + '" placeholder="Search name, role, location, or email"></label></div>';
  html += '<div class="sa-staff-picker-list">';

  if (users.length === 0) {
    html += '<div class="sa-empty"><strong>No staff found.</strong><span>Try a different search or confirm the user has teacher or assistant role.</span></div>';
  } else {
    users.forEach(function (user) {
      var selectedUser = getSafeUser(user);
      var isSelected = picker.selectedIds.indexOf(selectedUser.id) !== -1;
      html += '<button type="button" class="sa-staff-picker-row' + (isSelected ? ' is-selected' : '') + '" data-assignment-staff-picker-id="' + escapeHtml(selectedUser.id) + '">'
        + buildStaffChip(selectedUser)
        + '<span class="sa-staff-picker-meta">' + escapeHtml(readUserLocationSummary(selectedUser)) + '</span>'
        + '<small>' + escapeHtml(selectedUser.email || "No email") + '</small>'
        + '<em>' + (isSelected ? "Selected" : (isResponsible ? "Assign" : "Add")) + '</em>'
        + '</button>';
    });
  }

  html += '</div><div class="sa-modal-actions"><button type="button" class="sa-btn sa-btn-secondary" data-action="close-assignment-staff-picker">Cancel</button><button type="button" class="sa-btn" data-action="save-assignment-staff-picker" data-id="' + escapeHtml(picker.assignmentId) + '"' + disabled(isResponsible && picker.selectedIds.length > 1) + '>' + buildButtonContent(isResponsible ? "Save Teacher" : "Save Assistants", "assignment-staff:" + picker.assignmentId) + '</button></div></section></div>';
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
  var classStaffPickerButton = event.target.closest("[data-class-staff-picker-id]");
  var assignmentStaffPickerButton = event.target.closest("[data-assignment-staff-picker-id]");

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

  if (classStaffPickerButton) {
    toggleClassStaffSelection(classStaffPickerButton.getAttribute("data-class-staff-picker-id"));
    return;
  }

  if (assignmentStaffPickerButton) {
    toggleAssignmentStaffSelection(assignmentStaffPickerButton.getAttribute("data-assignment-staff-picker-id"));
    return;
  }

  if (actionButton) {
    if (isBusy() && !canRunActionWhileBusy(actionButton.getAttribute("data-action"))) {
      return;
    }

    handleAction(actionButton.getAttribute("data-action"), actionButton.getAttribute("data-id"));
  }
}

function canRunActionWhileBusy(action) {
  if (action === "copy-login-link") {
    return true;
  }

  if (action === "edit-user" || action === "open-user-command-center" || action === "close-user-command-center" || action === "user-command-tab" || action === "open-user-edit-modal" || action === "close-user-edit-modal") {
    return true;
  }

  if (action === "open-course-command-center" || action === "close-course-command-center" || action === "course-command-tab" || action === "open-module-command-center" || action === "close-module-command-center" || action === "module-command-tab") {
    return true;
  }

  if (action === "open-class-command-center" || action === "close-class-command-center" || action === "class-command-tab") {
    return true;
  }

  if (!state.isSaving && state.isRefreshing && (action === "edit-user" || action === "open-user-command-center" || action === "close-user-command-center" || action === "user-command-tab" || action === "open-user-edit-modal" || action === "close-user-edit-modal")) {
    return true;
  }

  return false;
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

  if (target.getAttribute("data-class-location-filter")) {
    applyClassLocationFilter(target.value);
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

  if (target.getAttribute("data-assignment-staff-picker-search")) {
    state.assignmentStaffPicker.searchText = target.value;
    render();
    return;
  }

  if (target.getAttribute("data-user-filter")) {
    if (target.getAttribute("data-user-filter") === "role") {
      applyUserRoleFilter(target.value, false);
      return;
    }

    setState({
      userFilters: Object.assign({}, state.userFilters, {
        [target.getAttribute("data-user-filter")]: target.value
      }),
      activeUserId: "",
      userEditModal: createUserEditModalState()
    });
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

  if (target.getAttribute("data-location-command-filter")) {
    updateLocationCommandFilter(target.getAttribute("data-location-command-filter"), target.value);
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

  if (target.getAttribute("data-class-staff-picker-search")) {
    state.classStaffPicker.searchText = target.value;
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

function updateLocationCommandFilter(field, value) {
  var nextState = Object.assign({}, state.locationCommandCenter);

  if (field === "userRole") {
    nextState.userRoleFilter = readSafeString(value);
  } else if (field === "userSearch") {
    nextState.userSearchText = readSafeString(value);
  } else if (field === "chartRange") {
    nextState.chartRange = readSafeString(value) || "month";
  }

  state.locationCommandCenter = nextState;
  render();
}

function openLocationCommandCenter(locationId) {
  var location = findLocation(locationId);

  if (!location || !location.id) {
    setState({ message: "Location was not found.", messageType: "error" });
    return;
  }

  console.info("[location-command-center:open]", {
    locationId: location.id,
    locationName: location.name || ""
  });

  setState({
    activeLocationId: location.id,
    locationCreateOpen: false,
    locationCommandCenter: Object.assign(createLocationCommandCenterState(), {
      isOpen: true,
      locationId: location.id
    }),
    message: ""
  });
}

function closeLocationCommandCenter() {
  setState({
    locationCommandCenter: createLocationCommandCenterState(),
    activeLocationId: "",
    message: ""
  });
}

function setLocationCommandCenterTab(tabKey) {
  var safeTab = readSafeString(tabKey) || "overview";

  setState({
    locationCommandCenter: Object.assign({}, state.locationCommandCenter, {
      activeTab: safeTab
    }),
    message: ""
  });
}

function navigateFromLocationCommandCenter(target) {
  var command = state.locationCommandCenter || createLocationCommandCenterState();
  var locationId = command.locationId || state.activeLocationId;

  if (!locationId) {
    return;
  }

  if (target === "users-student" || target === "users-teacher" || target === "users-parent" || target === "users-admin" || target === "users-assistant" || target === "users") {
    var role = "";

    if (target === "users-student") role = "student";
    if (target === "users-teacher") role = "teacher";
    if (target === "users-parent") role = "parent";
    if (target === "users-admin") role = "admin";
    if (target === "users-assistant") role = "assistant";

    setState({
      activeTab: "users",
      userFilters: Object.assign({}, state.userFilters, {
        locationId: locationId,
        role: role
      }),
      locationCommandCenter: createLocationCommandCenterState(),
      activeUserId: "",
      message: ""
    });
    return;
  }

  if (target === "classes") {
    applyClassLocationFilter(locationId);
    state.locationCommandCenter = createLocationCommandCenterState();
    state.activeTab = "classes";
    state.activeLocationId = "";
    render();
    return;
  }

  if (target === "courses") {
    setState({
      activeTab: "lessons",
      locationCommandCenter: createLocationCommandCenterState(),
      activeLocationId: "",
      message: "Course inventory opened. Use existing course tools for editing.",
      messageType: "info"
    });
    return;
  }

  if (target === "assignments" || target === "reviews") {
    setState({
      activeTab: "assignments",
      assignmentFilters: Object.assign({}, state.assignmentFilters, {
        targetType: target === "assignments" ? "" : state.assignmentFilters.targetType
      }),
      locationCommandCenter: createLocationCommandCenterState(),
      activeLocationId: "",
      message: target === "reviews" ? "Pending review data is shown in existing review tools when available." : "",
      messageType: target === "reviews" ? "info" : state.messageType
    });
  }
}

async function openClassCommandCenter(classId) {
  var classRecord = findById(state.classes, classId);

  if (!classRecord) {
    setState({ message: "Class was not found.", messageType: "error" });
    return;
  }

  var form = normalizeClassForm(classRecord);

  console.info("[class-command-center:open]", {
    classId: form.classId,
    className: form.name || ""
  });

  try {
    await runAdminIntent("OpenClassCommandCenterIntent", { classId: form.classId });
  } catch (error) {
    console.warn("[class-command-center:intent-warning]", {
      classId: form.classId,
      errorMessage: error && error.message ? error.message : String(error)
    });
  }

  setState({
    activeTab: "classes",
    classCommandCenter: Object.assign(createClassCommandCenterState(), {
      isOpen: true,
      classId: form.classId
    }),
    message: ""
  });
}

function closeClassCommandCenter() {
  setState({
    classCommandCenter: createClassCommandCenterState(),
    message: ""
  });
}

function setClassCommandCenterTab(tabKey) {
  setState({
    classCommandCenter: Object.assign({}, state.classCommandCenter, {
      activeTab: readSafeString(tabKey) || "overview"
    }),
    message: ""
  });
}

async function openUserCommandCenter(userId) {
  var user = findUser(userId);

  if (!user || !user.id) {
    setState({ message: "User was not found.", messageType: "error" });
    return;
  }

  console.info("[user-command-center:open]", {
    userId: user.id,
    roles: getSafeUser(user).roles
  });

  try {
    await runAdminIntent("OpenUserCommandCenterIntent", { userId: user.id });
  } catch (error) {
    console.warn("[user-command-center:intent-warning]", {
      userId: user.id,
      errorMessage: error && error.message ? error.message : String(error)
    });
  }

  setState({
    activeUserId: user.id,
    userCreateOpen: false,
    userCommandCenter: Object.assign(createUserCommandCenterState(), {
      isOpen: true,
      userId: user.id
    }),
    message: ""
  });
}

function closeUserCommandCenter() {
  setState({
    userCommandCenter: createUserCommandCenterState(),
    activeUserId: "",
    message: ""
  });
}

function setUserCommandCenterTab(tabKey) {
  var safeTab = readSafeString(tabKey) || "overview";

  setState({
    userCommandCenter: Object.assign({}, state.userCommandCenter, {
      activeTab: safeTab
    }),
    message: ""
  });
}

function navigateFromUserCommandCenter(target) {
  var command = state.userCommandCenter || createUserCommandCenterState();
  var user = getSafeUser(findUser(command.userId));

  if (!user.id) {
    return;
  }

  if (target === "classes") {
    setState({
      activeTab: "classes",
      filters: Object.assign({}, state.filters, {
        locationId: user.primaryLocationId || user.locationIds[0] || "",
        classId: user.classId || ""
      }),
      userCommandCenter: createUserCommandCenterState(),
      activeUserId: "",
      message: "Class tools opened for " + readUserCommandName(user) + ".",
      messageType: "info"
    });
    return;
  }

  if (target === "lessons") {
    setState({
      activeTab: "lessons",
      userCommandCenter: createUserCommandCenterState(),
      activeUserId: "",
      message: "Course tools opened. Use existing global filters for editing.",
      messageType: "info"
    });
  }
}

async function openCourseCommandCenter(courseId) {
  var course = findCourse(courseId);

  if (!course || !course.id) {
    setState({ message: "Course was not found.", messageType: "error" });
    return;
  }

  console.info("[course-command-center:open]", {
    courseId: course.id,
    title: readCourseTitle(course)
  });

  try {
    await runAdminIntent("OpenCourseCommandCenterIntent", { courseId: course.id });
  } catch (error) {
    console.warn("[course-command-center:intent-warning]", {
      courseId: course.id,
      errorMessage: error && error.message ? error.message : String(error)
    });
  }

  setState({
    activeTab: "lessons",
    courseCommandCenter: Object.assign(createCourseCommandCenterState(), {
      isOpen: true,
      courseId: course.id
    }),
    moduleCommandCenter: createModuleCommandCenterState(),
    message: ""
  });
}

function closeCourseCommandCenter() {
  setState({
    courseCommandCenter: createCourseCommandCenterState(),
    moduleCommandCenter: createModuleCommandCenterState(),
    message: ""
  });
}

function setCourseCommandCenterTab(tabKey) {
  setState({
    courseCommandCenter: Object.assign({}, state.courseCommandCenter, {
      activeTab: readSafeString(tabKey) || "overview"
    }),
    message: ""
  });
}

async function openModuleCommandCenter(value) {
  var ids = parseCourseModuleActionId(value);
  var moduleRecord = findModuleForCourse(ids.courseId, ids.moduleId);

  if (!moduleRecord || !moduleRecord.id) {
    setState({ message: "Module was not found.", messageType: "error" });
    return;
  }

  console.info("[module-command-center:open]", {
    courseId: ids.courseId,
    moduleId: moduleRecord.id,
    title: readModuleTitle(moduleRecord)
  });

  try {
    await runAdminIntent("OpenModuleCommandCenterIntent", {
      courseId: ids.courseId,
      moduleId: moduleRecord.id
    });
  } catch (error) {
    console.warn("[module-command-center:intent-warning]", {
      courseId: ids.courseId,
      moduleId: moduleRecord.id,
      errorMessage: error && error.message ? error.message : String(error)
    });
  }

  setState({
    moduleCommandCenter: Object.assign(createModuleCommandCenterState(), {
      isOpen: true,
      courseId: ids.courseId,
      moduleId: moduleRecord.id
    }),
    message: ""
  });
}

function closeModuleCommandCenter() {
  setState({
    moduleCommandCenter: createModuleCommandCenterState(),
    message: ""
  });
}

function setModuleCommandCenterTab(tabKey) {
  setState({
    moduleCommandCenter: Object.assign({}, state.moduleCommandCenter, {
      activeTab: readSafeString(tabKey) || "overview"
    }),
    message: ""
  });
}

function parseCourseModuleActionId(value) {
  var parts = readSafeString(value).split("::");

  return {
    courseId: parts[0] || "",
    moduleId: parts[1] || ""
  };
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
  } else if (kind === "user") {
    updateUserEditDraft(id, field, value);
  } else if (kind === "assignment" && id === "new") {
    updateAssignmentFormValue(field, value);
    render();
  } else {
    updateExistingRecord(kind, id, field, value);
  }
}

function updateUserEditDraft(userId, field, value) {
  var draft = readMutableUserFormDraft(userId);

  if (!draft) {
    return;
  }

  setUserFormValue(draft, field, value);
  state.userEditModal.error = "";

  if (shouldRerenderUserFormField(field)) {
    render();
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

      if (kind === "class") {
        setClassFormValue(list[index], field, value);
        render();
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
  var form = readUserFormDraft(formId);
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

function openClassStaffPicker(classId, mode) {
  var classRecord = findClass(classId);
  var form = normalizeClassForm(classRecord);
  var selectedIds = mode === "assistants" ? form.assistantIds.slice() : (form.primaryTeacherId ? [form.primaryTeacherId] : []);

  state.classStaffPicker = {
    isOpen: true,
    classId: classId,
    mode: mode === "assistants" ? "assistants" : "primary",
    searchText: "",
    selectedIds: selectedIds
  };
  render();
}

function closeClassStaffPicker() {
  state.classStaffPicker = {
    isOpen: false,
    classId: "",
    mode: "primary",
    searchText: "",
    selectedIds: []
  };
  render();
}

function toggleClassStaffSelection(userId) {
  var picker = state.classStaffPicker;
  var selectedIds = picker.selectedIds.slice();
  var index = selectedIds.indexOf(userId);

  if (picker.mode === "primary") {
    selectedIds = index === -1 ? [userId] : [];
  } else if (index === -1) {
    selectedIds.push(userId);
  } else {
    selectedIds.splice(index, 1);
  }

  state.classStaffPicker = Object.assign({}, picker, { selectedIds: selectedIds });
  render();
}

async function saveClassStaffPicker() {
  var picker = state.classStaffPicker;
  var classRecord = findClass(picker.classId);
  var form = normalizeClassForm(classRecord);
  var intentType = picker.mode === "primary" ? "AssignClassTeacherIntent" : "AssignClassAssistantsIntent";
  var payload = Object.assign({}, form);

  if (!picker.classId) {
    closeClassStaffPicker();
    return;
  }

  if (picker.mode === "primary") {
    payload.primaryTeacherId = picker.selectedIds[0] || "";
    payload.assistantIds = normalizeAssistantIds(form.assistantIds, payload.primaryTeacherId);
  } else {
    payload.assistantIds = normalizeAssistantIds(picker.selectedIds, form.primaryTeacherId);
    payload.primaryTeacherId = form.primaryTeacherId;
  }

  payload = applyClassStaffDisplayFields(payload);

  var saved = await saveIntent(intentType, payload, "Class staff saved.");

  if (saved) {
    closeClassStaffPicker();
    await refreshAllData();
  }
}

function openUserEditModal(userId) {
  var user = findUser(userId);

  if (!user) {
    setState({ message: "Choose a user first.", messageType: "error" });
    return;
  }

  setState({
    activeUserId: userId,
    userCreateOpen: false,
    userEditModal: {
      isOpen: true,
      userId: userId,
      draft: normalizeUserForm(user),
      error: ""
    },
    message: ""
  });
}

function closeUserEditModal() {
  if (state.isSaving) {
    return;
  }

  setState({
    activeUserId: "",
    userEditModal: createUserEditModalState(),
    message: ""
  });
}

function readUserFormDraft(formId) {
  if (formId === "new") {
    return state.userForm;
  }

  if (state.userEditModal && state.userEditModal.isOpen && state.userEditModal.userId === formId && state.userEditModal.draft) {
    return state.userEditModal.draft;
  }

  return normalizeUserForm(findUser(formId) || { id: formId });
}

function readMutableUserFormDraft(formId) {
  if (formId === "new") {
    return state.userForm;
  }

  if (state.userEditModal && state.userEditModal.isOpen && state.userEditModal.userId === formId && state.userEditModal.draft) {
    return state.userEditModal.draft;
  }

  return null;
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
  var form = readMutableUserFormDraft(picker.formId);

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
  var form = readUserFormDraft(picker.formId);
  var primaryLocationId = form.primaryLocationId || form.locationId || "";
  var query = readSafeString(picker.searchText).toLowerCase();

  return state.classes.filter(function (classRecord) {
    var locationId = readClassLocationId(classRecord);
    var locationMatches = picker.includeAllLocations || !primaryLocationId || locationId === primaryLocationId;
    var text = [classRecord.name, classRecord.title, classRecord.id, readLocationName(locationId)].join(" ").toLowerCase();

    return locationMatches && (!query || text.indexOf(query) !== -1);
  });
}

function readClassStaffPickerUsers(picker) {
  var query = readSafeString(picker.searchText).toLowerCase();
  var classRecord = findClass(picker.classId);
  var classLocationId = readClassLocationId(classRecord);

  return state.users.map(getSafeUser).filter(function (user) {
    var eligible = picker.mode === "primary"
      ? user.roles.indexOf("teacher") !== -1
      : user.roles.indexOf("teacher") !== -1 || user.roles.indexOf("assistant") !== -1;
    var text = [user.displayName, user.email, user.id, user.roles.join(" "), readUserLocationSummary(user), readUserClassSummary(user)].join(" ").toLowerCase();

    return eligible
      && isVisibleUserProfile(user)
      && (!classLocationId || user.locationIds.length === 0 || user.locationIds.indexOf(classLocationId) !== -1 || user.roles.indexOf("platformAdmin") !== -1 || user.roles.indexOf("superAdmin") !== -1)
      && (!query || text.indexOf(query) !== -1);
  }).sort(function (a, b) {
    return (a.displayName || a.email || a.id).localeCompare(b.displayName || b.email || b.id);
  });
}

function readClassLocationId(classRecord) {
  return readClassLocationIds(classRecord)[0] || "";
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
    openLocationCommandCenter(id);
  } else if (action === "close-location-command-center") {
    closeLocationCommandCenter();
  } else if (action === "location-command-tab") {
    setLocationCommandCenterTab(id);
  } else if (action === "location-command-navigate") {
    navigateFromLocationCommandCenter(id);
  } else if (action === "close-location-editor") {
    setState({ activeLocationId: "", locationCommandCenter: Object.assign({}, state.locationCommandCenter, { activeTab: "overview" }), message: "" });
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
  } else if (action === "edit-user" || action === "open-user-command-center") {
    await openUserCommandCenter(id);
  } else if (action === "close-user-command-center") {
    closeUserCommandCenter();
  } else if (action === "user-command-tab") {
    setUserCommandCenterTab(id);
  } else if (action === "user-command-navigate") {
    navigateFromUserCommandCenter(id);
  } else if (action === "open-class-command-center") {
    await openClassCommandCenter(id);
  } else if (action === "close-class-command-center") {
    closeClassCommandCenter();
  } else if (action === "class-command-tab") {
    setClassCommandCenterTab(id);
  } else if (action === "open-course-command-center") {
    await openCourseCommandCenter(id);
  } else if (action === "close-course-command-center") {
    closeCourseCommandCenter();
  } else if (action === "course-command-tab") {
    setCourseCommandCenterTab(id);
  } else if (action === "open-module-command-center") {
    await openModuleCommandCenter(id);
  } else if (action === "close-module-command-center") {
    closeModuleCommandCenter();
  } else if (action === "module-command-tab") {
    setModuleCommandCenterTab(id);
  } else if (action === "open-course-creator-course") {
    openCourseCreatorCourse(id);
  } else if (action === "open-module-editor") {
    openCourseCreatorModule(id);
  } else if (action === "export-course-json") {
    exportCourseJson(id);
  } else if (action === "open-user-edit-modal") {
    openUserEditModal(id);
  } else if (action === "close-user-edit-modal") {
    closeUserEditModal();
  } else if (action === "filter-users-role") {
    applyUserRoleFilter(id || "", !id);
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
  } else if (action === "authorize-teacher-login") {
    await authorizeTeacherLogin(id);
  } else if (action === "repair-teacher-auth-profile") {
    await repairTeacherAuthProfile(id);
  } else if (action === "send-password-reset") {
    await sendStaffPasswordReset(id);
  } else if (action === "create-class") {
    await saveIntent("CreateClassIntent", applyClassStaffDisplayFields(state.classForm), "Class created.");
    state.classForm = createClassForm();
    await refreshAllData();
  } else if (action === "update-class") {
    await saveIntent("UpdateClassIntent", applyClassStaffDisplayFields(normalizeClassForm(findClass(id))), "Class saved.");
    await refreshAllData();
  } else if (action === "open-class-teacher-picker") {
    openClassStaffPicker(id, "primary");
  } else if (action === "open-class-assistant-picker") {
    openClassStaffPicker(id, "assistants");
  } else if (action === "close-class-staff-picker") {
    closeClassStaffPicker();
  } else if (action === "save-class-staff-picker") {
    await saveClassStaffPicker();
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
  } else if (action === "open-new-assignment-teacher-picker") {
    openAssignmentStaffPicker("new", "responsible");
  } else if (action === "open-new-assignment-assistant-picker") {
    openAssignmentStaffPicker("new", "assistants");
  } else if (action === "open-assignment-teacher-picker") {
    openAssignmentStaffPicker(id, "responsible");
  } else if (action === "open-assignment-assistant-picker") {
    openAssignmentStaffPicker(id, "assistants");
  } else if (action === "close-assignment-staff-picker") {
    closeAssignmentStaffPicker();
  } else if (action === "save-assignment-staff-picker") {
    await saveAssignmentStaffPicker();
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
    openCourseCommandCenter(id || "");
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

function buildCourseCreatorModuleUrl(courseId, moduleId) {
  if (!COURSE_CREATOR_URL || !courseId || !moduleId) {
    return "";
  }

  return COURSE_CREATOR_URL + "#module-editor?courseId=" + encodeURIComponent(courseId) + "&moduleId=" + encodeURIComponent(moduleId);
}

function openCourseCreatorCourse(courseId) {
  var url = buildCourseCreatorCourseUrl(courseId);

  if (!url) {
    setState({ message: "Course Creator link is not configured for this course.", messageType: "error" });
    return;
  }

  window.open(url, "_blank");
}

function openCourseCreatorModule(value) {
  var ids = parseCourseModuleActionId(value);
  var url = buildCourseCreatorModuleUrl(ids.courseId, ids.moduleId);

  if (!url) {
    setState({ message: "Module Editor link is not configured for this module.", messageType: "error" });
    return;
  }

  window.open(url, "_blank");
}

function exportCourseJson(courseId) {
  var course = findCourse(courseId);

  if (!course) {
    setState({ message: "Course was not found.", messageType: "error" });
    return;
  }

  var blob = new Blob([JSON.stringify(course, null, 2)], { type: "application/json" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = (readCourseTitle(course).replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "course") + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  setState({ message: "Course JSON exported.", messageType: "success" });
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
    setState({ isSaving: true, pendingAction: "admin-login", message: "Signing in...", messageType: "info" });
    await signInWithEmailAndPassword(auth, email, password);
    setState({
      isSaving: false,
      pendingAction: "",
      message: "Checking admin access...",
      messageType: "info"
    });
  } catch (error) {
    setState({
      isSaving: false,
      pendingAction: "",
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
  var validationMessage = readAssignmentValidationMessage(state.assignmentForm);

  if (validationMessage) {
    setState({ message: validationMessage, messageType: "error" });
    return;
  }

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

function openAssignmentStaffPicker(assignmentId, mode) {
  var record = assignmentId === "new" ? state.assignmentForm : findAssignment(assignmentId);
  var ownership = normalizeAssignmentOwnership(record || {});
  var selectedIds = mode === "assistants"
    ? ownership.assistantIds.slice()
    : (ownership.responsibleTeacherId ? [ownership.responsibleTeacherId] : []);

  state.assignmentStaffPicker = {
    isOpen: true,
    assignmentId: assignmentId || "new",
    mode: mode === "assistants" ? "assistants" : "responsible",
    searchText: "",
    selectedIds: selectedIds
  };
  render();
}

function closeAssignmentStaffPicker() {
  state.assignmentStaffPicker = {
    isOpen: false,
    assignmentId: "",
    mode: "responsible",
    searchText: "",
    selectedIds: []
  };
  render();
}

function toggleAssignmentStaffSelection(userId) {
  var picker = state.assignmentStaffPicker;
  var selectedIds = picker.selectedIds.slice();
  var index = selectedIds.indexOf(userId);

  if (picker.mode === "responsible") {
    selectedIds = index === -1 ? [userId] : [];
  } else if (index === -1) {
    selectedIds.push(userId);
  } else {
    selectedIds.splice(index, 1);
  }

  state.assignmentStaffPicker = Object.assign({}, picker, { selectedIds: selectedIds });
  render();
}

async function saveAssignmentStaffPicker() {
  var picker = state.assignmentStaffPicker;
  var record = picker.assignmentId === "new" ? state.assignmentForm : findAssignment(picker.assignmentId);
  var ownership = normalizeAssignmentOwnership(record || {});
  var payload = {};
  var saved = false;

  if (!picker.assignmentId) {
    closeAssignmentStaffPicker();
    return;
  }

  if (picker.mode === "responsible") {
    ownership.responsibleTeacherId = picker.selectedIds[0] || "";
    ownership.assistantIds = normalizeAssignmentAssistantIds(ownership.assistantIds, ownership.responsibleTeacherId);
  } else {
    ownership.assistantIds = normalizeAssignmentAssistantIds(picker.selectedIds, ownership.responsibleTeacherId);
  }

  ownership = applyAssignmentStaffDisplayFields(ownership);

  if (picker.assignmentId === "new") {
    Object.assign(state.assignmentForm, ownership);
    closeAssignmentStaffPicker();
    setState({ message: "Course staff selected. Review and assign when ready.", messageType: "success" });
    return;
  }

  payload = Object.assign({ assignmentId: picker.assignmentId }, ownership);
  saved = await saveIntent(picker.mode === "responsible" ? "AssignCourseTeacherIntent" : "AssignCourseAssistantsIntent", payload, "Course assignment staff saved.");

  if (saved) {
    closeAssignmentStaffPicker();
    await refreshAllData();
  }
}

function readAssignmentStaffPickerUsers(picker, assignment) {
  var query = readSafeString(picker.searchText).toLowerCase();
  var assignmentLocationId = readSafeString(assignment.locationId);

  return state.users.map(getSafeUser).filter(function (user) {
    var eligible = picker.mode === "responsible"
      ? user.roles.indexOf("teacher") !== -1
      : user.roles.indexOf("teacher") !== -1 || user.roles.indexOf("assistant") !== -1;
    var text = [user.displayName, user.email, user.id, user.roles.join(" "), readUserLocationSummary(user), readUserClassSummary(user)].join(" ").toLowerCase();

    return eligible
      && user.status === "active"
      && isVisibleUserProfile(user)
      && (!assignmentLocationId || user.locationIds.length === 0 || user.locationIds.indexOf(assignmentLocationId) !== -1 || user.roles.indexOf("platformAdmin") !== -1 || user.roles.indexOf("superAdmin") !== -1)
      && (!query || text.indexOf(query) !== -1);
  }).sort(function (a, b) {
    return (a.displayName || a.email || a.id).localeCompare(b.displayName || b.email || b.id);
  });
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
  var source = mode === "create" ? state.userForm : readUserFormDraft(userId);
  var payload = normalizeUserProfilePayload(source, mode === "create" ? "" : userId);
  var validationError = validateUserProfile(payload, mode);
  var actionKey = mode === "create" ? "create-user:new" : "update-user:" + userId;

  if (validationError) {
    setUserSaveError(validationError, mode);
    return false;
  }

  if (mode === "update" && isCurrentUserSelfDemotion(userId, payload.roles)) {
    setUserSaveError("For safety, this dashboard will not remove your own superAdmin/platformAdmin role. Ask another platform admin to make that change.", mode);
    return false;
  }

  try {
    setState({ isSaving: true, pendingAction: actionKey, userEditModal: clearUserEditModalError(), message: mode === "create" ? "Creating profile..." : "Saving user...", messageType: "info" });
    var profileRef = mode === "create" && !payload.userId ? doc(collection(db, "users")) : doc(db, "users", payload.userId || userId);
    var record = buildUserProfileRecord(payload, mode === "create");

    await setDoc(profileRef, record, { merge: true });

    if (mode === "create") {
      state.userForm = createUserForm();
      state.userCreateOpen = false;
    }

    state.activeUserId = "";
    setState({ isSaving: false, pendingAction: "", userEditModal: createUserEditModalState(), message: mode === "create" ? "User profile created." : "User saved.", messageType: "success" });
    await refreshAllData();
    setState({ message: mode === "create" ? "User profile created." : "User saved.", messageType: "success" });
    return true;
  } catch (error) {
    setUserSaveError("Could not save user profile: " + (error.message || "Unknown error"), mode);
    setState({ isSaving: false, pendingAction: "" });
    return false;
  }
}

function setUserSaveError(message, mode) {
  if (mode === "update" && state.userEditModal && state.userEditModal.isOpen) {
    setState({
      userEditModal: Object.assign({}, state.userEditModal, { error: message }),
      message: "",
      messageType: "error"
    });
    return;
  }

  setState({ message: message, messageType: "error" });
}

function clearUserEditModalError() {
  if (!state.userEditModal || !state.userEditModal.isOpen) {
    return state.userEditModal;
  }

  return Object.assign({}, state.userEditModal, { error: "" });
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

async function authorizeTeacherLogin(userId) {
  var user = getSafeUser(findUser(userId));
  var missingFields = readTeacherLoginMissingFields(user);
  var displayName = readTeacherDisplayName(user);

  if (!user.id || !isTeacherUser(user)) {
    setState({ message: "Authorize Teacher Login is only available for teacher users.", messageType: "error" });
    return false;
  }

  if (missingFields.length > 0) {
    setState({
      message: "Before authorizing this teacher, complete: " + missingFields.join(", ") + ".",
      messageType: "error"
    });
    return false;
  }

  if (!window.confirm("Authorize Teacher Login for " + displayName + "? This creates or reuses a Firebase Auth account, enables teacher claims, and sends a password setup email.")) {
    return false;
  }

  try {
    setState({
      isSaving: true,
      pendingAction: "authorize-teacher-login:" + userId,
      message: "Authorizing teacher login...",
      messageType: "info"
    });

    var result = await callAdminCallable("adminAuthorizeTeacherLogin", {
      userId: user.id,
      email: user.email,
      displayName: displayName
    });
    var data = result || {};
    var shouldSendResetEmail = data.frontendShouldSendResetEmail !== false;

    if (shouldSendResetEmail) {
      await sendPasswordResetEmail(auth, user.email);
    }

    await refreshAllData();
    setState({
      isSaving: false,
      pendingAction: "",
      activeUserId: user.id,
      message: "Teacher login authorized. Password setup email sent to " + user.email + ".",
      messageType: "success"
    });
    return true;
  } catch (error) {
    setState({
      isSaving: false,
      pendingAction: "",
      message: "Could not authorize teacher login: " + readCallableErrorMessage(error),
      messageType: "error"
    });
    return false;
  }
}

async function repairTeacherAuthProfile(userId) {
  var user = getSafeUser(findUser(userId));

  if (!user.id || !isTeacherUser(user)) {
    setState({ message: "Repair Login Profile is only available for teacher users.", messageType: "error" });
    return false;
  }

  if (!user.authUid) {
    setState({ message: "This teacher does not have an authUid yet. Use Authorize Teacher Login first.", messageType: "error" });
    return false;
  }

  try {
    setState({
      isSaving: true,
      pendingAction: "repair-teacher-auth-profile:" + userId,
      message: "Repairing teacher login profile...",
      messageType: "info"
    });

    await callAdminCallable("repairTeacherAuthProfile", {
      userId: user.id
    });

    await refreshAllData();
    setState({
      isSaving: false,
      pendingAction: "",
      activeUserId: user.id,
      message: "Teacher login profile repaired. Teacher Dashboard can now load users/" + user.authUid + ".",
      messageType: "success"
    });
    return true;
  } catch (error) {
    setState({
      isSaving: false,
      pendingAction: "",
      message: "Could not repair teacher login profile: " + readCallableErrorMessage(error),
      messageType: "error"
    });
    return false;
  }
}

async function callAdminCallable(functionName, payload) {
  console.info("[admin-callable]", {
    functionName: functionName,
    payloadKeys: Object.keys(payload || {})
  });

  var callable = httpsCallable(adminCallableFunctions, functionName);
  var response = await callable(payload || {});
  return response ? response.data : null;
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
  var actionKey = readSaveIntentActionKey(intentType, payload || {});
  var result = null;

  setState({ isSaving: true, pendingAction: actionKey, message: "Saving...", messageType: "info" });
  try {
    result = await runAdminIntent(intentType, payload || {});

    if (isSuccess(result)) {
      setState({ isSaving: false, pendingAction: "", message: successMessage, messageType: "success" });
      return true;
    }

    setState({ isSaving: false, pendingAction: "", message: readIntentError(result), messageType: "error" });
    return false;
  } catch (error) {
    setState({ isSaving: false, pendingAction: "", message: error && error.message ? error.message : "Save failed.", messageType: "error" });
    return false;
  }
}

function readSaveIntentActionKey(intentType, payload) {
  if (intentType === "CreateClassIntent") return "create-class:new";
  if (intentType === "UpdateClassIntent") return "update-class:" + readSafeString(payload.classId || payload.id);
  if (intentType === "AssignClassTeacherIntent" || intentType === "AssignClassAssistantsIntent") return "class-staff:" + readSafeString(payload.classId || payload.id);
  if (intentType === "AssignCourseTeacherIntent" || intentType === "AssignCourseAssistantsIntent") return "assignment-staff:" + readSafeString(payload.assignmentId || payload.id);
  if (intentType === "CreateStudentIntent") return "create-student:new";
  if (intentType === "UpdateStudentIntent") return "update-student:" + readSafeString(payload.studentId || payload.id);
  return "save-intent:" + readSafeString(intentType || "admin");
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

function createUserFilters() {
  return {
    searchText: "",
    role: "",
    locationId: "",
    status: ""
  };
}

function createUserEditModalState() {
  return {
    isOpen: false,
    userId: "",
    draft: null,
    error: ""
  };
}

function createClassForm() {
  return { name: "", locationId: "", status: "active", isVisible: true, photoDataUrl: "", primaryTeacherId: "", assistantIds: [], primaryTeacherName: "", assistantNames: [] };
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
    visibility: "visible",
    responsibleTeacherId: "",
    assistantIds: [],
    responsibleTeacherName: "",
    assistantNames: []
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
    externalTaskSubmissions: [],
    collectionStatus: {},
    lastRefreshAt: null,
    storageAvailable: false
  };
}

function createLocationCommandCenterState() {
  return {
    isOpen: false,
    locationId: "",
    activeTab: "overview",
    userRoleFilter: "",
    userSearchText: "",
    chartRange: "month"
  };
}

function createClassCommandCenterState() {
  return {
    isOpen: false,
    classId: "",
    activeTab: "overview"
  };
}

function createUserCommandCenterState() {
  return {
    isOpen: false,
    userId: "",
    activeTab: "overview"
  };
}

function createCourseCommandCenterState() {
  return {
    isOpen: false,
    courseId: "",
    activeTab: "overview"
  };
}

function createModuleCommandCenterState() {
  return {
    isOpen: false,
    courseId: "",
    moduleId: "",
    activeTab: "overview"
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
    readClassLocationIds(state.classes[index]).forEach(function (locationId) {
      addCount(counts, locationId);
    });
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

function setClassFormValue(classRecord, field, value) {
  if (field === "assistantIds") {
    classRecord.assistantIds = normalizeAssistantIds(value, classRecord.primaryTeacherId);
    classRecord.assistantNames = classRecord.assistantIds.map(readUserDisplayName);
    return;
  }

  if (field === "primaryTeacherId") {
    classRecord.primaryTeacherId = readSafeString(value);
    classRecord.assistantIds = normalizeAssistantIds(classRecord.assistantIds, classRecord.primaryTeacherId);
    classRecord.primaryTeacherName = readUserDisplayName(classRecord.primaryTeacherId);
    classRecord.assistantNames = classRecord.assistantIds.map(readUserDisplayName);
    return;
  }

  classRecord[field] = value;
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
  return readFilteredUsersForFilters(state.userFilters);
}

function readFilteredUsersForFilters(filters) {
  var users = [];
  var safeFilters = filters || {};
  var query = readSafeString(safeFilters.searchText).trim().toLowerCase();
  var index = 0;

  while (index < state.users.length) {
    var user = getSafeUser(state.users[index]);

    if (!isVisibleUserProfile(user)) {
      index = index + 1;
      continue;
    }

    var searchable = [user.displayName, user.email, user.phone, user.id].join(" ").toLowerCase();
    var matchesSearch = !query || searchable.indexOf(query) !== -1;
    var matchesRole = userMatchesRoleFilter(user, safeFilters.role);
    var matchesLocation = !safeFilters.locationId || user.locationIds.indexOf(safeFilters.locationId) !== -1 || user.primaryLocationId === safeFilters.locationId;
    var matchesStatus = !safeFilters.status || user.status === safeFilters.status;

    if (matchesSearch && matchesRole && matchesLocation && matchesStatus) {
      users.push(user);
    }

    index = index + 1;
  }

  return users.sort(function (a, b) {
    return (a.displayName || a.email || a.id).localeCompare(b.displayName || b.email || b.id);
  });
}

function applyUserRoleFilter(selectedRole, shouldClearFilters) {
  var normalizedRole = readSafeString(selectedRole);
  var nextFilters = shouldClearFilters
    ? createUserFilters()
    : Object.assign({}, state.userFilters, { role: normalizedRole });
  var userCount = readFilteredUsersForFilters(nextFilters).length;

  console.info("[users-filter-card]", {
    selectedRole: normalizedRole,
    visibleUserCount: userCount,
    totalUserCount: state.users.length
  });

  setState({
    userFilters: nextFilters,
    activeUserId: "",
    userEditModal: createUserEditModalState(),
    userCommandCenter: createUserCommandCenterState(),
    message: ""
  });
}

function applyClassLocationFilter(selectedLocationId) {
  var normalizedLocationId = readSafeString(selectedLocationId);
  var nextFilters = Object.assign({}, state.filters, {
    locationId: normalizedLocationId,
    classId: ""
  });
  var visibleClassCount = readVisibleClassesForLocation(normalizedLocationId).length;

  console.info("[classes-filter]", {
    selectedLocationId: normalizedLocationId,
    visibleClassCount: visibleClassCount,
    totalClassCount: state.classes.length
  });

  setState({
    filters: nextFilters,
    message: ""
  });
}

function readVisibleClassesForLocation(selectedLocationId) {
  var safeLocationId = readSafeString(selectedLocationId);
  var classes = [];
  var index = 0;

  while (index < state.classes.length) {
    if (classMatchesLocationFilter(state.classes[index], safeLocationId)) {
      classes.push(state.classes[index]);
    }
    index = index + 1;
  }

  return classes;
}

function readLocationCommandStats(locationId) {
  var users = readLocationCommandUsers(locationId, "", "");
  var classes = readLocationCommandClasses(locationId);
  var assignments = readLocationCommandAssignments(locationId);
  var courses = readLocationCommandCourses(locationId);
  var submissions = readLocationCommandSubmissions(locationId);

  return {
    students: countItems(users, function (user) { return userMatchesRoleFilter(user, "student"); }),
    teachers: countItems(users, function (user) { return userMatchesRoleFilter(user, "teacher"); }),
    parents: countItems(users, function (user) { return userMatchesRoleFilter(user, "parent"); }),
    admins: countItems(users, function (user) { return userMatchesRoleFilter(user, "admin") || user.roles.indexOf("schoolAdmin") !== -1 || user.roles.indexOf("platformAdmin") !== -1 || user.roles.indexOf("superAdmin") !== -1; }),
    assistants: countItems(users, function (user) { return user.roles.indexOf("assistant") !== -1; }),
    classes: classes.length,
    courses: courses.length,
    assignments: assignments.length,
    pendingReviews: countItems(submissions, function (submission) { return readSafeString(submission.reviewStatus || submission.status) === "pending"; }),
    completedReviews: countItems(submissions, function (submission) { return readSafeString(submission.reviewStatus || submission.status) === "complete"; }),
    needsWorkReviews: countItems(submissions, function (submission) { return readSafeString(submission.reviewStatus || submission.status) === "needsWork" || readSafeString(submission.reviewStatus || submission.status) === "incomplete"; })
  };
}

function readLocationCommandUsers(locationId, roleFilter, searchText) {
  var query = readSafeString(searchText).trim().toLowerCase();
  return state.users.map(getSafeUser).filter(function (user) {
    var searchable = [user.displayName, user.name, user.email, user.phone, user.id].join(" ").toLowerCase();
    return isVisibleUserProfile(user)
      && userMatchesLocation(user, locationId)
      && userMatchesRoleFilter(user, roleFilter || "")
      && (!query || searchable.indexOf(query) !== -1);
  }).sort(function (a, b) {
    return (a.displayName || a.email || a.id).localeCompare(b.displayName || b.email || b.id);
  });
}

function userMatchesLocation(user, locationId) {
  var safeUser = getSafeUser(user);
  var safeLocationId = readSafeString(locationId);

  if (!safeLocationId) {
    return true;
  }

  return safeUser.locationIds.indexOf(safeLocationId) !== -1 || safeUser.primaryLocationId === safeLocationId || safeUser.locationId === safeLocationId;
}

function readLocationCommandClasses(locationId) {
  return state.classes.filter(function (classRecord) {
    return classMatchesLocationFilter(classRecord, locationId);
  }).sort(function (a, b) {
    return readSafeString(a.name || a.id).localeCompare(readSafeString(b.name || b.id));
  });
}

function readLocationCommandAssignments(locationId) {
  return state.assignments.filter(function (assignment) {
    return assignmentMatchesLocation(assignment, locationId);
  }).sort(function (a, b) {
    return readSafeString(a.courseId).localeCompare(readSafeString(b.courseId));
  });
}

function assignmentMatchesLocation(assignment, locationId) {
  var safeLocationId = readSafeString(locationId);
  var targetType = readSafeString(assignment && assignment.targetType);
  var targetId = readSafeString(assignment && (assignment.targetId || assignment.classId || assignment.studentId || assignment.locationId));
  var classRecord = null;
  var student = null;

  if (!safeLocationId) {
    return true;
  }

  if (assignment && (assignment.locationId === safeLocationId || assignment.primaryLocationId === safeLocationId)) {
    return true;
  }

  if (targetType === "location" && targetId === safeLocationId) {
    return true;
  }

  if (targetType === "class" || assignment && assignment.classId) {
    classRecord = findClass(targetId || assignment.classId);
    return classMatchesLocationFilter(classRecord, safeLocationId);
  }

  if (targetType === "student" || assignment && assignment.studentId) {
    student = findStudent(targetId || assignment.studentId);
    return readStudentLocationId(student) === safeLocationId;
  }

  return false;
}

function readLocationCommandCourses(locationId) {
  var courseIds = [];
  var assignments = readLocationCommandAssignments(locationId);
  var courses = [];

  assignments.forEach(function (assignment) {
    if (assignment.courseId && courseIds.indexOf(assignment.courseId) === -1) {
      courseIds.push(assignment.courseId);
    }
  });

  state.courses.forEach(function (course) {
    if (courseMatchesLocation(course, locationId) && courseIds.indexOf(course.id) === -1) {
      courseIds.push(course.id);
    }
  });

  courseIds.forEach(function (courseId) {
    var course = findCourse(courseId);
    if (course) {
      courses.push(course);
    }
  });

  return courses.sort(function (a, b) {
    return readCourseTitle(a).localeCompare(readCourseTitle(b));
  });
}

function courseMatchesLocation(course, locationId) {
  var safeLocationId = readSafeString(locationId);
  var ids = normalizeIdList([
    course && course.locationId,
    course && course.primaryLocationId,
    course && course.schoolId,
    course && course.locationIds,
    course && course.assignedLocationIds
  ]);

  return safeLocationId && ids.indexOf(safeLocationId) !== -1;
}

function readLocationCommandSubmissions(locationId) {
  var submissions = state.overviewData && Array.isArray(state.overviewData.externalTaskSubmissions) ? state.overviewData.externalTaskSubmissions : [];

  return submissions.filter(function (submission) {
    if (submission.locationId === locationId || submission.primaryLocationId === locationId) {
      return true;
    }

    if (submission.classId && classMatchesLocationFilter(findClass(submission.classId), locationId)) {
      return true;
    }

    if (submission.studentId && readStudentLocationId(findStudent(submission.studentId)) === locationId) {
      return true;
    }

    return false;
  });
}

function readLocationRecentActivity(locationId) {
  var activity = [];
  var records = state.overviewData && Array.isArray(state.overviewData.activityLogs) ? state.overviewData.activityLogs : [];

  records.forEach(function (record) {
    if (record.locationId === locationId || record.primaryLocationId === locationId || record.schoolId === locationId) {
      activity.push({
        type: readSafeString(record.type || record.action || "Activity"),
        title: readSafeString(record.title || record.message || record.description || "Location activity"),
        time: normalizeTimestamp(record.createdAt || record.updatedAt || record.time || Date.now())
      });
    }
  });

  return activity.sort(compareByTimeDesc);
}

function readLocationLastActivity(locationId) {
  var activity = readLocationRecentActivity(locationId);
  return activity.length > 0 ? activity[0].time : null;
}

function readClassCommandContext(classRecord) {
  var form = normalizeClassForm(classRecord || {});
  var classId = form.classId;
  var students = readClassCommandStudents(classId);
  var assignments = readClassCommandAssignments(classId);
  var courses = readClassCommandCourses(assignments);
  var teachers = readClassCommandTeachers(form, assignments);
  var submissions = readClassCommandSubmissions(classId, assignments, students);
  var activity = readClassCommandActivity(classId, assignments, students);
  var audit = readClassCommandAudit(classId);

  return {
    form: form,
    classRecord: classRecord || {},
    students: students,
    assignments: assignments,
    courses: courses,
    teachers: teachers,
    submissions: submissions,
    activity: activity,
    audit: audit
  };
}

function readClassCommandStudents(classId) {
  var students = [];

  state.users.map(getSafeUser).forEach(function (user) {
    if (user.roles.indexOf("student") !== -1 && (user.classId === classId || user.classIds.indexOf(classId) !== -1)) {
      students.push(user);
    }
  });

  state.students.forEach(function (student) {
    if (studentBelongsToClass(student, classId)) {
      students.push(Object.assign({}, student, {
        id: student.id || student.studentId || student.userId,
        displayName: student.displayName || student.name || student.id,
        roles: ["student"]
      }));
    }
  });

  return dedupeRecords(students).map(getSafeUser).sort(function (a, b) {
    return readUserCommandName(a).localeCompare(readUserCommandName(b));
  });
}

function readClassCommandAssignments(classId) {
  return state.assignments.filter(function (assignment) {
    var targetType = readSafeString(assignment.targetType || (assignment.studentId ? "student" : assignment.classId ? "class" : ""));
    var targetId = readSafeString(assignment.targetId || assignment.classId);

    return targetType === "class" && targetId === classId || readSafeString(assignment.classId) === classId;
  }).sort(compareByUpdatedDesc);
}

function readClassCommandCourses(assignments) {
  var courses = [];

  assignments.forEach(function (assignment) {
    var course = findCourse(assignment.courseId);

    if (course) {
      courses.push(course);
    }
  });

  return dedupeRecords(courses).sort(function (a, b) {
    return readCourseTitle(a).localeCompare(readCourseTitle(b));
  });
}

function readClassCommandTeachers(form, assignments) {
  var teacherIds = normalizeMixedIdList([form.primaryTeacherId, form.assistantIds]);
  var teachers = [];

  assignments.forEach(function (assignment) {
    normalizeMixedIdList([assignment.responsibleTeacherId, assignment.assistantIds, assignment.teacherOwnershipIds]).forEach(function (teacherId) {
      if (teacherIds.indexOf(teacherId) === -1) {
        teacherIds.push(teacherId);
      }
    });
  });

  teacherIds.forEach(function (teacherId) {
    var teacher = findUser(teacherId);
    if (teacher) {
      teachers.push(teacher);
    }
  });

  return dedupeRecords(teachers).map(getSafeUser).sort(function (a, b) {
    return readUserCommandName(a).localeCompare(readUserCommandName(b));
  });
}

function readClassCommandSubmissions(classId, assignments, students) {
  var submissions = state.overviewData && Array.isArray(state.overviewData.externalTaskSubmissions) ? state.overviewData.externalTaskSubmissions : [];
  var assignmentIds = assignments.map(function (assignment) { return readSafeString(assignment.id); });
  var courseIds = assignments.map(function (assignment) { return readSafeString(assignment.courseId); });
  var studentIds = students.map(function (student) { return readSafeString(student.id || student.studentId || student.userId); });

  return submissions.filter(function (submission) {
    return readSafeString(submission.classId) === classId
      || assignmentIds.indexOf(readSafeString(submission.assignmentId)) !== -1
      || (courseIds.indexOf(readSafeString(submission.courseId)) !== -1 && studentIds.indexOf(readSafeString(submission.studentId || submission.userId)) !== -1);
  }).sort(compareByUpdatedDesc);
}

function readClassCommandActivity(classId, assignments, students) {
  var records = state.overviewData && Array.isArray(state.overviewData.activityLogs) ? state.overviewData.activityLogs : [];
  var courseIds = assignments.map(function (assignment) { return readSafeString(assignment.courseId); });
  var studentIds = students.map(function (student) { return readSafeString(student.id || student.studentId || student.userId); });

  return records.filter(function (record) {
    return readSafeString(record.classId) === classId
      || courseIds.indexOf(readSafeString(record.courseId || record.catalogCourseId)) !== -1
      || studentIds.indexOf(readSafeString(record.studentId || record.userId || record.uid)) !== -1;
  }).map(function (record) {
    return {
      type: readSafeString(record.type || record.action || "Activity"),
      title: readSafeString(record.title || record.message || record.description || "Class activity"),
      time: normalizeTimestamp(record.createdAt || record.updatedAt || record.time || Date.now())
    };
  }).sort(compareByTimeDesc);
}

function readClassCommandAudit(classId) {
  var records = state.overviewData && Array.isArray(state.overviewData.auditLogs) ? state.overviewData.auditLogs : [];

  return records.filter(function (record) {
    return readSafeString(record.classId || record.targetClassId) === classId;
  }).sort(compareByUpdatedDesc);
}

function readClassActivityStatus(context) {
  return context.activity.length > 0 || context.submissions.length > 0 ? "Active" : "Quiet";
}

function readClassLastActivityLabel(context) {
  var times = [];

  context.activity.forEach(function (item) { if (item.time) times.push(item.time); });
  context.submissions.forEach(function (item) { times.push(normalizeTimestamp(item.updatedAt || item.createdAt)); });

  if (times.length === 0) {
    return "No activity";
  }

  return formatDateTime(Math.max.apply(Math, times));
}

function readClassMetricLabel(context, fields) {
  var index = 0;
  var source = context.classRecord || {};

  while (index < fields.length) {
    if (typeof source[fields[index]] === "number" && isFinite(source[fields[index]])) {
      return source[fields[index]];
    }
    index = index + 1;
  }

  return "No data";
}

function readClassAttendanceLabel(context) {
  var value = context.classRecord && (context.classRecord.attendancePercent || context.classRecord.attendancePercentage || context.classRecord.attendanceRate);

  if (typeof value === "number" && isFinite(value)) {
    return Math.round(value) + "%";
  }

  return "No data";
}

function readClassActivityScoreLabel(context) {
  var value = context.classRecord && (context.classRecord.activityScore || context.classRecord.engagementScore);

  if (typeof value === "number" && isFinite(value)) {
    return Math.round(value);
  }

  return context.activity.length > 0 ? context.activity.length : "No data";
}

function countReviewedClassSubmissions(context) {
  return countItems(context.submissions, function (submission) {
    var status = readSafeString(submission.reviewStatus || submission.status);
    return status === "complete" || status === "completed";
  });
}

function countNeedsWorkClassSubmissions(context) {
  return countItems(context.submissions, function (submission) {
    var status = readSafeString(submission.reviewStatus || submission.status);
    return status === "needsWork" || status === "needs-work" || status === "incomplete";
  });
}

function readClassStudentProgressLabel(student, context) {
  var safeStudent = getSafeUser(student);
  var progress = readUserMetricNumber(safeStudent, ["courseProgress", "progress", "completionPercent"]);

  if (progress) {
    return progress + "%";
  }

  return context.courses.length > 0 ? "No progress data" : "No courses";
}

function countStudentPendingReviews(student, context) {
  var safeStudent = getSafeUser(student);

  return countItems(context.submissions, function (submission) {
    var studentId = readSafeString(submission.studentId || submission.userId);
    var status = readSafeString(submission.reviewStatus || submission.status || "pending");
    return studentId === safeStudent.id && (status === "pending" || status === "submitted");
  });
}

function readClassTeacherRole(teacher, context) {
  var safeTeacher = getSafeUser(teacher);

  if (safeTeacher.id === context.form.primaryTeacherId) {
    return "Primary teacher";
  }

  if (context.form.assistantIds.indexOf(safeTeacher.id) !== -1) {
    return "Assistant";
  }

  return safeTeacher.roles.map(readRoleLabel).join(", ") || "Teacher";
}

function countTeacherCoursesForClass(teacher, context) {
  var safeTeacher = getSafeUser(teacher);

  return countItems(context.assignments, function (assignment) {
    return normalizeMixedIdList([assignment.responsibleTeacherId, assignment.assistantIds, assignment.teacherOwnershipIds]).indexOf(safeTeacher.id) !== -1;
  }) || context.courses.length;
}

function readClassCourseProgressLabel(course, context) {
  if (typeof course.progress === "number") {
    return Math.round(course.progress) + "%";
  }

  if (typeof course.completionPercent === "number") {
    return Math.round(course.completionPercent) + "%";
  }

  return context.students.length > 0 ? "No progress data" : "No students";
}

function readClassCourseSubmissions(course, context) {
  return context.submissions.filter(function (submission) {
    return readSafeString(submission.courseId || submission.catalogCourseId) === readSafeString(course.id);
  });
}

function readAssignmentActorName(assignment) {
  var actorId = readSafeString(assignment.assignedBy || assignment.createdBy || assignment.updatedBy || assignment.actorId);
  var user = actorId ? findUser(actorId) : null;

  return user ? readUserCommandName(getSafeUser(user)) : actorId || "System";
}

function readClassScheduleRecords(classRecord) {
  return collectObjectList([
    classRecord && classRecord.schedule,
    classRecord && classRecord.timetable,
    classRecord && classRecord.sessions
  ], "schedule");
}

function readUserCommandContext(user) {
  var safeUser = getSafeUser(user);
  var primaryRole = readUserCommandPrimaryRole(safeUser);
  var locations = readUserCommandLocations(safeUser);
  var classes = readUserCommandClasses(safeUser, primaryRole);
  var assignments = readUserCommandAssignments(safeUser, primaryRole, classes);
  var courses = readUserCommandCourses(assignments, safeUser, primaryRole);
  var children = readUserCommandChildren(safeUser);
  var submissions = readUserCommandSubmissions(safeUser, primaryRole, classes, assignments, children);
  var activity = readUserCommandActivity(safeUser, children);
  var audit = readUserCommandAudit(safeUser);

  return {
    primaryRole: primaryRole,
    location: locations[0] || null,
    locations: locations,
    primaryClass: classes[0] || null,
    classes: classes,
    assignments: assignments,
    courses: courses,
    children: children,
    submissions: submissions,
    activity: activity,
    audit: audit
  };
}

function readUserCommandPrimaryRole(user) {
  var roles = getSafeUser(user).roles;

  if (roles.indexOf("student") !== -1) return "student";
  if (roles.indexOf("teacher") !== -1) return "teacher";
  if (roles.indexOf("parent") !== -1) return "parent";
  if (roles.indexOf("assistant") !== -1) return "assistant";
  if (isAdminLikeUser(user)) return "admin";
  return roles[0] || "user";
}

function isAdminLikeUser(user) {
  var roles = getSafeUser(user).roles;

  return roles.indexOf("admin") !== -1
    || roles.indexOf("schoolAdmin") !== -1
    || roles.indexOf("platformAdmin") !== -1
    || roles.indexOf("superAdmin") !== -1;
}

function readUserCommandName(user) {
  var safeUser = getSafeUser(user);
  return safeUser.displayName || safeUser.name || safeUser.email || safeUser.id || "Untitled User";
}

function readUserCommandLocations(user) {
  var safeUser = getSafeUser(user);
  var locations = [];

  safeUser.locationIds.forEach(function (locationId) {
    var location = findLocation(locationId);
    if (location && locations.indexOf(location) === -1) {
      locations.push(location);
    }
  });

  return locations;
}

function readUserCommandClasses(user, primaryRole) {
  var safeUser = getSafeUser(user);
  var classIds = safeUser.classIds.slice();
  var classes = [];

  if (safeUser.classId && classIds.indexOf(safeUser.classId) === -1) {
    classIds.unshift(safeUser.classId);
  }

  state.classes.forEach(function (classRecord) {
    var form = normalizeClassForm(classRecord);
    var matchesDirectClass = classIds.indexOf(form.classId) !== -1 || classIds.indexOf(classRecord.id) !== -1;
    var matchesTeacher = primaryRole === "teacher" && (form.primaryTeacherId === safeUser.id || form.primaryTeacherId === safeUser.profileUserId || form.primaryTeacherId === safeUser.authUid || form.assistantIds.indexOf(safeUser.id) !== -1 || form.assistantIds.indexOf(safeUser.profileUserId) !== -1 || form.assistantIds.indexOf(safeUser.authUid) !== -1);
    var matchesAdminScope = isAdminLikeUser(safeUser) && userMatchesLocation(safeUser, form.locationId);

    if (matchesDirectClass || matchesTeacher || matchesAdminScope) {
      classes.push(classRecord);
    }
  });

  return dedupeRecords(classes).sort(function (a, b) {
    return readSafeString(a.name || a.id).localeCompare(readSafeString(b.name || b.id));
  });
}

function readUserCommandAssignments(user, primaryRole, classes) {
  var safeUser = getSafeUser(user);
  var classIds = classes.map(function (classRecord) { return classRecord.id; });
  var userIds = normalizeMixedIdList([safeUser.id, safeUser.authUid, safeUser.profileUserId]);
  var assignments = [];

  state.assignments.forEach(function (assignment) {
    var targetId = readSafeString(assignment.targetId || assignment.studentId || assignment.classId || assignment.locationId);
    var targetType = readSafeString(assignment.targetType || (assignment.studentId ? "student" : assignment.classId ? "class" : ""));
    var teacherIds = normalizeMixedIdList([assignment.responsibleTeacherId, assignment.assistantIds, assignment.teacherOwnershipIds]);
    var matchesStudent = primaryRole === "student" && ((targetType === "student" && userIds.indexOf(targetId) !== -1) || (targetType === "class" && classIds.indexOf(targetId || assignment.classId) !== -1));
    var matchesTeacher = primaryRole === "teacher" && teacherIds.some(function (id) { return userIds.indexOf(id) !== -1; });
    var matchesClass = classIds.indexOf(targetId) !== -1 || classIds.indexOf(readSafeString(assignment.classId)) !== -1;
    var matchesAdminScope = isAdminLikeUser(safeUser) && assignmentMatchesAnyLocation(assignment, safeUser.locationIds);

    if (matchesStudent || matchesTeacher || matchesClass || matchesAdminScope) {
      assignments.push(assignment);
    }
  });

  return dedupeRecords(assignments);
}

function assignmentMatchesAnyLocation(assignment, locationIds) {
  return normalizeMixedIdList(locationIds).some(function (locationId) {
    return assignmentMatchesLocation(assignment, locationId);
  });
}

function readUserCommandCourses(assignments, user, primaryRole) {
  var courseIds = [];
  var courses = [];

  assignments.forEach(function (assignment) {
    if (assignment.courseId && courseIds.indexOf(assignment.courseId) === -1) {
      courseIds.push(assignment.courseId);
    }
  });

  if (isAdminLikeUser(user)) {
    state.courses.forEach(function (course) {
      if (user.locationIds.some(function (locationId) { return courseMatchesLocation(course, locationId); }) && courseIds.indexOf(course.id) === -1) {
        courseIds.push(course.id);
      }
    });
  }

  courseIds.forEach(function (courseId) {
    var course = findCourse(courseId);
    if (course) {
      courses.push(course);
    }
  });

  return courses.sort(function (a, b) {
    return readCourseTitle(a).localeCompare(readCourseTitle(b));
  });
}

function readUserCommandChildren(user) {
  var safeUser = getSafeUser(user);
  var children = [];

  safeUser.childStudentIds.forEach(function (studentId) {
    var child = findUser(studentId) || findStudent(studentId);
    if (child) {
      children.push(getSafeUser(child));
    }
  });

  return dedupeRecords(children);
}

function readUserCommandSubmissions(user, primaryRole, classes, assignments, children) {
  var safeUser = getSafeUser(user);
  var submissions = state.overviewData && Array.isArray(state.overviewData.externalTaskSubmissions) ? state.overviewData.externalTaskSubmissions : [];
  var classIds = classes.map(function (classRecord) { return classRecord.id; });
  var courseIds = assignments.map(function (assignment) { return assignment.courseId; }).filter(Boolean);
  var childIds = children.map(function (child) { return child.id; });
  var userIds = normalizeMixedIdList([safeUser.id, safeUser.authUid, safeUser.profileUserId]);

  return submissions.filter(function (submission) {
    if (userIds.indexOf(readSafeString(submission.studentId)) !== -1 || userIds.indexOf(readSafeString(submission.userId)) !== -1) {
      return true;
    }

    if (childIds.indexOf(readSafeString(submission.studentId)) !== -1) {
      return true;
    }

    if ((primaryRole === "teacher" || isAdminLikeUser(safeUser)) && (classIds.indexOf(readSafeString(submission.classId)) !== -1 || courseIds.indexOf(readSafeString(submission.courseId)) !== -1)) {
      return true;
    }

    return false;
  }).sort(compareByUpdatedDesc);
}

function readUserCommandActivity(user, children) {
  var safeUser = getSafeUser(user);
  var childIds = children.map(function (child) { return child.id; });
  var userIds = normalizeMixedIdList([safeUser.id, safeUser.authUid, safeUser.profileUserId].concat(childIds));
  var records = state.overviewData && Array.isArray(state.overviewData.activityLogs) ? state.overviewData.activityLogs : [];
  var activity = [];

  records.forEach(function (record) {
    if (recordMatchesAnyUserId(record, userIds)) {
      activity.push({
        type: readSafeString(record.type || record.action || "Activity"),
        title: readSafeString(record.title || record.message || record.description || "User activity"),
        time: normalizeTimestamp(record.createdAt || record.updatedAt || record.time || Date.now())
      });
    }
  });

  return activity.sort(compareByTimeDesc);
}

function readUserCommandAudit(user) {
  var safeUser = getSafeUser(user);
  var userIds = normalizeMixedIdList([safeUser.id, safeUser.authUid, safeUser.profileUserId]);
  var records = state.overviewData && Array.isArray(state.overviewData.auditLogs) ? state.overviewData.auditLogs : [];

  return records.filter(function (record) {
    return recordMatchesAnyUserId(record, userIds);
  }).sort(compareByUpdatedDesc);
}

function recordMatchesAnyUserId(record, userIds) {
  var recordIds = normalizeMixedIdList([
    record && record.userId,
    record && record.uid,
    record && record.authUid,
    record && record.profileUserId,
    record && record.studentId,
    record && record.teacherId,
    record && record.targetUserId,
    record && record.performedBy,
    record && record.actorId
  ]);

  return recordIds.some(function (id) {
    return userIds.indexOf(id) !== -1;
  });
}

function readUserMetricNumber(user, fields) {
  var index = 0;

  while (index < fields.length) {
    var value = user[fields[index]];

    if (typeof value === "number" && isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
      return Number(value);
    }

    index = index + 1;
  }

  return 0;
}

function readAttendanceLabel(user) {
  var value = readUserMetricNumber(user, ["attendancePercent", "attendancePercentage", "attendanceRate"]);

  if (!value) {
    return "No data";
  }

  return value + "%";
}

function countPendingSubmissions(submissions) {
  return countItems(submissions, function (submission) {
    var status = readSafeString(submission.reviewStatus || submission.status || "pending");
    return status === "pending" || status === "submitted";
  });
}

function countReviewedSubmissionsForUser(userId) {
  var submissions = state.overviewData && Array.isArray(state.overviewData.externalTaskSubmissions) ? state.overviewData.externalTaskSubmissions : [];

  return countItems(submissions, function (submission) {
    return readSafeString(submission.reviewedBy || submission.teacherId || submission.reviewerId) === userId && readSafeString(submission.reviewStatus || submission.status) !== "pending";
  });
}

function countUserActivityMatches(userId, keywords) {
  var records = state.overviewData && Array.isArray(state.overviewData.activityLogs) ? state.overviewData.activityLogs : [];

  return countItems(records, function (record) {
    var text = [record.type, record.action, record.title, record.message, record.description].join(" ").toLowerCase();
    return recordMatchesAnyUserId(record, [userId]) && keywords.some(function (keyword) { return text.indexOf(keyword) !== -1; });
  });
}

function countStudentsAcrossClasses(classes) {
  var studentIds = [];

  classes.forEach(function (classRecord) {
    state.users.map(getSafeUser).forEach(function (user) {
      if (user.roles.indexOf("student") !== -1 && (user.classId === classRecord.id || user.classIds.indexOf(classRecord.id) !== -1) && studentIds.indexOf(user.id) === -1) {
        studentIds.push(user.id);
      }
    });
  });

  return studentIds.length;
}

function countManagedUsers(user) {
  var safeUser = getSafeUser(user);

  if (!isAdminLikeUser(safeUser)) {
    return 0;
  }

  return countItems(state.users.map(getSafeUser), function (profile) {
    return safeUser.locationIds.length > 0 && safeUser.locationIds.some(function (locationId) {
      return userMatchesLocation(profile, locationId);
    });
  });
}

function readCourseAssignmentForUserCourse(user, courseId) {
  var context = readUserCommandContext(user);
  var index = 0;

  while (index < context.assignments.length) {
    if (context.assignments[index].courseId === courseId) {
      return context.assignments[index];
    }
    index = index + 1;
  }

  return {};
}

function readCourseProgressLabel(user, course, assignment) {
  var progress = readUserMetricNumber(user, ["courseProgress", "progress", "completionPercent"]);

  if (progress) {
    return progress + "%";
  }

  if (assignment && typeof assignment.progress === "number") {
    return assignment.progress + "%";
  }

  if (course && typeof course.progress === "number") {
    return course.progress + "%";
  }

  return "No progress data";
}

function readUserLoginMethod(user) {
  var safeUser = getSafeUser(user);

  if (safeUser.roles.indexOf("student") !== -1 && safeUser.roles.length === 1) {
    return "Fruit login / student access";
  }

  if (safeUser.loginEnabled || safeUser.authUid) {
    return "Firebase email/password";
  }

  return "Not authorized";
}

function dedupeRecords(records) {
  var seen = {};
  var deduped = [];

  records.forEach(function (record) {
    var key = readSafeString(record && (record.id || record.userId || record.uid || record.classId || record.courseId));

    if (!key || seen[key]) {
      return;
    }

    seen[key] = true;
    deduped.push(record);
  });

  return deduped;
}

function normalizeMixedIdList(value) {
  var result = [];

  addMixedIds(result, value);
  return result;
}

function addMixedIds(result, value) {
  var index = 0;

  if (Array.isArray(value)) {
    while (index < value.length) {
      addMixedIds(result, value[index]);
      index = index + 1;
    }
    return;
  }

  splitCommaList(value).forEach(function (id) {
    if (id && result.indexOf(id) === -1) {
      result.push(id);
    }
  });
}

function compareByUpdatedDesc(a, b) {
  return normalizeTimestamp(b.updatedAt || b.createdAt || b.time) - normalizeTimestamp(a.updatedAt || a.createdAt || a.time);
}

function readTeacherName(userId) {
  var user = findUser(userId);
  return user ? (user.displayName || user.name || user.email || user.id) : "No teacher assigned";
}

function countStudentsForClass(classId) {
  return countItems(state.users.map(getSafeUser), function (user) {
    return user.roles.indexOf("student") !== -1 && (user.classId === classId || user.classIds.indexOf(classId) !== -1);
  });
}

function countAssignmentsForClass(classId) {
  return countItems(state.assignments, function (assignment) {
    return (assignment.targetType === "class" || assignment.classId) && (assignment.targetId === classId || assignment.classId === classId);
  });
}

function readCourseAssignmentStatsForLocation(courseId, locationId) {
  var assignments = readLocationCommandAssignments(locationId).filter(function (assignment) {
    return assignment.courseId === courseId;
  });

  return {
    classes: countItems(assignments, function (assignment) { return assignment.targetType === "class" || Boolean(assignment.classId); }),
    students: countItems(assignments, function (assignment) { return assignment.targetType === "student" || Boolean(assignment.studentId); })
  };
}

function userMatchesRoleFilter(user, roleFilter) {
  var safeFilter = readSafeString(roleFilter);
  var card = findRoleFilterCard(safeFilter);
  var safeUser = getSafeUser(user);
  var roles = safeUser.roles;
  var index = 0;

  if (!safeFilter) {
    return true;
  }

  if (!card || card.roles.length === 0) {
    return roles.indexOf(normalizeUserRole(safeFilter)) !== -1;
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
    return '<span class="sa-btn-spinner" aria-hidden="true"></span><span>' + escapeHtml(readPendingLabel(label)) + '</span><span class="sa-btn-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  }

  return escapeHtml(label);
}

function readPendingLabel(label) {
  if (label.indexOf("Log in") !== -1) {
    return "Signing in...";
  }

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
  var primaryTeacherId = readSafeString(classRecord.primaryTeacherId || classRecord.teacherId || classRecord.teacherUid);
  var assistantIds = normalizeAssistantIds([
    classRecord.assistantIds,
    classRecord.teacherIds
  ], primaryTeacherId);

  return {
    classId: classRecord.id,
    name: classRecord.name || "",
    locationId: readClassLocationId(classRecord),
    status: classRecord.status || "active",
    isVisible: classRecord.isVisible === false ? false : true,
    photoDataUrl: classRecord.photoDataUrl || "",
    primaryTeacherId: primaryTeacherId,
    assistantIds: assistantIds,
    primaryTeacherName: readSafeString(classRecord.primaryTeacherName || readUserDisplayName(primaryTeacherId)),
    assistantNames: Array.isArray(classRecord.assistantNames) ? classRecord.assistantNames : assistantIds.map(readUserDisplayName)
  };
}

function normalizeAssistantIds(value, primaryTeacherId) {
  var ids = [];
  var primaryId = readSafeString(primaryTeacherId);

  addAssistantIdSources(ids, value);

  return ids.filter(function (assistantId) {
    return assistantId && assistantId !== primaryId;
  });
}

function addAssistantIdSources(ids, value) {
  var index = 0;

  if (Array.isArray(value)) {
    while (index < value.length) {
      addAssistantIdSources(ids, value[index]);
      index = index + 1;
    }
    return;
  }

  splitCommaList(value).forEach(function (id) {
    if (ids.indexOf(id) === -1) {
      ids.push(id);
    }
  });
}

function applyClassStaffDisplayFields(form) {
  var safeForm = Object.assign({}, form || {});

  safeForm.primaryTeacherId = readSafeString(safeForm.primaryTeacherId);
  safeForm.assistantIds = normalizeAssistantIds(safeForm.assistantIds, safeForm.primaryTeacherId);
  safeForm.primaryTeacherName = readUserDisplayName(safeForm.primaryTeacherId);
  safeForm.assistantNames = safeForm.assistantIds.map(readUserDisplayName);

  return safeForm;
}

function readUsersByIds(ids) {
  return normalizeIdList(ids).map(findUser).filter(Boolean).map(getSafeUser);
}

function readUserDisplayName(userId) {
  var user = userId ? getSafeUser(findUser(userId)) : null;

  if (!user || !user.id) {
    return "";
  }

  return user.displayName || user.email || user.id;
}

function getSafeUser(user) {
  var safeUser = user || {};
  var roles = collectUserRoles(safeUser);
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
    visibleInUserLists: safeUser.visibleInUserLists === false ? false : true,
    isLegacyProfile: safeUser.isLegacyProfile === true,
    isAuthProfile: safeUser.isAuthProfile === true,
    mergedIntoAuthUid: readSafeString(safeUser.mergedIntoAuthUid),
    authUid: readSafeString(safeUser.authUid),
    profileUserId: readSafeString(safeUser.profileUserId),
    loginEnabled: safeUser.loginEnabled === true,
    loginAuthorizedAt: safeUser.loginAuthorizedAt || null,
    loginAuthorizedBy: readSafeString(safeUser.loginAuthorizedBy),
    childStudentIds: normalizeIdList(safeUser.childStudentIds),
    classId: readSafeString(safeUser.classId),
    classIds: normalizeIdList([safeUser.classId, safeUser.classIds, safeUser.assignedClassIds, safeUser.assignedClasses, safeUser.classes])
  });
}

function isVisibleUserProfile(user) {
  var safeUser = user || {};

  return safeUser.visibleInUserLists !== false
    && safeUser.isLegacyProfile !== true
    && readSafeString(safeUser.status) !== "merged";
}

function dedupeVisibleUserProfiles(users) {
  var visibleUsers = [];
  var groupedUsers = {};
  var groupOrder = [];
  var index = 0;

  while (index < users.length) {
    var user = getSafeUser(users[index]);

    if (isVisibleUserProfile(user)) {
      var key = readUserDedupeKey(user);

      if (!groupedUsers[key]) {
        groupedUsers[key] = [];
        groupOrder.push(key);
      }

      groupedUsers[key].push(user);
    }

    index = index + 1;
  }

  index = 0;
  while (index < groupOrder.length) {
    var group = groupedUsers[groupOrder[index]];
    visibleUsers.push(selectActiveUserProfile(group));
    index = index + 1;
  }

  return visibleUsers;
}

function readUserDedupeKey(user) {
  var safeUser = getSafeUser(user);
  var email = safeUser.email.toLowerCase();

  if (safeUser.roles.indexOf("teacher") !== -1) {
    if (email) {
      return "teacher-email:" + email;
    }

    if (safeUser.authUid) {
      return "teacher-auth:" + safeUser.authUid;
    }

    if (safeUser.profileUserId) {
      return "teacher-profile:" + safeUser.profileUserId;
    }
  }

  return "user:" + safeUser.id;
}

function selectActiveUserProfile(users) {
  var selected = users[0];
  var index = 1;

  while (index < users.length) {
    selected = compareUserProfilePriority(users[index], selected) > 0 ? users[index] : selected;
    index = index + 1;
  }

  index = 0;
  while (index < users.length) {
    selected = mergeUserDisplayFields(selected, users[index]);
    index = index + 1;
  }

  if (users.length > 1) {
    console.info("[users:dedupe-teacher-profile]", {
      selectedUserId: selected.id,
      selectedAuthUid: selected.authUid,
      duplicateUserIds: users.map(function (user) { return user.id; })
    });
  }

  return selected;
}

function compareUserProfilePriority(candidate, current) {
  return scoreUserProfile(candidate) - scoreUserProfile(current);
}

function scoreUserProfile(user) {
  var safeUser = getSafeUser(user);
  var score = 0;

  if (safeUser.authUid && safeUser.id === safeUser.authUid && safeUser.loginEnabled) score += 1000;
  if (safeUser.isAuthProfile) score += 850;
  if (safeUser.authUid && safeUser.id === safeUser.authUid) score += 700;
  if (safeUser.loginEnabled) score += 300;
  if (!safeUser.isLegacyProfile) score += 100;
  if (safeUser.photoUrl) score += 50;
  if (safeUser.phone) score += 20;
  if (safeUser.status === "active") score += 10;

  return score;
}

function mergeUserDisplayFields(primaryUser, fallbackUser) {
  var merged = Object.assign({}, primaryUser);
  var fallback = getSafeUser(fallbackUser);

  if (!merged.photoUrl && fallback.photoUrl) merged.photoUrl = fallback.photoUrl;
  if (!merged.phone && fallback.phone) merged.phone = fallback.phone;
  if (!merged.displayName && fallback.displayName) merged.displayName = fallback.displayName;
  if ((!merged.locationIds || merged.locationIds.length === 0) && fallback.locationIds && fallback.locationIds.length > 0) merged.locationIds = fallback.locationIds.slice();
  if (!merged.primaryLocationId && fallback.primaryLocationId) merged.primaryLocationId = fallback.primaryLocationId;
  if ((!merged.classIds || merged.classIds.length === 0) && fallback.classIds && fallback.classIds.length > 0) merged.classIds = fallback.classIds.slice();
  if (!merged.classId && fallback.classId) merged.classId = fallback.classId;

  return merged;
}

function hasTeacherLoginAuthorization(user) {
  var safeUser = getSafeUser(user);
  return Boolean(safeUser.authUid && safeUser.email && safeUser.loginEnabled);
}

function readTeacherLoginMissingFields(user) {
  var safeUser = getSafeUser(user);
  var missing = [];

  if (!readTeacherDisplayName(safeUser)) {
    missing.push("Display name");
  }

  if (!isValidEmail(safeUser.email)) {
    missing.push("Email address");
  }

  if (!isTeacherUser(safeUser)) {
    missing.push("Teacher role");
  }

  if (!safeUser.primaryLocationId) {
    missing.push("Primary location");
  }

  if (safeUser.classIds.length === 0) {
    missing.push("Assigned class");
  }

  if (!isActiveUserStatus(safeUser.status)) {
    missing.push("Active status");
  }

  return missing;
}

function readTeacherDisplayName(user) {
  var safeUser = user || {};
  return readSafeString(safeUser.displayName || safeUser.name || safeUser.email).trim();
}

function isActiveUserStatus(status) {
  var normalizedStatus = readSafeString(status || "active").trim().toLowerCase();
  return normalizedStatus === "active" || normalizedStatus === "approved";
}

function readCallableErrorMessage(error) {
  var details = error && (error.details || error.customData) ? (error.details || error.customData) : {};
  var missingFields = Array.isArray(details.missingFields) ? details.missingFields : [];

  if (missingFields.length > 0) {
    return "Before authorizing this teacher, complete: " + missingFields.join(", ") + ".";
  }

  return error && error.message ? error.message : "Unknown error";
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

  var context = readCourseCommandContext(course);

  if (context.modules.length > 0) {
    return context.modules.length;
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

function readCourseStatus(course) {
  return readSafeString(course && (course.status || course.lifecycleStatus || (course.published ? "published" : ""))) || "draft";
}

function readCourseVisibility(course) {
  return readSafeString(course && (course.visibility || course.audience || course.scope)) || "All locations";
}

function readCourseVersion(course) {
  return readSafeString(course && (course.version || course.currentVersion || course.versionLabel)) || "v1.0";
}

function readCourseLanguage(course) {
  var languages = normalizeMixedIdList(course && (course.languages || course.languageCodes));

  return readSafeString(course && (course.language || course.primaryLanguage || languages[0])) || "Not set";
}

function readCourseCategory(course) {
  return readSafeString(course && (course.category || course.subject || course.track || course.type)) || "Not set";
}

function readCourseInitials(course) {
  return readInitials(readCourseTitle(course) || "Course");
}

function readCourseCompletionLabel(context) {
  var value = context && context.course && (context.course.completionPercent || context.course.averageCompletion || context.course.progress);

  if (typeof value === "number" && isFinite(value)) {
    return Math.round(value) + "%";
  }

  return "No data";
}

function readCourseCommandContext(course) {
  var modules = readCourseCommandModules(course);
  var assignments = readCourseCommandAssignments(course.id);
  var classes = readCourseCommandClasses(assignments);
  var locations = readCourseCommandLocations(assignments, classes, course);
  var students = readCourseCommandStudents(assignments, classes);
  var submissions = readCourseCommandSubmissions(course, assignments, students);
  var publishedModules = countItems(modules, function (moduleRecord) { return readModuleStatus(moduleRecord) === "published"; });

  return {
    course: course,
    modules: modules,
    assignments: assignments,
    classes: classes,
    locations: locations,
    students: students,
    submissions: submissions,
    publishedModules: publishedModules,
    draftModules: modules.length - publishedModules,
    activity: readCourseCommandActivity(course),
    audit: readCourseCommandAudit(course)
  };
}

function readCourseCommandModules(course) {
  var modules = [];
  var courseId = readSafeString(course && course.id);
  var overviewModules = state.overviewData && Array.isArray(state.overviewData.modules) ? state.overviewData.modules : [];

  overviewModules.forEach(function (moduleRecord) {
    if (moduleBelongsToCourse(moduleRecord, courseId)) {
      modules.push(moduleRecord);
    }
  });

  addEmbeddedCourseModules(modules, course);

  return dedupeRecords(modules).sort(function (a, b) {
    return readModuleSortOrder(a) - readModuleSortOrder(b) || readModuleTitle(a).localeCompare(readModuleTitle(b));
  });
}

function addEmbeddedCourseModules(modules, course) {
  var index = 0;

  if (!course) {
    return;
  }

  if (Array.isArray(course.modules)) {
    while (index < course.modules.length) {
      if (typeof course.modules[index] === "string") {
        modules.push({ id: course.modules[index], title: course.modules[index], courseId: course.id });
      } else if (course.modules[index]) {
        modules.push(Object.assign({ courseId: course.id }, course.modules[index]));
      }
      index = index + 1;
    }
  }

  if (Array.isArray(course.moduleIds)) {
    course.moduleIds.forEach(function (moduleId, order) {
      modules.push({ id: moduleId, title: moduleId, courseId: course.id, order: order });
    });
  }

  if (Array.isArray(course.moduleOrder)) {
    course.moduleOrder.forEach(function (moduleId, order) {
      modules.push({ id: moduleId, title: moduleId, courseId: course.id, order: order });
    });
  }
}

function moduleBelongsToCourse(moduleRecord, courseId) {
  if (!moduleRecord || !courseId) {
    return false;
  }

  return readSafeString(moduleRecord.courseId || moduleRecord.catalogCourseId || moduleRecord.parentCourseId || moduleRecord.courseRefId) === courseId;
}

function readCourseCommandAssignments(courseId) {
  return state.assignments.filter(function (assignment) {
    return readSafeString(assignment.courseId || assignment.catalogCourseId) === courseId;
  }).sort(compareByUpdatedDesc);
}

function readCourseCommandClasses(assignments) {
  var classes = [];

  assignments.forEach(function (assignment) {
    var classId = readSafeString(assignment.classId || ((assignment.targetType || "class") === "class" ? assignment.targetId : ""));
    var classRecord = classId ? findClass(classId) : null;

    if (classRecord) {
      classes.push(classRecord);
    }
  });

  return dedupeRecords(classes).sort(function (a, b) {
    return readClassName(a.id).localeCompare(readClassName(b.id));
  });
}

function readCourseCommandLocations(assignments, classes, course) {
  var locations = [];

  assignments.forEach(function (assignment) {
    var locationId = readAssignmentLocationId(assignment);
    var location = locationId ? findLocation(locationId) : null;

    if (location) {
      locations.push(location);
    }
  });

  classes.forEach(function (classRecord) {
    var classLocationId = readClassLocationId(classRecord);
    var location = classLocationId ? findLocation(classLocationId) : null;

    if (location) {
      locations.push(location);
    }
  });

  normalizeMixedIdList(course && (course.locationIds || course.assignedLocationIds)).forEach(function (locationId) {
    var location = findLocation(locationId);
    if (location) locations.push(location);
  });

  return dedupeRecords(locations).sort(function (a, b) {
    return readSafeString(a.name || a.id).localeCompare(readSafeString(b.name || b.id));
  });
}

function readCourseCommandStudents(assignments, classes) {
  var students = [];

  assignments.forEach(function (assignment) {
    var studentId = readSafeString(assignment.studentId || ((assignment.targetType || "") === "student" ? assignment.targetId : ""));
    var student = studentId ? (findStudent(studentId) || findUser(studentId)) : null;

    if (student) {
      students.push(student);
    }
  });

  classes.forEach(function (classRecord) {
    state.users.map(getSafeUser).forEach(function (user) {
      if (user.roles.indexOf("student") !== -1 && (user.classId === classRecord.id || user.classIds.indexOf(classRecord.id) !== -1)) {
        students.push(user);
      }
    });
  });

  return dedupeRecords(students).sort(function (a, b) {
    return readSafeString(a.displayName || a.name || a.id).localeCompare(readSafeString(b.displayName || b.name || b.id));
  });
}

function readCourseCommandSubmissions(course, assignments, students) {
  var submissions = state.overviewData && Array.isArray(state.overviewData.externalTaskSubmissions) ? state.overviewData.externalTaskSubmissions : [];
  var courseId = readSafeString(course && course.id);
  var assignmentIds = assignments.map(function (assignment) { return assignment.id; });
  var studentIds = students.map(function (student) { return readSafeString(student.id || student.studentId || student.userId); });

  return submissions.filter(function (submission) {
    return readSafeString(submission.courseId || submission.catalogCourseId) === courseId
      || assignmentIds.indexOf(readSafeString(submission.assignmentId)) !== -1
      || studentIds.indexOf(readSafeString(submission.studentId || submission.userId)) !== -1;
  }).sort(compareByUpdatedDesc);
}

function readCourseCommandActivity(course) {
  var courseId = readSafeString(course && course.id);
  var records = state.overviewData && Array.isArray(state.overviewData.activityLogs) ? state.overviewData.activityLogs : [];

  return records.filter(function (record) {
    return readSafeString(record.courseId || record.catalogCourseId || record.targetCourseId) === courseId;
  }).map(function (record) {
    return {
      type: readSafeString(record.type || record.action || "Activity"),
      title: readSafeString(record.title || record.message || record.description || "Course activity"),
      time: normalizeTimestamp(record.createdAt || record.updatedAt || record.time || Date.now())
    };
  }).sort(compareByTimeDesc);
}

function readCourseCommandAudit(course) {
  var courseId = readSafeString(course && course.id);
  var records = state.overviewData && Array.isArray(state.overviewData.auditLogs) ? state.overviewData.auditLogs : [];

  return records.filter(function (record) {
    return readSafeString(record.courseId || record.catalogCourseId || record.targetCourseId) === courseId;
  }).sort(compareByUpdatedDesc);
}

function findModuleForCourse(courseId, moduleId) {
  var course = findCourse(courseId);
  var modules = course ? readCourseCommandModules(course) : [];
  var index = 0;

  while (index < modules.length) {
    if (readSafeString(modules[index].id || modules[index].moduleId) === moduleId) {
      return modules[index];
    }
    index = index + 1;
  }

  return null;
}

function readModuleCommandContext(course, moduleRecord) {
  var steps = readModuleStepList(moduleRecord);
  var context = course ? readCourseCommandContext(course) : { assignments: [], submissions: [], students: [] };
  var moduleId = readSafeString(moduleRecord && (moduleRecord.id || moduleRecord.moduleId));
  var moduleSubmissions = context.submissions.filter(function (submission) {
    return readSafeString(submission.moduleId) === moduleId || !submission.moduleId;
  });

  return {
    course: course || {},
    courseId: readSafeString(course && course.id),
    module: moduleRecord,
    tracks: readModuleTrackList(moduleRecord),
    pages: readModulePageList(moduleRecord),
    steps: steps,
    assignments: context.assignments,
    students: context.students,
    submissions: moduleSubmissions,
    activity: readModuleActivity(moduleRecord, context.activity),
    audit: readModuleAudit(moduleRecord, context.audit),
    studentsStarted: readModuleNumericMetric(moduleRecord, ["studentsStarted", "startedCount", "startCount"]),
    studentsCompleted: readModuleNumericMetric(moduleRecord, ["studentsCompleted", "completedCount", "completionCount"])
  };
}

function readModuleTitle(moduleRecord) {
  if (!moduleRecord) {
    return "";
  }

  if (typeof moduleRecord.title === "string" && moduleRecord.title) return moduleRecord.title;
  if (moduleRecord.title && typeof moduleRecord.title.en === "string" && moduleRecord.title.en) return moduleRecord.title.en;
  if (typeof moduleRecord.name === "string" && moduleRecord.name) return moduleRecord.name;
  if (typeof moduleRecord.displayName === "string" && moduleRecord.displayName) return moduleRecord.displayName;
  return moduleRecord.id || moduleRecord.moduleId || "Untitled module";
}

function readModuleInitials(moduleRecord) {
  return readInitials(readModuleTitle(moduleRecord) || "Module");
}

function readModuleStatus(moduleRecord) {
  var status = readSafeString(moduleRecord && (moduleRecord.status || moduleRecord.lifecycleStatus || moduleRecord.publishStatus));

  if (status) {
    return status;
  }

  if (moduleRecord && moduleRecord.published === true) {
    return "published";
  }

  return "draft";
}

function readModuleUpdatedAt(moduleRecord) {
  return moduleRecord ? (moduleRecord.updatedAt || moduleRecord.modifiedAt || moduleRecord.createdAt || null) : null;
}

function readModuleEstimatedTime(moduleRecord) {
  return readSafeString(moduleRecord && (moduleRecord.estimatedTime || moduleRecord.estimatedDuration || moduleRecord.durationLabel)) || "No time estimate";
}

function readModuleNumericMetric(moduleRecord, fields) {
  var index = 0;

  if (!moduleRecord) {
    return 0;
  }

  while (index < fields.length) {
    if (typeof moduleRecord[fields[index]] === "number" && isFinite(moduleRecord[fields[index]])) {
      return moduleRecord[fields[index]];
    }
    index = index + 1;
  }

  return 0;
}

function readModuleProgressLabel(moduleRecord, context) {
  var value = readModuleNumericMetric(moduleRecord || {}, ["averageProgress", "progress", "completionPercent"]);

  if (value) {
    return Math.round(value) + "%";
  }

  if (context && context.steps && context.steps.length > 0 && context.studentsCompleted > 0) {
    return context.studentsCompleted + " completed";
  }

  return "No data";
}

function readModuleStructureSummary(moduleRecord) {
  return {
    tracks: readModuleTrackList(moduleRecord).length,
    pages: readModulePageList(moduleRecord).length,
    steps: readModuleStepList(moduleRecord).length
  };
}

function readModuleTrackList(moduleRecord) {
  var tracks = collectObjectList([
    moduleRecord && moduleRecord.tracks,
    moduleRecord && moduleRecord.trackOrder,
    moduleRecord && moduleRecord.learningTracks,
    moduleRecord && moduleRecord.learningModes
  ], "track");

  if (tracks.length === 0 && moduleRecord && (moduleRecord.track || moduleRecord.mode)) {
    tracks.push({ id: moduleRecord.track || moduleRecord.mode, title: moduleRecord.track || moduleRecord.mode });
  }

  return dedupeRecords(tracks);
}

function readModulePageList(moduleRecord) {
  return dedupeRecords(collectObjectList([
    moduleRecord && moduleRecord.pages,
    moduleRecord && moduleRecord.pageOrder,
    moduleRecord && moduleRecord.learningPages
  ], "page"));
}

function readModuleStepList(moduleRecord) {
  var steps = collectObjectList([
    moduleRecord && moduleRecord.steps,
    moduleRecord && moduleRecord.stepOrder,
    moduleRecord && moduleRecord.learningSteps
  ], "step");

  collectNestedSteps(steps, moduleRecord && moduleRecord.learningModes);
  collectNestedSteps(steps, moduleRecord && moduleRecord.tracks);
  collectNestedSteps(steps, moduleRecord && moduleRecord.pages);

  return dedupeRecords(steps);
}

function collectNestedSteps(result, value) {
  collectObjectList([value], "container").forEach(function (record) {
    collectObjectList([record.steps, record.stepOrder], "step").forEach(function (step) {
      result.push(Object.assign({}, step, {
        trackId: step.trackId || record.trackId || record.id,
        pageId: step.pageId || record.pageId
      }));
    });
  });
}

function collectObjectList(sources, fallbackPrefix) {
  var result = [];

  sources.forEach(function (source) {
    if (Array.isArray(source)) {
      source.forEach(function (item, index) {
        if (typeof item === "string") {
          result.push({ id: item, title: item, order: index });
        } else if (item) {
          result.push(Object.assign({ id: item.id || item.moduleId || fallbackPrefix + "-" + index, order: index }, item));
        }
      });
      return;
    }

    if (source && typeof source === "object") {
      Object.keys(source).forEach(function (key, index) {
        var item = source[key];
        if (item && typeof item === "object") {
          result.push(Object.assign({ id: key, order: index }, item));
        }
      });
    }
  });

  return result.sort(function (a, b) {
    return readModuleSortOrder(a) - readModuleSortOrder(b);
  });
}

function readModuleSortOrder(record) {
  var order = record && (record.order || record.sortOrder || record.position || record.index);
  return typeof order === "number" ? order : 9999;
}

function countPagesForTrack(pages, track) {
  var trackId = readSafeString(track && track.id);
  return countItems(pages, function (page) {
    return readSafeString(page.trackId || page.track) === trackId;
  });
}

function countStepsForTrack(steps, track) {
  var trackId = readSafeString(track && track.id);
  return countItems(steps, function (step) {
    return readSafeString(step.trackId || step.track) === trackId;
  });
}

function countStepsForPage(steps, page) {
  var pageId = readSafeString(page && page.id);
  return countItems(steps, function (step) {
    return readSafeString(step.pageId || step.page) === pageId;
  });
}

function readBlockCount(page) {
  if (!page) {
    return 0;
  }

  if (Array.isArray(page.blocks)) {
    return page.blocks.length;
  }

  if (Array.isArray(page.blockOrder)) {
    return page.blockOrder.length;
  }

  return typeof page.blockCount === "number" ? page.blockCount : 0;
}

function readStepValidationWarning(step) {
  if (!readSafeString(step && (step.type || step.stepType || step.kind))) {
    return "Missing type";
  }

  if (!readSafeString(step && (step.title || step.name))) {
    return "Missing title";
  }

  return "None";
}

function readModuleActivity(moduleRecord, courseActivity) {
  var moduleId = readSafeString(moduleRecord && (moduleRecord.id || moduleRecord.moduleId));

  return (courseActivity || []).filter(function (record) {
    return !record.moduleId || readSafeString(record.moduleId) === moduleId;
  });
}

function readModuleAudit(moduleRecord, courseAudit) {
  var moduleId = readSafeString(moduleRecord && (moduleRecord.id || moduleRecord.moduleId));

  return (courseAudit || []).filter(function (record) {
    return !record.moduleId || readSafeString(record.moduleId) === moduleId;
  });
}

function readAssignmentLocationId(assignment) {
  if (!assignment) {
    return "";
  }

  if (assignment.locationId || assignment.primaryLocationId || assignment.schoolId) {
    return readSafeString(assignment.locationId || assignment.primaryLocationId || assignment.schoolId);
  }

  if ((assignment.targetType || "") === "location") {
    return readSafeString(assignment.targetId);
  }

  return readClassLocationId(findClass(assignment.classId || assignment.targetId));
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
  payload = Object.assign(payload, applyAssignmentStaffDisplayFields(payload));

  return payload;
}

function normalizeAssignmentOwnership(record) {
  var responsibleTeacherId = readSafeString(record.responsibleTeacherId || record.teacherId || record.teacherUid);
  var assistantIds = normalizeAssignmentAssistantIds([
    record.assistantIds,
    record.teacherIds
  ], responsibleTeacherId);

  return {
    responsibleTeacherId: responsibleTeacherId,
    assistantIds: assistantIds,
    responsibleTeacherName: readSafeString(record.responsibleTeacherName || readUserDisplayName(responsibleTeacherId)),
    assistantNames: Array.isArray(record.assistantNames) ? record.assistantNames : assistantIds.map(readUserDisplayName)
  };
}

function normalizeAssignmentAssistantIds(value, responsibleTeacherId) {
  var ids = [];
  var responsibleId = readSafeString(responsibleTeacherId);

  addAssistantIdSources(ids, value);

  return ids.filter(function (assistantId) {
    return assistantId && assistantId !== responsibleId;
  });
}

function applyAssignmentStaffDisplayFields(record) {
  var safeRecord = Object.assign({}, record || {});

  safeRecord.responsibleTeacherId = readSafeString(safeRecord.responsibleTeacherId);
  safeRecord.assistantIds = normalizeAssignmentAssistantIds(safeRecord.assistantIds, safeRecord.responsibleTeacherId);
  safeRecord.responsibleTeacherName = readUserDisplayName(safeRecord.responsibleTeacherId);
  safeRecord.assistantNames = safeRecord.assistantIds.map(readUserDisplayName);

  return {
    responsibleTeacherId: safeRecord.responsibleTeacherId,
    assistantIds: safeRecord.assistantIds,
    responsibleTeacherName: safeRecord.responsibleTeacherName,
    assistantNames: safeRecord.assistantNames
  };
}

function readAssignmentStudentName(studentId) {
  var student = findStudent(studentId);

  return student ? (student.name || student.displayName || student.id) : studentId;
}

function canCreateAssignment() {
  return readAssignmentValidationMessage(state.assignmentForm) === "";
}

function readAssignmentValidationMessage(form) {
  var safeForm = form || {};

  if (!safeForm.courseId) {
    return "Choose a course before creating this assignment.";
  }

  if (!safeForm.locationId) {
    return "Choose a location before creating this assignment.";
  }

  if (safeForm.targetType === "student" && !safeForm.studentId) {
    return "Choose a student before creating this assignment.";
  }

  if (safeForm.targetType !== "student" && !safeForm.classId) {
    return "Choose a class before creating this assignment.";
  }

  return "";
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
  if (actorHasSuperAdminRole(state.actor)) {
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
  if (Array.isArray(role)) {
    return role.some(isSuperAdminRole);
  }

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

function readPrimaryRole(roles) {
  var priority = ["superAdmin", "platformAdmin", "ministryUser", "regionalAdmin", "schoolAdmin", "courseCreator", "assistant", "teacher", "parent", "student"];
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

  if (safeRoles.indexOf("assistant") !== -1) {
    return "assistant";
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

function readRolesFromSource(source) {
  if (!source || typeof source !== "object") {
    return [];
  }

  var values = [];

  if (typeof source.role === "string") values.push(source.role);
  if (typeof source.userRole === "string") values.push(source.userRole);
  if (typeof source.primaryRole === "string") values.push(source.primaryRole);
  if (Array.isArray(source.roles)) values = values.concat(source.roles);
  if (Array.isArray(source.userRoles)) values = values.concat(source.userRoles);
  if (source.ROLE_SUPER_ADMIN === true) values.push("ROLE_SUPER_ADMIN");
  if (source.ROLE_PLATFORM_ADMIN === true) values.push("ROLE_PLATFORM_ADMIN");
  if (source.ROLE_SCHOOL_ADMIN === true) values.push("ROLE_SCHOOL_ADMIN");
  if (source.ROLE_COURSE_CREATOR === true) values.push("ROLE_COURSE_CREATOR");
  if (source.ROLE_ASSISTANT === true) values.push("ROLE_ASSISTANT");
  if (source.ROLE_TEACHER === true) values.push("ROLE_TEACHER");
  if (source.ROLE_STUDENT === true) values.push("ROLE_STUDENT");

  return normalizeRoles(values, "");
}

function mergeRoleLists() {
  var merged = [];
  var lists = Array.prototype.slice.call(arguments);

  lists.forEach(function (roles) {
    normalizeRoles(roles, "").forEach(function (role) {
      if (merged.indexOf(role) === -1) {
        merged.push(role);
      }
    });
  });

  return merged;
}

function actorHasSuperAdminRole(actor) {
  if (!actor) {
    return false;
  }

  return isSuperAdminRole(actor.roles || [actor.role]);
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


