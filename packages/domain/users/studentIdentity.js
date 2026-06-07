export function resolveFruitLoginStudentIdentity(authUser, tokenClaims, studentProfile) {
  var claims = tokenClaims || {};
  var profile = studentProfile || {};
  var authUid = readText(authUser && authUser.uid);
  var tokenStudentId = readText(claims.studentId);
  var profileId = readStudentProfileId(profile);
  var resolvedStudentId = tokenStudentId || profileId || authUid;

  return {
    authUid: authUid,
    tokenStudentId: tokenStudentId,
    resolvedStudentId: resolvedStudentId,
    profileId: profileId,
    classId: readText(claims.classId) || readText(profile.classId),
    className: readText(claims.className) || readText(profile.className),
    locationId: readText(claims.locationId) || readText(profile.locationId || profile.primaryLocationId)
  };
}

export function resolveActorStudentIdentity(actor, studentProfile, payload) {
  var safeActor = actor || {};
  var claims = safeActor.tokenClaims || safeActor.claims || {};
  var profile = studentProfile || safeActor.studentProfile || {};
  var tokenStudentId = readText(safeActor.tokenStudentId) || readText(claims.studentId);
  var profileId = readStudentProfileId(profile);
  var actorStudentId = readText(safeActor.studentId);
  var payloadStudentId = readText(payload && payload.studentId);
  var authUid = readText(safeActor.authUid || safeActor.uid || safeActor.authUserId || safeActor.sessionUid);
  var actorId = readText(safeActor.id);
  var resolvedStudentId = tokenStudentId || profileId || actorStudentId || payloadStudentId || actorId || authUid;

  return {
    authUid: authUid || (actorId !== resolvedStudentId ? actorId : ""),
    tokenStudentId: tokenStudentId,
    resolvedStudentId: resolvedStudentId,
    profileId: profileId,
    classId: readText(safeActor.classId || claims.classId || profile.classId),
    className: readText(safeActor.className || claims.className || profile.className),
    locationId: readText(safeActor.locationId || claims.locationId || profile.locationId || profile.primaryLocationId)
  };
}

export function resolveActorStudentId(actor, studentProfile, payload) {
  return resolveActorStudentIdentity(actor, studentProfile, payload).resolvedStudentId;
}

export function readStudentProfileId(studentProfile) {
  var profile = studentProfile || {};

  return readText(profile.id)
    || readText(profile.studentId)
    || readText(profile.profileUserId)
    || readText(profile.userId)
    || readText(profile.uid)
    || readText(profile.authUid);
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
