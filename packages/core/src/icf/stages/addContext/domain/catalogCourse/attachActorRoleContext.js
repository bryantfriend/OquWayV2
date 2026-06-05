import { readActorRoles, readPrimaryRole } from "../../../authorize/core/roleAuthorization.js?v=1.1.63-external-task-student-feedback";

export function attachActorContext(executionState) {
    if (executionState.actor && executionState.actor.id) {
        return { valid: true, data: { actorId: executionState.actor.id } };
    } else {
        return { valid: true, data: { actorId: "SYSTEM" } };
    }
}

export function attachActorRoleContext(executionState) {
    if (executionState.actor) {
        return {
            valid: true,
            data: {
                actorRole: readPrimaryRole(executionState.actor, "GUEST") || "GUEST",
                actorRoles: readActorRoles(executionState.actor)
            }
        };
    } else {
        return { valid: true, data: { actorRole: "GUEST", actorRoles: [] } };
    }
}

