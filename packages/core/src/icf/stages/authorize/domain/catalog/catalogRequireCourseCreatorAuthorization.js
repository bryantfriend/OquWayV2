export function catalogRequireCourseCreatorAuthorization(executionState) {
    const { context } = executionState;

    const allowedRoles = [
        'superAdmin',
        'platformAdmin',
        'courseCreator',
        'assistant'
    ];

    const actorRoles = context.actorRoles || [context.actorRole];

    if (!actorRoles.some(function (role) { return allowedRoles.indexOf(role) !== -1; })) {
        throw new Error(`Authorization failed: actorRole ${context.actorRole} is not permitted to modify global catalog courses.`);
    }

    executionState.authorization = {
        decision: 'allow',
        safeScope: { global: true },
        constraints: {}
    };

    return { valid: true };
}
