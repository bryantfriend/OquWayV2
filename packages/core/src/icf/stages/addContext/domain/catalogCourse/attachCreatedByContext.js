export function attachTimestampContext(executionState) {
    return { valid: true, data: { systemTimestamp: Date.now() } };
}

export function attachCreatedByContext(executionState) {
    if (executionState.actor && executionState.actor.id) {
        return {
            valid: true,
            data: {
                createdBy: executionState.actor.id,
                createdByName: executionState.actor.name || "Unknown Author"
            }
        };
    } else {
        return {
            valid: true,
            data: {
                createdBy: "SYSTEM",
                createdByName: "SYSTEM"
            }
        };
    }
}

