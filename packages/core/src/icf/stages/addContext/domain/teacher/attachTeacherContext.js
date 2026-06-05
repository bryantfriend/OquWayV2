import { collection, db, doc, getDoc, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.60-teacher-login-readtext";

export async function attachTeacherProfileContext(executionState) {
  var actor = executionState.actor || {};

  if (!actor.id) {
    return {
      valid: true,
      data: {
        teacherProfile: null,
        teacherClassIds: [],
        teacherLocationIds: []
      }
    };
  }

  try {
    var lookup = await loadTeacherProfileByAuthUid(actor.id);
    var profile = lookup.profile;

    return {
      valid: true,
      data: {
        teacherProfile: profile,
        authUid: actor.id,
        profileUserId: profile && profile.profileUserId ? profile.profileUserId : "",
        teacherOwnershipIds: readTeacherOwnershipIds(profile, actor.id),
        teacherClassIds: readTeacherClassIds(profile),
        teacherLocationIds: readTeacherLocationIds(profile)
      }
    };
  } catch (error) {
    console.warn("[teacher-dashboard:add-context-failed]", {
      teacherId: actor.id || "",
      attemptedProfilePath: actor.id ? "users/" + actor.id : "",
      attemptedAuthUidQuery: actor.id ? "users where authUid == " + actor.id : "",
      errorMessage: readErrorMessage(error)
    });

    return {
      valid: true,
      data: {
        teacherProfile: null,
        authUid: actor.id || "",
        profileUserId: "",
        teacherOwnershipIds: actor.id ? [actor.id] : [],
        teacherClassIds: [],
        teacherLocationIds: []
      }
    };
  }
}

async function loadTeacherProfileByAuthUid(authUid) {
  var directProfileFound = false;
  var authUidQueryFound = false;
  var directProfile = null;
  var profile = null;

  if (!authUid) {
    return { profile: null };
  }

  var directSnap = await getDoc(doc(db, "users", authUid));

  if (directSnap.exists()) {
    directProfileFound = true;
    directProfile = normalizeTeacherProfileDocument(directSnap, authUid);
  }

  console.info("[teacher-profile:direct]", {
    authUid: authUid,
    path: "users/" + authUid,
    found: directProfileFound,
    profileUserId: directProfile && directProfile.profileUserId ? directProfile.profileUserId : "",
    roles: readProfileRoles(directProfile)
  });

  if (directProfile && readProfileRoles(directProfile).length > 0) {
    profile = directProfile;
  } else {
    var authUidSnapshot = await getDocs(query(collection(db, "users"), where("authUid", "==", authUid)));

    authUidSnapshot.forEach(function (profileSnap) {
      if (!profile) {
        authUidQueryFound = true;
        profile = normalizeTeacherProfileDocument(profileSnap, authUid);
      }
    });
  }

  profile = await attachLinkedTeacherProfile(profile, authUid);

  console.info("[teacher-profile:lookup]", {
    authUid: authUid,
    triedDirectProfile: true,
    directProfileFound: directProfileFound,
    authUidQueryFound: authUidQueryFound,
    profileUserId: profile && profile.profileUserId ? profile.profileUserId : "",
    role: profile && profile.role ? profile.role : "",
    roles: readProfileRoles(profile)
  });

  return {
    profile: profile
  };
}

async function attachLinkedTeacherProfile(profile, authUid) {
  var profileUserId = profile && profile.profileUserId ? profile.profileUserId : "";
  var linkedFound = false;
  var linkedProfile = null;

  if (profileUserId && profileUserId !== authUid) {
    var linkedSnap = await getDoc(doc(db, "users", profileUserId));

    if (linkedSnap.exists()) {
      linkedFound = true;
      linkedProfile = normalizeTeacherProfileDocument(linkedSnap, authUid);
      profile = Object.assign({}, linkedProfile, profile, {
        id: profile.id,
        authUid: authUid,
        profileUserId: profileUserId,
        linkedProfile: linkedProfile
      });
    }
  }

  console.info("[teacher-profile:linked]", {
    authUid: authUid,
    profileUserId: profileUserId,
    found: linkedFound,
    roles: readProfileRoles(profile)
  });

  return profile;
}

function normalizeTeacherProfileDocument(profileSnap, authUid) {
  var data = profileSnap.data() || {};
  var profileAuthUid = readText(data.authUid) || authUid;

  return Object.assign({
    id: profileSnap.id,
    profileUserId: profileSnap.id,
    authUid: profileAuthUid
  }, data, {
    id: profileSnap.id,
    profileUserId: profileSnap.id,
    authUid: profileAuthUid
  });
}

function readProfileRoles(profile) {
  var roles = [];

  addRole(roles, profile && profile.role ? profile.role : "");
  addRoleList(roles, profile && Array.isArray(profile.roles) ? profile.roles : []);

  if (profile && profile.ROLE_TEACHER === true) addRole(roles, "ROLE_TEACHER");
  if (profile && profile.ROLE_SCHOOL_ADMIN === true) addRole(roles, "ROLE_SCHOOL_ADMIN");
  if (profile && profile.ROLE_PLATFORM_ADMIN === true) addRole(roles, "ROLE_PLATFORM_ADMIN");
  if (profile && profile.ROLE_SUPER_ADMIN === true) addRole(roles, "ROLE_SUPER_ADMIN");

  return roles;
}

function addRoleList(roles, values) {
  var index = 0;

  while (index < values.length) {
    addRole(roles, values[index]);
    index = index + 1;
  }
}

function addRole(roles, role) {
  var normalized = normalizeRole(role);

  if (normalized && roles.indexOf(normalized) === -1) {
    roles.push(normalized);
  }
}

function normalizeRole(role) {
  var normalized = readText(role).replace(/^ROLE_/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

  if (normalized === "teacher") return "teacher";
  if (normalized === "schooladmin") return "schoolAdmin";
  if (normalized === "platformadmin") return "platformAdmin";
  if (normalized === "superadmin") return "superAdmin";
  if (normalized === "coursecreator") return "courseCreator";
  if (normalized === "admin") return "admin";
  if (normalized === "student") return "student";
  if (normalized === "parent") return "parent";
  return normalized;
}

export async function attachExternalTaskSubmissionReviewContext(executionState) {
  var payload = executionState.payload || {};

  if (!payload.submissionId) {
    return {
      valid: true,
      data: {
        externalTaskSubmission: null
      }
    };
  }

  try {
    var submissionSnap = await getDoc(doc(db, "externalTaskSubmissions", payload.submissionId));

    return {
      valid: true,
      data: {
        externalTaskSubmission: submissionSnap.exists()
          ? Object.assign({ id: submissionSnap.id }, submissionSnap.data() || {})
          : null
      }
    };
  } catch (error) {
    console.warn("[teacher-review:add-context-failed]", {
      submissionId: payload.submissionId,
      attemptedPath: "externalTaskSubmissions/" + payload.submissionId,
      errorMessage: readErrorMessage(error)
    });

    return {
      valid: false,
      errors: [
        {
          code: "EXTERNAL_TASK_SUBMISSION_CONTEXT_FAILED",
          message: "Could not load the submission before review."
        }
      ]
    };
  }
}

export function readTeacherClassIds(profile) {
  var ids = [];

  addText(ids, profile ? profile.classId : "");
  addTextList(ids, profile ? profile.classIds : null);
  addTextList(ids, profile ? profile.assignedClassIds : null);
  addRecordList(ids, profile ? profile.assignedClasses : null, "class");
  addRecordList(ids, profile ? profile.classes : null, "class");
  addRecordList(ids, profile ? profile.classRefs : null, "class");

  return ids;
}

export function readTeacherLocationIds(profile) {
  var ids = [];

  addText(ids, profile ? profile.locationId : "");
  addText(ids, profile ? profile.primaryLocationId : "");
  addText(ids, profile ? profile.schoolId : "");
  addText(ids, profile ? profile.locId : "");
  addTextList(ids, profile ? profile.locationIds : null);
  addTextList(ids, profile ? profile.schoolIds : null);
  addRecordList(ids, profile ? profile.locations : null, "location");
  addRecordList(ids, profile ? profile.schools : null, "location");

  return ids;
}

function readTeacherOwnershipIds(profile, authUid) {
  var ids = [];

  addText(ids, authUid || "");
  addText(ids, profile ? profile.id : "");
  addText(ids, profile ? profile.profileUserId : "");
  addText(ids, profile ? profile.authUid : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.id : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.profileUserId : "");
  addText(ids, profile && profile.linkedProfile ? profile.linkedProfile.authUid : "");

  return ids;
}

function addRecordList(ids, values, targetType) {
  var safeValues = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < safeValues.length) {
    addText(ids, readRecordId(safeValues[index], targetType));
    index = index + 1;
  }
}

function readRecordId(value, targetType) {
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? value : "";
  }

  if (targetType === "class") {
    return readText(value.id || value.classId || value.refId || value.uid);
  }

  return readText(value.id || value.locationId || value.schoolId || value.refId || value.uid);
}

function addTextList(ids, values) {
  var safeValues = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < safeValues.length) {
    addText(ids, safeValues[index]);
    index = index + 1;
  }
}

function addText(ids, value) {
  var text = readText(value);

  if (text && ids.indexOf(text) === -1) {
    ids.push(text);
  }
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}


