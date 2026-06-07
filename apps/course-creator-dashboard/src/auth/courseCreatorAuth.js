import {
    getActorClaimRoles,
    getUserProfileByAuthUid,
    getUserRoles,
    normalizeUserRole
} from "../../../../packages/domain/users/index.js?v=1.1.118-fruit-login-student-identity";
import { canAccessCourseCreator } from "../../../../packages/permissions/index.js?v=1.1.118-fruit-login-student-identity";

export const ALLOWED_COURSE_CREATOR_ROLES = [
    "superAdmin",
    "platformAdmin",
    "schoolAdmin",
    "courseCreator",
    "assistant"
];

export async function verifyCourseCreatorAccess(user, options) {
    const safeOptions = options || {};
    const claimsResult = await readAuthClaims(user);
    const profileResult = await readUserProfile(user);
    const claimsRoles = getActorClaimRoles({ claims: claimsResult.claims });
    const profileRoles = getUserRoles(profileResult.profile);
    const normalizedRoles = mergeRoles(profileRoles, claimsRoles);
    const allowed = canAccessCourseCreator(createAuthorizationProfile(profileResult.profile, claimsRoles));
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

export function normalizeRoles(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map(normalizeRole).filter(Boolean);
}

export function normalizeRole(value) {
    return normalizeUserRole(value);
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
        const lookup = await getUserProfileByAuthUid(user.uid);
        const profile = lookup && lookup.profile ? lookup.profile : {};

        return {
            profile: profile,
            exists: Boolean(profile && profile.id),
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

function mergeRoles() {
    const merged = [];

    Array.prototype.slice.call(arguments).forEach(function (roles) {
        roles.forEach(function (role) {
            const normalizedRole = normalizeRole(role);

            if (normalizedRole && merged.indexOf(normalizedRole) === -1) {
                merged.push(normalizedRole);
            }
        });
    });

    return merged;
}

function createAuthorizationProfile(profile, claimsRoles) {
    const profileRoles = getUserRoles(profile);
    const roles = mergeRoles(profileRoles, claimsRoles);

    return Object.assign({}, profile || {}, {
        roles: roles,
        role: roles.length > 0 ? roles[0] : ""
    });
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
