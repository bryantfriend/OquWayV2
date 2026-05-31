var routeHandlers = {};

export function registerRoute(name, handler) {
  routeHandlers[name] = handler;
}

export function navigate(routeName, payload) {
  if (typeof routeHandlers[routeName] !== "function") {
    return false;
  }

  routeHandlers[routeName](payload || {});
  return true;
}

export function readRegisteredRoutes() {
  return Object.keys(routeHandlers);
}
