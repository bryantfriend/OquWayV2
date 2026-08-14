import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../packages/firebase/auth/index.js?v=1.1.86-site-cache-refresh";
import { runIntentPipeline } from "../../../packages/core/src/icf/engine/runIntentPipeline.js?v=1.1.231-platform-performance-release";
import { getStudentLoginIntentDefinition } from "./studentLoginIntents.js?v=1.1.231-platform-performance-release";
import { markStudentPortalJourney, startStudentPortalJourney } from "../../../packages/shared/performance/studentPortalMetrics.js?v=1.1.231-platform-performance-release";

var appElement = document.getElementById("app");
var startupMessage = consumeStartupMessage();
var state = {
  locations: [],
  classes: [],
  students: [],
  selectedLocationId: "",
  directLocationSlug: "",
  directLocationLocked: false,
  selectedClassId: "",
  selectedStudentId: "",
  selectedLoginMethod: "fruit",
  fruitEntry: [],
  isLoading: true,
  isLoadingStudents: false,
  isBusy: false,
  message: startupMessage,
  messageType: startupMessage ? "error" : "info"
};

var fruits = ["apple", "watermelon", "banana", "strawberry", "pineapple", "mango", "kiwi", "orange", "cherry"];
var startupOptionsLoading = false;
var PUBLIC_CACHE_TTL_MS = 10 * 60 * 1000;
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

startStudentPortalJourney();

if (appElement) {
  appElement.addEventListener("click", handleClick);
  appElement.addEventListener("change", handleChange);
  appElement.addEventListener("submit", handleSubmit);
}

onAuthStateChanged(auth, function (user) {
  if (user) {
    if (user.isAnonymous) {
      setState({
        message: state.message || "Please choose your class card and enter your fruit password.",
        messageType: state.messageType || "info"
      });
      loadStartupLoginOptions();
      return;
    }

    if (!state.isBusy && !hasConfirmedStudentSession(user.uid)) {
      signOut(auth).then(function () {
        loadStartupLoginOptions();
      });
      return;
    }

    verifyCurrentStudent();
    return;
  }

  loadStartupLoginOptions();
});

function setState(changes) {
  state = Object.assign({}, state, changes);
  render();
}

function render() {
  if (!appElement) {
    return;
  }

  appElement.innerHTML = buildView();
}

function buildView() {
  var selectedLocation = readSelectedLocation();
  var loginMode = readLoginMode(selectedLocation ? selectedLocation.loginMode : "fruit");
  var hasDirectLocation = state.directLocationLocked && selectedLocation;
  var html = "";

  html += '<section class="login-hero">';
  if (hasDirectLocation) {
    html += '<div><h1>Welcome to ' + escapeHtml(readLocationName(selectedLocation)) + '</h1><p>Choose your class, pick your name card, and sign in with the method your teacher prepared.</p></div>';
  } else {
    html += '<div><h1>OquWay Login</h1><p>Choose your school location, then sign in with the method your teacher prepared.</p></div>';
  }
  html += '<div class="login-card"><strong>Mode:</strong> ' + escapeHtml(loginMode) + '</div>';
  html += '</section>';

  if (state.message) {
    html += '<div class="' + readMessageClass() + '">' + escapeHtml(state.message) + '</div>';
  }

  html += '<section class="login-card login-grid">';
  html += '<aside class="login-panel">';
  html += '<h2>' + (hasDirectLocation ? "Your Location" : "1. Location") + '</h2>';
  if (hasDirectLocation) {
    html += buildDirectLocationCard(selectedLocation);
  } else {
    html += buildLocationCards();
  }
  html += buildModeTabs(loginMode);
  html += '</aside>';
  html += '<section class="login-panel">';

  if (state.isLoading) {
    html += '<div class="login-empty">Loading login options...</div>';
  } else if (state.locations.length === 0) {
    html += '<div class="login-empty">No active locations found yet.</div>';
  } else if (!state.selectedLocationId) {
    html += '<div class="login-empty">Choose your location to begin.</div>';
  } else if (state.selectedLoginMethod === "standard") {
    html += buildStandardLogin();
  } else {
    html += buildFruitLogin();
  }

  html += '</section>';
  html += '</section>';
  return html;
}

