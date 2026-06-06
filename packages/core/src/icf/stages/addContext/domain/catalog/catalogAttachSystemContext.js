export function catalogAttachSystemContext(executionState) {
    const { metadata } = executionState;
    const actorRole = readActorRoleFromMetadata(metadata);

    executionState.context = {
        actorRole: actorRole,
        systemTimestamp: Date.now(),
        platformFlags: {}
    };

    return { valid: true };
}

function readActorRoleFromMetadata(metadata) {
    if (metadata && metadata.actorRole) {
        return metadata.actorRole;
    }

    return "ROLE_COURSE_CREATOR";
}

