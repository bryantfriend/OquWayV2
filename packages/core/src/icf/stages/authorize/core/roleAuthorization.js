export function normalizeRole(role) {
  var normalized = typeof role === "string"
    ? role.replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase()
    : "";

  if (normalized === "student") return "student";
  if (normalized === "teacher") return "teacher";
  if (normalized === "parent") return "parent";
  if (normalized === "assistant") return "assistant";
  if (normalized === "editor") return "editor";
  if (normalized === "admin") return "admin";
  if (normalized === "schooladmin") return "schoolAdmin";
  if (normalized === "regionaladmin") return "regionalAdmin";
  if (normalized === "ministryuser" || normalized === "ministry") return "ministryUser";
  if (normalized === "platformadmin") return "platformAdmin";
  if (normalized === "superadmin") return "superAdmin";
  if (normalized === "coursecreator") return "courseCreator";
  if (normalized === "accountant") return "accountant";
  if (normalized === "authenticated" || normalized === "guest") return "";

  return normalized;
}

export function readActorRoles(actor) {
  var source = [];
  var roles = [];

  if (!actor || typeof actor !== "object") {
    return roles;
  }

  addValue(source, actor.role);
  addValue(source, actor.userRole);
  addValue(source, actor.primaryRole);
  addValues(source, actor.roles);
  addValues(source, actor.userRoles);
  addClaimRoles(source, actor.claims);

  Object.keys(actor).forEach(function (key) {
    if (actor[key] === true) {
      addValue(source, key);
    }
  });

  source.forEach(function (role) {
    var normalizedRole = normalizeRole(role);

    if (normalizedRole && roles.indexOf(normalizedRole) === -1) {
      roles.push(normalizedRole);
    }
  });

  return roles;
}

export function hasAnyRole(actor, allowedRoles) {
  var roles = readActorRoles(actor);
  var allowed = normalizeAllowedRoles(allowedRoles);

  return roles.some(function (role) {
    return allowed.indexOf(role) !== -1;
  });
}

export function readPrimaryRole(actor, fallbackRole) {
  var roles = readActorRoles(actor);

  return roles[0] || normalizeRole(fallbackRole) || "";
}

function addClaimRoles(source, claims) {
  if (!claims || typeof claims !== "object") {
    return;
  }

  addValue(source, claims.role);
  addValue(source, claims.userRole);
  addValue(source, claims.primaryRole);
  addValues(source, claims.roles);
  addValues(source, claims.userRoles);

  Object.keys(claims).forEach(function (key) {
    if (claims[key] === true) {
      addValue(source, key);
    }
  });
}

function normalizeAllowedRoles(allowedRoles) {
  var roles = [];

  addValues(roles, allowedRoles);

  return roles.map(normalizeRole).filter(function (role, index, list) {
    return role && list.indexOf(role) === index;
  });
}

function addValues(source, values) {
  if (!Array.isArray(values)) {
    return;
  }

  values.forEach(function (value) {
    addValue(source, value);
  });
}

function addValue(source, value) {
  if (typeof value === "string" && value) {
    source.push(value);
  }
}
