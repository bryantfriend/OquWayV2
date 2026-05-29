export function authorizeDemoActor(executionState) {
  if (!executionState.actor || !executionState.actor.role) {
    return {
      ok: false,
      errors: [{ code: "UNAUTHORIZED", message: "Actor role is required." }]
    };
  }

  const role = executionState.actor.role;

  if (role !== "ROLE_ADMIN" && role !== "ROLE_SUPER_ADMIN" && role !== "ROLE_COURSE_CREATOR") {
    return {
      ok: false,
      errors: [{ code: "UNAUTHORIZED", message: "Actor role not permitted: " + role }]
    };
  }

  return {
    ok: true,
    data: {
      authorizeMarker: "Authorize"
    }
  };
}
