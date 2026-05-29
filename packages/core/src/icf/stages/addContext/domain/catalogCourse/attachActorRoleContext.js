export function attachActorContext(executionState) {
    if (executionState.actor && executionState.actor.id) {
        return { valid: true, data: { actorId: executionState.actor.id } };
    } else {
        return { valid: true, data: { actorId: "SYSTEM" } };
    }
}

export function attachActorRoleContext(executionState) {
    if (executionState.actor && executionState.actor.role) {
        return { valid: true, data: { actorRole: executionState.actor.role } };
    } else {
        return { valid: true, data: { actorRole: "GUEST" } };
    }
}

