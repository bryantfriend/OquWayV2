import { hasAnyRole } from "./roleAuthorization.js?v=1.1.81-class-command-center";

export function authorizeDemoActor(executionState) {
  if (!executionState.actor || !executionState.actor.id) {
    return {
      ok: false,
      errors: [{ code: "UNAUTHORIZED", message: "Actor role is required." }]
    };
  }

  if (!hasAnyRole(executionState.actor, ["admin", "superAdmin", "courseCreator", "assistant"])) {
    return {
      ok: false,
      errors: [{ code: "UNAUTHORIZED", message: "Actor role not permitted." }]
    };
  }

  return {
    ok: true,
    data: {
      authorizeMarker: "Authorize"
    }
  };
}
