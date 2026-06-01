import { db, doc, getDoc } from "../../../../packages/core/src/infrastructure/firebase/firestore.js";

export const ALLOWED_COURSE_CREATOR_ROLES = [
    "superAdmin",
    "platformAdmin",
    "schoolAdmin",
    "courseCreator"
];

export async function verifyCourseCreatorAccess(user, options) {
    const safeOptions = options || {};
    const claimsResult = await readAuthClaims(user);
    const profileResult = await readUserProfile(user);
    const claimsRoles = collectRoles(claimsResult.claims);
    const profileRoles = collectRoles(profileResult.profile);
    const normalizedRoles = mergeRoles(profileRoles, claimsRoles);
    const allowed = hasAnyRole(profileResult.profile, claimsResult.claims, ALLOWED_COURSE_CREATOR_ROLES);
    const reason = readAuthorizationReason(allowed, normalizedRoles, claimsResult.error, profileResult.error);

    logCourseCreatorAuth("auth uid", {
        uid: user && user.uid ? user.uid : "",
        source: safeOptions.source || ""
    });
    logCourseCreatorAuth("claims", {
        normalizedRoles: claimsRoles
    });
    logCourseCreatorAuth("profile role data", {
        normalizedRolesFromProfile: profileRoles,
        profileExists: profileResult.exists,
        profileReadError: profileResult.errorCode
    });
    logCourseCreatorAuth("authorization result", {
        allowed: allowed,
        reason: reason
    });

    if (!allowed) {
        warnUnauthorized(user, normalizedRoles, reason);
    }

    return {
        allowed: allowed,
        role: normalizedRoles[0] || "",
        normalizedRoles: normalizedRoles,
        reason: reason,
        profileReadError: profileResult.errorCode,
        claimsReadError: claimsResult.errorCode
    };
}

export function hasAnyRole(userProfile, claims, allowedRoles) {
    const roles = mergeRoles(collectRoles(userProfile), collectRoles(claims));
    const normalizedAllowedRoles = normalizeRoles(allowedRoles);

    return roles.some(function (role) {
        return normalizedAllowedRoles.indexOf(role) !== -1;
    });
}

export function normalizeRoles(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map(normalizeRole).filter(Boolean);
}

export function normalizeRole(value) {
    if (typeof value !== "string") {
        return "";
    }

    const normalized = value.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

    if (normalized === "superadmin") return "superAdmin";
    if (normalized === "platformadmin") return "platformAdmin";
    if (normalized === "schooladmin") return "schoolAdmin";
    if (normalized === "coursecreator") return "courseCreator";
    if (normalized === "admin") return "admin";
    if (normalized === "student") return "student";

    return normalized;
}

function collectRoles(source) {
    const roles = [];

    if (!source || typeof source !== "object") {
        return roles;
    }

    addRole(roles, source.role);
    addRole(roles, source.userRole);
    addRole(roles, source.primaryRole);
    addRoles(roles, source.roles);
    addRoles(roles, source.userRoles);

    Object.keys(source).forEach(function (key) {
        if (source[key] === true) {
            addRole(roles, key);
        }
    });

    return roles;
}

async function readAuthClaims(user) {
    try {
        const tokenResult = await user.getIdTokenResult();

        return {
            claims: tokenResult && tokenResult.claims ? tokenResult.claims : {},
            error: null,
            errorCode: ""
        };
    } catch (error) {
        return {
            claims: {},
            error: error,
            errorCode: error && error.code ? error.code : "claims-read-failed"
        };
    }
}

async function readUserProfile(user) {
    try {
        const profileSnap = await getDoc(doc(db, "users", user.uid));

        return {
            profile: profileSnap.exists() ? profileSnap.data() : {},
            exists: profileSnap.exists(),
            error: null,
            errorCode: ""
        };
    } catch (error) {
        return {
            profile: {},
            exists: false,
            error: error,
            errorCode: error && error.code ? error.code : "profile-read-failed"
        };
    }
}

function addRoles(target, values) {
    if (!Array.isArray(values)) {
        return;
    }

    values.forEach(function (value) {
        addRole(target, value);
    });
}

function addRole(target, value) {
    const role = normalizeRole(value);

    if (role && target.indexOf(role) === -1) {
        target.push(role);
    }
}

function mergeRoles() {
    const merged = [];

    Array.prototype.slice.call(arguments).forEach(function (roles) {
        roles.forEach(function (role) {
            addRole(merged, role);
        });
    });

    return merged;
}

function readAuthorizationReason(allowed, normalizedRoles, claimsError, profileError) {
    if (allowed) {
        return "allowed";
    }

    if (normalizedRoles.length === 0 && claimsError) {
        return "claims-read-failed";
    }

    if (normalizedRoles.length === 0 && profileError) {
        return "profile-read-failed";
    }

    if (normalizedRoles.length === 0) {
        return "role-missing";
    }

    return "role-unsupported";
}

function warnUnauthorized(user, normalizedRoles, reason) {
    if (!isDevHost()) {
        return;
    }

    console.warn("[course-creator-auth] unauthorized", {
        uid: user && user.uid ? user.uid : "",
        normalizedRoles: normalizedRoles,
        allowedRoles: ALLOWED_COURSE_CREATOR_ROLES,
        reason: reason
    });
}

function logCourseCreatorAuth(eventName, payload) {
    if (!isDevHost()) {
        return;
    }

    console.info("[course-creator-auth] " + eventName, payload);
}

function isDevHost() {
    return typeof window !== "undefined"
        && window.location
        && (window.location.hostname === "localhost"
            || window.location.hostname === "127.0.0.1"
            || window.location.hostname === "");
}
