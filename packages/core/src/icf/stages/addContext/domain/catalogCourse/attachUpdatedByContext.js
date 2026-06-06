export function attachTimestampContext(executionState) {
    return { valid: true, data: { systemTimestamp: Date.now() } };
}

export function attachUpdatedByContext(executionState) {
    if (executionState.actor && executionState.actor.id) {
        return {
            valid: true,
            data: {
                updatedBy: executionState.actor.id,
                updatedByName: executionState.actor.name || "Unknown Author"
            }
        };
    } else {
        return {
            valid: true,
            data: {
                updatedBy: "SYSTEM",
                updatedByName: "SYSTEM"
            }
        };
    }
}

