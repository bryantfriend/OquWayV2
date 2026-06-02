import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.29-module-render-fix";

export function requireCourseCreatorAuthorization(executionState) {
    // If SuperAdmin, they can bypass course creator restriction usually,
    // but we will enforce strictly ROLE_COURSE_CREATOR per guidelines,
    // or we check array inclusion if actor has multiple roles.

    if (!executionState.actor) {
        return { valid: false, errors: [{ message: "Unauthorized: Actor required" }] };
    }

    var role = normalizeCourseAdminRole(executionState.actor.role);

    if (role === "superAdmin"
        || role === "platformAdmin"
        || role === "admin"
        || role === "schoolAdmin"
        || role === "courseCreator"
        || role === "editor") {
        return { valid: true };
    }

    return { valid: false, errors: [{ message: "Unauthorized: Must be a Course Creator" }] };
}

function normalizeCourseAdminRole(role) {
    var normalizedRole = typeof role === "string" ? role.replace(/[^a-z0-9]/gi, "").toLowerCase() : "";

    if (normalizedRole === "rolesuperadmin" || normalizedRole === "superadmin") {
        return "superAdmin";
    }

    if (normalizedRole === "roleplatformadmin" || normalizedRole === "platformadmin") {
        return "platformAdmin";
    }

    if (normalizedRole === "roleadmin" || normalizedRole === "admin") {
        return "admin";
    }

    if (normalizedRole === "roleschooladmin" || normalizedRole === "schooladmin") {
        return "schoolAdmin";
    }

    if (normalizedRole === "rolecoursecreator" || normalizedRole === "coursecreator") {
        return "courseCreator";
    }

    if (normalizedRole === "editor") {
        return "editor";
    }

    return "";
}
