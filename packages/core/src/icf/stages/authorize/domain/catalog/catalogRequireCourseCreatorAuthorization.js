export function catalogRequireCourseCreatorAuthorization(executionState) {
    const { context } = executionState;

    const allowedRoles = [
        'ROLE_SUPER_ADMIN',
        'ROLE_PLATFORM_ADMIN',
        'ROLE_COURSE_CREATOR'
    ];

    if (!allowedRoles.includes(context.actorRole)) {
        throw new Error(`Authorization failed: actorRole ${context.actorRole} is not permitted to modify global catalog courses.`);
    }

    executionState.authorization = {
        decision: 'allow',
        safeScope: { global: true },
        constraints: {}
    };

    return { valid: true };
}
