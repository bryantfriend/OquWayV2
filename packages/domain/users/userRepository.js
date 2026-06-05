import { collection, db, doc, getDoc, getDocs, query, where } from "../../firebase/index.js";
import { getUserRoles } from "./roleService.js";

export async function getUserProfile(userId, options) {
  var authUid = options && options.authUid ? options.authUid : userId;

  if (!userId) {
    return null;
  }

  var profileSnap = await getDoc(doc(db, "users", userId));

  if (!profileSnap.exists()) {
    return null;
  }

  return normalizeUserProfileDocument(profileSnap, authUid);
}

export async function getStudentProfile(studentId) {
  return getUserProfile(studentId, { authUid: studentId });
}

export async function getStudentProfileByAuthUid(authUid) {
  var lookup = await getUserProfileByAuthUid(authUid);
  return lookup.profile;
}

export async function getUserProfileByAuthUid(authUid) {
  var directProfileFound = false;
  var authUidQueryFound = false;
  var directProfile = null;
  var profile = null;

  if (!authUid) {
    return {
      profile: null,
      directProfileFound: false,
      authUidQueryFound: false
    };
  }

  directProfile = await getUserProfile(authUid, { authUid: authUid });

  if (directProfile) {
    directProfileFound = true;
  }

  if (directProfile && getUserRoles(directProfile).length > 0) {
    profile = directProfile;
  } else {
    var authUidSnapshot = await getDocs(query(collection(db, "users"), where("authUid", "==", authUid)));

    authUidSnapshot.forEach(function (profileSnap) {
      if (!profile) {
        authUidQueryFound = true;
        profile = normalizeUserProfileDocument(profileSnap, authUid);
      }
    });
  }

  profile = await attachLinkedUserProfile(profile, authUid);

  return {
    profile: profile,
    directProfile: directProfile,
    directProfileFound: directProfileFound,
    authUidQueryFound: authUidQueryFound
  };
}

export async function attachLinkedUserProfile(profile, authUid) {
  var profileUserId = profile && profile.profileUserId ? profile.profileUserId : "";
  var linkedProfile = null;

  if (profileUserId && profileUserId !== authUid) {
    linkedProfile = await getUserProfile(profileUserId, { authUid: authUid });

    if (linkedProfile) {
      profile = Object.assign({}, linkedProfile, profile, {
        id: profile.id,
        authUid: authUid,
        profileUserId: profileUserId,
        linkedProfile: linkedProfile
      });
    }
  }

  return profile;
}

export function normalizeUserProfileDocument(profileSnap, authUid) {
  var data = profileSnap.data() || {};
  var profileAuthUid = readText(data.authUid) || authUid;

  return Object.assign({
    id: profileSnap.id,
    profileUserId: profileSnap.id,
    authUid: profileAuthUid
  }, data, {
    id: profileSnap.id,
    profileUserId: data.profileUserId || profileSnap.id,
    authUid: profileAuthUid
  });
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
