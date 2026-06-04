export function attachTenantContext(executionState) {
    if (executionState.actor && executionState.actor.tenantId) {
        return { valid: true, data: { tenantId: executionState.actor.tenantId } };
    } else {
        return { valid: true, data: { tenantId: "global" } };
    }
}

export function attachMinistryScopeContext(executionState) {
    // In actual implementation, we'd lookup permissions to verify.
    // Defaulting to general scope based on actor properties.
    if (executionState.actor && executionState.actor.ministryScope) {
        return { valid: true, data: { ministryScope: executionState.actor.ministryScope } };
    } else {
        return { valid: true, data: { ministryScope: "global" } };
    }
}