function buildLocationCards() {
  var html = '<div class="location-list">';
  var locationIndex = 0;

  while (locationIndex < state.locations.length) {
    var location = state.locations[locationIndex];
    var activeClass = state.selectedLocationId === location.id ? " location-card-active" : "";
    html += '<button type="button" class="location-card' + activeClass + '" data-location-id="' + escapeHtml(location.id) + '">';
    html += escapeHtml(readLocationName(location));
    html += '</button>';
    locationIndex = locationIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildDirectLocationCard(location) {
  var loginPath = location.loginPath || "";

  if (!loginPath && location.loginSlug) {
    loginPath = "/l/" + location.loginSlug;
  }

  return '<div class="location-direct-card"><strong>' + escapeHtml(readLocationName(location)) + '</strong><span>' + escapeHtml(loginPath) + '</span></div>';
}

function buildModeTabs(loginMode) {
  var html = '<div class="login-mode-tabs">';

  if (loginMode === "hybrid") {
    html += buildModeButton("fruit", "Fruit Login");
    html += buildModeButton("standard", "Standard Login");
  } else if (loginMode === "standard") {
    html += buildModeButton("standard", "Standard Login");
  } else {
    html += buildModeButton("fruit", "Fruit Login");
  }

  html += '</div>';
  return html;
}

function buildModeButton(method, label) {
  var activeClass = state.selectedLoginMethod === method ? " login-mode-tab-active" : "";
  return '<button type="button" class="login-mode-tab' + activeClass + '" data-login-method="' + method + '">' + label + '</button>';
}

function buildFruitLogin() {
  var html = "";

  html += '<h2>Fruit Login</h2>';
  html += '<p>Pick your class, choose your picture, then enter your four fruits.</p>';
  html += '<h3>2. Class</h3>';
  html += buildClassList();
  html += '<h3>3. Student</h3>';
  html += buildStudentList();
  html += '<h3>4. Fruit Password</h3>';
  html += buildFruitEntry();
  html += buildFruitButtons();
  html += '<div class="login-small-row">';
  html += '<button type="button" class="login-small-btn" data-fruit-action="backspace">Backspace</button>';
  html += '<button type="button" class="login-small-btn" data-fruit-action="clear">Clear</button>';
  html += '</div>';
  html += '<button type="button" class="login-primary-btn" data-action="fruit-login"' + disabled(!canSubmitFruitLogin()) + '>Login</button>';

  return html;
}

function buildClassList() {
  var html = '<div class="class-list">';
  var classIndex = 0;

  if (state.classes.length === 0) {
    return '<div class="login-empty">No classes found for this location.</div>';
  }

  while (classIndex < state.classes.length) {
    var classItem = state.classes[classIndex];
    var activeClass = state.selectedClassId === classItem.id ? " class-btn-active" : "";
    html += '<button type="button" class="class-btn' + activeClass + '" data-class-id="' + escapeHtml(classItem.id) + '">';
    html += escapeHtml(readClassName(classItem));
    html += '</button>';
    classIndex = classIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildStudentList() {
  var html = '<div class="student-list">';
  var studentIndex = 0;

  if (!state.selectedClassId) {
    return '<div class="login-empty">Choose a class to see students.</div>';
  }

  if (state.isLoadingStudents) {
    return '<div class="login-empty">Loading students...</div>';
  }

  if (state.students.length === 0) {
    return '<div class="login-empty">No active students found in this class.</div>';
  }

  while (studentIndex < state.students.length) {
    var student = state.students[studentIndex];
    var activeClass = state.selectedStudentId === student.id ? " student-card-active" : "";
    html += '<button type="button" class="student-card' + activeClass + '" data-student-id="' + escapeHtml(student.id) + '">';
    html += buildStudentPhoto(student);
    html += '<strong>' + escapeHtml(readStudentName(student)) + '</strong>';
    html += '</button>';
    studentIndex = studentIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildStudentPhoto(student) {
  if (student.photoUrl) {
    return '<img src="' + escapeHtml(student.photoUrl) + '" alt="">';
  }

  return '<div class="default-avatar">👤</div>';
}

function buildFruitEntry() {
  var html = '<div class="fruit-entry">';
  var index = 0;

  while (index < 4) {
    html += '<div class="fruit-slot">' + escapeHtml(readFruitLabel(state.fruitEntry[index])) + '</div>';
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function buildFruitButtons() {
  var html = '<div class="fruit-grid">';
  var fruitIndex = 0;

  while (fruitIndex < fruits.length) {
    var fruit = fruits[fruitIndex];
    html += '<button type="button" class="fruit-btn" data-fruit="' + fruit + '">' + readFruitLabel(fruit) + '</button>';
    fruitIndex = fruitIndex + 1;
  }

  html += '</div>';
  return html;
}

function buildStandardLogin() {
  return '<h2>Standard Login</h2>'
    + '<p>Use your student email and password.</p>'
    + '<form id="standardLoginForm">'
    + '<input class="login-input" id="standardIdentifier" type="text" placeholder="Email">'
    + '<input class="login-input" id="standardPassword" type="password" placeholder="Password">'
    + '<button class="login-primary-btn" type="submit"' + disabled(state.isBusy) + '>Login</button>'
    + '</form>';
}

function handleClick(event) {
  var modeButton = event.target.closest("[data-login-method]");
  var locationButton = event.target.closest("[data-location-id]");
  var classButton = event.target.closest("[data-class-id]");
  var studentButton = event.target.closest("[data-student-id]");
  var fruitButton = event.target.closest("[data-fruit]");
  var fruitActionButton = event.target.closest("[data-fruit-action]");
  var loginButton = event.target.closest('[data-action="fruit-login"]');

  if (modeButton) {
    selectLoginMethod(modeButton.getAttribute("data-login-method"));
    return;
  }

  if (locationButton) {
    selectLocation(locationButton.getAttribute("data-location-id"));
    return;
  }

  if (classButton) {
    selectClass(classButton.getAttribute("data-class-id"));
    return;
  }

  if (studentButton) {
    setState({ selectedStudentId: studentButton.getAttribute("data-student-id"), message: "" });
    return;
  }

  if (fruitButton) {
    addFruit(fruitButton.getAttribute("data-fruit"));
    return;
  }

  if (fruitActionButton) {
    handleFruitAction(fruitActionButton.getAttribute("data-fruit-action"));
    return;
  }

  if (loginButton) {
    submitFruitLogin();
  }
}

function handleChange(event) {
  if (event.target && event.target.id === "locationSelect") {
    selectLocation(event.target.value);
  }
}

function handleSubmit(event) {
  if (event.target && event.target.id === "standardLoginForm") {
    event.preventDefault();
    submitStandardLogin();
  }
}

function selectLoginMethod(method) {
  setState({
    selectedLoginMethod: method,
    message: ""
  });
}

function selectLocation(locationId) {
  var location = findLocation(locationId);
  var loginMode = readLoginMode(location ? location.loginMode : "fruit");
  var method = loginMode === "standard" ? "standard" : "fruit";

  if (loginMode === "hybrid") {
    method = "fruit";
  }

  setState({
    selectedLocationId: locationId,
    selectedClassId: "",
    selectedStudentId: "",
    selectedLoginMethod: method,
    fruitEntry: [],
    classes: [],
    students: [],
    isLoadingStudents: false,
    message: ""
  });

  if (locationId) {
    loadClasses(locationId);
  }
}

function selectClass(classId) {
  var classItem = findClass(classId);

  setState({
    selectedClassId: classId,
    selectedStudentId: "",
    fruitEntry: [],
    students: [],
    isLoadingStudents: Boolean(classId),
    message: ""
  });

  if (classId) {
    loadStudents(state.selectedLocationId, classId, readClassName(classItem));
  }
}

function addFruit(fruit) {
  var nextEntry = state.fruitEntry.slice();

  if (nextEntry.length >= 4) {
    return;
  }

  nextEntry.push(fruit);
  setState({
    fruitEntry: nextEntry,
    message: ""
  });
}

function handleFruitAction(action) {
  var nextEntry = state.fruitEntry.slice();

  if (action === "clear") {
    nextEntry = [];
  }

  if (action === "backspace") {
    nextEntry.pop();
  }

  setState({
    fruitEntry: nextEntry,
    message: ""
  });
}

async function loadLocations() {
  var cachedLocations = readPublicPortalCache("locations");

  if (cachedLocations && Array.isArray(cachedLocations.locations)) {
    setState({
      locations: cachedLocations.locations,
      isLoading: false,
      message: state.message
    });
    markStudentPortalJourney("schools-visible");
    refreshLocations(true);
    return;
  }

  await refreshLocations(false);
}

async function refreshLocations(silent) {
  var result = await runLoginIntent("LoadLocationsIntent", {}, "guest-student");

  if (result && result.emitted && result.emitted.success) {
    var locations = result.emitted.data.locations || [];
    writePublicPortalCache("locations", { locations: locations });
    setState({
      locations: locations,
      isLoading: false,
      message: state.message
    });
    markStudentPortalJourney("schools-visible");
    return;
  }

  if (!silent) setState({
    locations: [],
    isLoading: false,
    message: readIntentErrorMessage(result),
    messageType: "error"
  });
}

async function loadStartupLoginOptions() {
  if (startupOptionsLoading) {
    return;
  }

  startupOptionsLoading = true;
  var loginSlug = readLocationSlugFromUrl();

  try {
    if (loginSlug) {
      await resolveLocationBySlug(loginSlug);
      return;
    }

    await loadLocations();
  } finally {
    startupOptionsLoading = false;
  }
}

async function resolveLocationBySlug(loginSlug, forceRefresh) {
  var cachedLocation = !forceRefresh ? readPublicPortalCache("location:" + loginSlug) : null;

  if (cachedLocation && cachedLocation.location) {
    applyResolvedLocation(loginSlug, cachedLocation.location);
    await loadClasses(cachedLocation.location.id);
    resolveLocationBySlug(loginSlug, true);
    return;
  }

  if (!forceRefresh) {
  setState({
    isLoading: true,
    directLocationSlug: loginSlug,
    directLocationLocked: false,
    message: state.message || "Loading your school login link...",
    messageType: "info"
  });
  }

  var result = await runLoginIntent("ResolveLocationBySlugIntent", {
    loginSlug: loginSlug
  }, "guest-student");

  if (result && result.emitted && result.emitted.success) {
    var location = result.emitted.data.location;
    writePublicPortalCache("location:" + loginSlug, { location: location });
    applyResolvedLocation(loginSlug, location);

    await loadClasses(location.id);
    return;
  }

  if (forceRefresh && state.directLocationLocked) {
    return;
  }

  setState({
    directLocationSlug: loginSlug,
    directLocationLocked: false,
    selectedLocationId: "",
    message: readIntentErrorMessage(result) + " You can choose another location below.",
    messageType: "error"
  });

  await loadLocations();
}

function applyResolvedLocation(loginSlug, location) {
  var loginMode = readLoginMode(location.loginMode);
  var method = loginMode === "standard" ? "standard" : "fruit";

  if (loginMode === "hybrid") method = "fruit";

  setState({
    locations: [location],
    selectedLocationId: location.id,
    selectedClassId: "",
    selectedStudentId: "",
    selectedLoginMethod: method,
    directLocationSlug: loginSlug,
    directLocationLocked: true,
    fruitEntry: [],
    classes: [],
    students: [],
    isLoading: false,
    message: "",
    messageType: "info"
  });
}

async function loadClasses(locationId) {
  var cachedClasses = readPublicPortalCache("classes:" + locationId);

  if (cachedClasses && Array.isArray(cachedClasses.classes)) {
    setState({ classes: cachedClasses.classes, students: [], isBusy: false, message: "" });
    markStudentPortalJourney("classes-visible");
    refreshClasses(locationId, true);
    return;
  }

  await refreshClasses(locationId, false);
}

async function refreshClasses(locationId, silent) {
  if (!silent) {
    setState({ isBusy: true, message: "Loading classes...", messageType: "info" });
  }
  var result = await runLoginIntent("LoadClassesForLocationIntent", { locationId: locationId }, "guest-student");

  if (result && result.emitted && result.emitted.success) {
    var classes = result.emitted.data.classes || [];
    writePublicPortalCache("classes:" + locationId, { classes: classes });
    if (state.selectedLocationId !== locationId) return;
    setState({
      classes: classes,
      students: [],
      isBusy: false,
      message: ""
    });
    markStudentPortalJourney("classes-visible");
    return;
  }

  if (!silent && state.selectedLocationId === locationId) setState({
    classes: [],
    students: [],
    isBusy: false,
    message: readIntentErrorMessage(result),
    messageType: "error"
  });
}

async function loadStudents(locationId, classId, className) {
  var cacheKey = "students:" + locationId + ":" + classId;
  var cachedStudents = readPublicPortalCache(cacheKey);

  if (cachedStudents && Array.isArray(cachedStudents.students)) {
    setState({ students: cachedStudents.students, isBusy: false, isLoadingStudents: false, message: "" });
    markStudentPortalJourney("students-visible");
    refreshStudents(locationId, classId, className, cacheKey, true);
    return;
  }

  await refreshStudents(locationId, classId, className, cacheKey, false);
}

async function refreshStudents(locationId, classId, className, cacheKey, silent) {
  if (!silent) {
    setState({ isBusy: true, isLoadingStudents: true, message: "Loading students...", messageType: "info" });
  }
  var result = await runLoginIntent("LoadStudentsForClassIntent", {
    locationId: locationId,
    classId: classId,
    className: className
  }, "guest-student");

  if (result && result.emitted && result.emitted.success) {
    var students = result.emitted.data.students || [];
    writePublicPortalCache(cacheKey, { students: students });
    if (state.selectedClassId !== classId || state.selectedLocationId !== locationId) return;
    setState({
      students: students,
      isBusy: false,
      isLoadingStudents: false,
      message: ""
    });
    markStudentPortalJourney("students-visible");
    return;
  }

  if (!silent && state.selectedClassId === classId && state.selectedLocationId === locationId) setState({
    students: [],
    isBusy: false,
    isLoadingStudents: false,
    message: readIntentErrorMessage(result),
    messageType: "error"
  });
}

function readPublicPortalCache(key) {
  if (!window.sessionStorage) return null;

  try {
    var entry = JSON.parse(window.sessionStorage.getItem("oquwayPublic:" + key) || "null");
    if (!entry || Date.now() - entry.savedAt > PUBLIC_CACHE_TTL_MS) return null;
    return entry.value || null;
  } catch (error) {
    return null;
  }
}

function writePublicPortalCache(key, value) {
  if (!window.sessionStorage) return;

  try {
    window.sessionStorage.setItem("oquwayPublic:" + key, JSON.stringify({ savedAt: Date.now(), value: value }));
  } catch (error) {
    return;
  }
}

function registerStudentPortalServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("../../student-portal-sw.js", { scope: "../../" }).catch(function () {
      return null;
    });
  });
}

registerStudentPortalServiceWorker();

async function submitFruitLogin() {
  if (!canSubmitFruitLogin()) {
    return;
  }

  setState({ isBusy: true, message: "Checking your fruits...", messageType: "info" });

  var result = await runLoginIntent("StudentFruitLoginIntent", {
    locationId: state.selectedLocationId,
    classId: state.selectedClassId,
    className: readClassName(findClass(state.selectedClassId)),
    studentId: state.selectedStudentId,
    fruits: state.fruitEntry
  }, "guest-student");

  if (result && result.emitted && result.emitted.success) {
    await routeToStudentDashboardAfterSessionStart(readIntentStudent(result));
    return;
  }

  setState({
    isBusy: false,
    fruitEntry: [],
    message: readIntentErrorMessage(result),
    messageType: "error"
  });
}

async function submitStandardLogin() {
  var identifierInput = document.getElementById("standardIdentifier");
  var passwordInput = document.getElementById("standardPassword");

  setState({ isBusy: true, message: "Signing in...", messageType: "info" });

  var result = await runLoginIntent("StudentStandardLoginIntent", {
    locationId: state.selectedLocationId,
    identifier: identifierInput ? identifierInput.value : "",
    password: passwordInput ? passwordInput.value : ""
  }, "guest-student");

  if (result && result.emitted && result.emitted.success) {
    await routeToStudentDashboardAfterSessionStart(readIntentStudent(result));
    return;
  }

  setState({
    isBusy: false,
    message: readIntentErrorMessage(result),
    messageType: "error"
  });
}

async function verifyCurrentStudent() {
  var result = await runLoginIntent("LoadStudentProfileIntent", {}, auth.currentUser.uid);

  if (result && result.emitted && result.emitted.success) {
    await routeToStudentDashboardAfterSessionStart(readIntentStudent(result));
    return;
  }

  await signOut(auth);
  loadStartupLoginOptions();
}

async function startStudentSession() {
  if (!auth.currentUser || !auth.currentUser.uid) {
    return {
      success: false,
      message: "Student authentication was not ready yet."
    };
  }

  var result = await runLoginIntent("StartStudentSessionIntent", {}, auth.currentUser.uid);

  if (result && result.emitted && result.emitted.success) {
    return {
      success: true
    };
  }

  setState({
    isBusy: false,
    message: readIntentErrorMessage(result),
    messageType: "error"
  });

  return {
    success: false,
    message: readIntentErrorMessage(result)
  };
}

async function routeToStudentDashboardAfterSessionStart(studentProfile) {
  var sessionResult = await startStudentSession();

  if (sessionResult.success) {
    markStudentSessionStarted();
    storeStudentBootstrapProfile(studentProfile);
    markStudentPortalJourney("authentication-complete");
    window.location.href = "../student-dashboard/index.html";
  }
}

function readIntentStudent(result) {
  var data = result && result.emitted && result.emitted.data ? result.emitted.data : null;
  return data && data.student && typeof data.student === "object" ? data.student : null;
}

function storeStudentBootstrapProfile(studentProfile) {
  if (!window.sessionStorage || !auth.currentUser || !studentProfile) {
    return;
  }

  window.sessionStorage.setItem("oquwayStudentBootstrapProfile", JSON.stringify({
    uid: auth.currentUser.uid,
    savedAt: Date.now(),
    profile: studentProfile
  }));
}

function markStudentSessionStarted() {
  if (!window.sessionStorage || !auth.currentUser || !auth.currentUser.uid) {
    return;
  }

  window.sessionStorage.setItem("oquwayStudentSessionUid", auth.currentUser.uid);
  window.sessionStorage.setItem("oquwayStudentSessionStartedAt", String(Date.now()));
}

function hasConfirmedStudentSession(uid) {
  if (!window.sessionStorage || !uid) {
    return false;
  }

  return window.sessionStorage.getItem("oquwayStudentSessionUid") === uid;
}

async function runLoginIntent(intentType, payload, actorId) {
  return runIntentPipeline(getStudentLoginIntentDefinition(intentType), {
    payload: payload,
    actor: {
      id: actorId,
      role: "ROLE_STUDENT"
    },
    meta: {
      createdAt: Date.now(),
      source: "student-login"
    }
  });
}

function canSubmitFruitLogin() {
  return state.selectedLocationId
    && state.selectedClassId
    && state.selectedStudentId
    && state.fruitEntry.length === 4
    && !state.isBusy;
}

function readSelectedLocation() {
  return findLocation(state.selectedLocationId);
}

function readLocationSlugFromUrl() {
  var slugFromSearch = readLocationSlugFromSearch(window.location.search);

  if (slugFromSearch) {
    return slugFromSearch;
  }

  return readLocationSlugFromPath(window.location.pathname);
}

function readLocationSlugFromSearch(search) {
  var query = new URLSearchParams(search);
  var value = query.get("location") || query.get("l") || "";

  return normalizeLoginSlug(value);
}

function readLocationSlugFromPath(pathname) {
  var parts = pathname.split("/");
  var index = 0;

  while (index < parts.length) {
    if (isLocationSlugRouteSegment(parts[index]) && parts[index + 1]) {
      return normalizeLoginSlug(parts[index + 1]);
    }

    index = index + 1;
  }

  return "";
}

function isLocationSlugRouteSegment(value) {
  return value === "l" || value === "login" || value === "location";
}

function normalizeLoginSlug(value) {
  if (typeof value !== "string") {
    return "";
  }

  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch (error) {
    return value.trim().toLowerCase();
  }
}

function findLocation(locationId) {
  var locationIndex = 0;

  while (locationIndex < state.locations.length) {
    if (state.locations[locationIndex].id === locationId) {
      return state.locations[locationIndex];
    }

    locationIndex = locationIndex + 1;
  }

  return null;
}

function findClass(classId) {
  var classIndex = 0;

  while (classIndex < state.classes.length) {
    if (state.classes[classIndex].id === classId) {
      return state.classes[classIndex];
    }

    classIndex = classIndex + 1;
  }

  return null;
}

function readLoginMode(value) {
  if (value === "standard" || value === "hybrid") {
    return value;
  }

  return "fruit";
}

function readLocationName(location) {
  if (location && typeof location.name === "string" && location.name.length > 0) {
    return location.name;
  }

  return location && location.id ? location.id : "Location";
}

function readClassName(classItem) {
  if (classItem && typeof classItem.name === "string" && classItem.name.length > 0) {
    return classItem.name;
  }

  if (classItem && typeof classItem.title === "string" && classItem.title.length > 0) {
    return classItem.title;
  }

  return classItem && classItem.id ? classItem.id : "Class";
}

function readStudentName(student) {
  if (student && typeof student.name === "string" && student.name.length > 0) {
    return student.name;
  }

  if (student && typeof student.displayName === "string" && student.displayName.length > 0) {
    return student.displayName;
  }

  return "Student";
}

function readFruitLabel(fruit) {
  if (fruit && fruitLabels[fruit]) {
    return fruitLabels[fruit];
  }

  return "";
}

function readMessageClass() {
  if (state.messageType === "error") {
    return "login-message login-message-error";
  }

  return "login-message";
}

function selected(value, expectedValue) {
  return value === expectedValue ? " selected" : "";
}

function disabled(value) {
  return value ? " disabled" : "";
}

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    if (result.emitted.errors[0].message) {
      return result.emitted.errors[0].message;
    }
  }

  return "Something went wrong. Please try again.";
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

function consumeStartupMessage() {
  if (!window.sessionStorage) {
    return "";
  }

  var message = window.sessionStorage.getItem("oquwayStudentLoginMessage") || "";
  window.sessionStorage.removeItem("oquwayStudentLoginMessage");
  return message;
}
