import { getIdTokenResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../packages/core/src/infrastructure/firebase/auth.js";
import { db, doc, getDoc } from "../../../packages/core/src/infrastructure/firebase/firestore.js";
import { getIntentDefinition } from "../../../packages/core/src/icf/engine/intentRegistry.js";
import { runIntentPipeline } from "../../../packages/core/src/icf/engine/runIntentPipeline.js";

var appElement = document.getElementById("app");
var state = {
  isLoading: true,
  isSaving: false,
  authPhase: "checkingAuth",
  needsLogin: false,
  activeTab: "overview",
  message: "",
  messageType: "info",
  admin: null,
  actor: null,
  locations: [],
  classes: [],
  students: [],
  filters: {
    locationId: "",
    classId: "",
    searchText: ""
  },
  locationForm: createLocationForm(),
  classForm: createClassForm(),
  studentForm: createStudentForm(),
  loginToolStudentId: "",
  resetStudentId: "",
  resetFruitPassword: []
};

var tabs = ["overview", "locations", "classes", "students", "loginTools"];
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
      actor: null,
      admin: null,
      message: "",
      messageType: "info"
    });
    return;
  }

  setState({
    isLoading: true,
    authPhase: "profileLoading",
    needsLogin: false,
    actor: null,
    admin: null,
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
  setState({ isLoading: true, message: "Loading admin data...", messageType: "info" });

  var locationsResult = await runAdminIntent("ListLocationsIntent", {});
  var classesResult = await runAdminIntent("ListClassesIntent", {
    locationId: state.filters.locationId
  });
  var studentsResult = await runAdminIntent("ListStudentsIntent", {
    locationId: state.filters.locationId,
    classId: state.filters.classId,
    searchText: state.filters.searchText
  });

  setState({
    isLoading: false,
    locations: readDataList(locationsResult, "locations"),
    classes: readDataList(classesResult, "classes"),
    students: readDataList(studentsResult, "students"),
    message: "",
    messageType: "info"
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

  return '<section class="sa-loading" aria-busy="true"><div class="sa-spinner"></div><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(note) + '</p></section>';
}

function buildAccessDeniedView() {
  return '<section class="sa-access-card"><h1>Super Admin Access Required</h1><p>' + escapeHtml(state.message || "Sign in with a super admin or platform admin account.") + '</p><div class="sa-form sa-form-2"><button type="button" class="sa-btn sa-btn-secondary" data-action="go-admin-login">Go to Login</button><button type="button" class="sa-btn" data-action="sign-out">Sign out</button></div></section>';
}

function buildLoginView() {
  return '<section class="sa-access-card sa-login-card"><p class="sa-eyebrow">Admin Login</p><h1>Sign in to Super Admin</h1><p>Use a super admin or platform admin account. We will bring you back here after login.</p><div class="sa-form"><button type="button" class="sa-btn" data-action="go-admin-login">Go to Login</button></div></section>';
}

function buildDashboardView() {
  var html = "";

  html += '<section class="sa-shell">';
  html += '<aside class="sa-sidebar">';
  html += '<div class="sa-brand">OquWay</div>';
  html += '<p>Super Admin</p>';
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
  var index = 0;

  while (index < tabs.length) {
    var tab = tabs[index];
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
  if (state.activeTab === "locations") {
    return buildLocationsTab();
  }

  if (state.activeTab === "classes") {
    return buildClassesTab();
  }

  if (state.activeTab === "students") {
    return buildStudentsTab();
  }

  if (state.activeTab === "loginTools") {
    return buildLoginToolsTab();
  }

  return buildOverviewTab();
}

function buildOverviewTab() {
  return '<section class="sa-grid sa-grid-3">'
    + buildMetricCard("Locations", state.locations.length, "Programs and school sites")
    + buildMetricCard("Classes", state.classes.length, "Groups available for student login")
    + buildMetricCard("Students", state.students.length, "Student profiles in current filters")
    + '</section>';
}

function buildMetricCard(title, value, note) {
  return '<article class="sa-card sa-metric"><span>' + escapeHtml(title) + '</span><strong>' + value + '</strong><p>' + escapeHtml(note) + '</p></article>';
}

function buildLocationsTab() {
  return '<section class="sa-stack">'
    + '<article class="sa-card"><h2>Create Location</h2>' + buildLocationForm("new", state.locationForm) + '</article>'
    + '<article class="sa-card"><h2>All Locations</h2>' + buildLocationRows() + '</article>'
    + '</section>';
}

function buildLocationRows() {
  var html = '<div class="sa-table">';
  var index = 0;

  if (state.locations.length === 0) {
    return '<div class="sa-empty">No locations yet.</div>';
  }

  while (index < state.locations.length) {
    var location = state.locations[index];
    html += '<div class="sa-row">' + buildLocationForm(location.id, normalizeLocationForm(location)) + '</div>';
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildLocationForm(formId, form) {
  return '<div class="sa-form sa-form-5">'
    + buildInput("location", formId, "name", "Name", form.name)
    + buildSelect("location", formId, "status", form.status, ["active", "inactive", "archived"])
    + buildSelect("location", formId, "loginMode", form.loginMode, ["fruit", "standard", "hybrid"])
    + buildInput("location", formId, "loginSlug", "Login Slug", form.loginSlug)
    + buildInput("location", formId, "imageUrl", "Image URL", form.imageUrl)
    + '<button type="button" class="sa-btn" data-action="' + (formId === "new" ? "create-location" : "update-location") + '" data-id="' + escapeHtml(formId) + '">' + (formId === "new" ? "Create" : "Save") + '</button>'
    + buildLoginLinkPreview(form.loginSlug)
    + '</div>';
}

function buildLoginLinkPreview(loginSlug) {
  var normalizedSlug = normalizeLoginSlug(loginSlug);
  var loginLink = buildLoginLink(normalizedSlug);

  if (!normalizedSlug) {
    return '<div class="sa-login-link-preview"><strong>Login Link</strong><span>Add a slug to create a shareable location login link.</span></div>';
  }

  return '<div class="sa-login-link-preview"><strong>Login Link</strong><span>' + escapeHtml(loginLink) + '</span><button type="button" class="sa-btn sa-btn-secondary" data-action="copy-login-link" data-id="' + escapeHtml(normalizedSlug) + '">Copy Link</button></div>';
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
    + '<article class="sa-card"><h2>Create Student</h2>' + buildStudentForm("new", state.studentForm, true) + '</article>'
    + '<article class="sa-card"><h2>Students</h2>' + buildAdminFilters(true) + buildStudentRows() + '</article>'
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

function buildInput(kind, id, field, label, value) {
  return '<label>' + escapeHtml(label) + '<input data-field-kind="' + kind + '" data-field-id="' + escapeHtml(id) + '" data-field="' + escapeHtml(field) + '" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(label) + '"></label>';
}

function buildSelect(kind, id, field, value, options) {
  var html = '<label>' + escapeHtml(field) + '<select data-field-kind="' + kind + '" data-field-id="' + escapeHtml(id) + '" data-field="' + escapeHtml(field) + '">';
  var index = 0;

  while (index < options.length) {
    html += '<option value="' + escapeHtml(options[index]) + '"' + selected(value, options[index]) + '>' + escapeHtml(options[index]) + '</option>';
    index = index + 1;
  }

  html += '</select></label>';
  return html;
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
    setState({ activeTab: tabButton.getAttribute("data-tab"), message: "" });
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

  if (target.getAttribute("data-login-tool-student")) {
    setState({ loginToolStudentId: target.value });
    return;
  }

  if (target.getAttribute("data-field")) {
    updateFormValue(target);
  }
}

function updateFormValue(target) {
  var kind = target.getAttribute("data-field-kind");
  var id = target.getAttribute("data-field-id");
  var field = target.getAttribute("data-field");
  var value = target.value;

  if (field === "isVisible") {
    value = value === "true";
  }

  if (kind === "location" && id === "new") {
    state.locationForm[field] = value;
    if (field === "loginSlug") {
      render();
    }
  } else if (kind === "class" && id === "new") {
    state.classForm[field] = value;
  } else if (kind === "student" && id === "new") {
    state.studentForm[field] = value;
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
  }

  while (index < list.length) {
    if (list[index].id === id) {
      list[index][field] = value;
      render();
      return;
    }

    index = index + 1;
  }
}

async function handleAction(action, id) {
  if (action === "refresh-data") {
    await refreshAllData();
  } else if (action === "go-admin-login") {
    await goAdminLogin();
  } else if (action === "create-location") {
    await saveIntent("CreateLocationIntent", state.locationForm, "Location created.");
    state.locationForm = createLocationForm();
    await refreshAllData();
  } else if (action === "update-location") {
    await saveIntent("UpdateLocationIntent", normalizeLocationForm(findLocation(id)), "Location saved.");
    await refreshAllData();
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
  } else if (action === "sign-out") {
    await signOutAdmin();
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
  if (isSuccess(result) && Array.isArray(result.emitted.data[key])) {
    return result.emitted.data[key];
  }

  return [];
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
  return { name: "", status: "active", loginMode: "fruit", loginSlug: "", imageUrl: "" };
}

function createClassForm() {
  return { name: "", locationId: "", status: "active", isVisible: true, photoDataUrl: "" };
}

function createStudentForm() {
  return { name: "", photoUrl: "", classId: "", locationId: "", status: "active", email: "", username: "", fruitPassword: [] };
}

function normalizeLocationForm(location) {
  return {
    locationId: location.id,
    name: location.name || "",
    status: location.status || "active",
    loginMode: location.loginMode || "fruit",
    loginSlug: location.loginSlug || "",
    imageUrl: location.imageUrl || ""
  };
}

function buildLoginLink(loginSlug) {
  return window.location.origin + "/l/" + normalizeLoginSlug(loginSlug);
}

function normalizeLoginSlug(value) {
  if (typeof value !== "string") {
    return "";
  }

  var text = value.trim().toLowerCase();

  text = text.replace(/[^a-z0-9]+/g, "-");
  text = text.replace(/^-+/, "");
  text = text.replace(/-+$/, "");

  return text;
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

function readAdminName() {
  if (state.admin && state.admin.name) {
    return state.admin.name;
  }

  return "Super Admin";
}

function isAdminRole(role) {
  var normalizedRole = normalizeAdminRole(role);

  return normalizedRole === "superAdmin"
    || normalizedRole === "platformAdmin";
}

function normalizeAdminRole(role) {
  var normalizedRole = readSafeString(role).replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalizedRole === "superadmin" || normalizedRole === "rolesuperadmin") {
    return "superAdmin";
  }

  if (normalizedRole === "platformadmin" || normalizedRole === "roleplatformadmin") {
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

function buildAvatar(student) {
  if (student.photoUrl) {
    return '<img class="sa-avatar" src="' + escapeHtml(student.photoUrl) + '" alt="">';
  }

  return '<div class="sa-avatar sa-avatar-fallback">👤</div>';
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

function readSafeString(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

window.goSuperAdmin = function () {
  state.activeTab = "overview";
  render();
};
