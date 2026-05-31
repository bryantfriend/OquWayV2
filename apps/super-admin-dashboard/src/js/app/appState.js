export function createAppState() {
  return {
    currentUser: null,
    currentLocation: "",
    selectedRoleFilter: "",
    selectedClass: "",
    selectedSchool: "",
    cachedUsers: [],
    legacyDashboardLoaded: false
  };
}

export var appState = createAppState();

export function updateAppState(changes) {
  Object.assign(appState, changes || {});
  return appState;
}
