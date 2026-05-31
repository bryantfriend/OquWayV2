import { functions, httpsCallable } from "../../../../../infrastructure/firebase/functions.js";

export async function callStudentLoginFunction(payload) {
  return callCallableFunction("studentLogin", payload);
}

export async function callGetStudentsForClassFunction(payload) {
  return callCallableFunction("studentLogin", Object.assign({ action: "listStudents" }, payload));
}

async function callCallableFunction(functionName, payload) {
  var callable = httpsCallable(functions, "studentLogin");

  var response = await callable(payload);

  if (!response || !response.data) {
    throw new Error(functionName + " returned an empty response.");
  }

  if (response.data.success === false) {
    throw new Error(response.data.message || functionName + " request failed.");
  }

  return response.data;
}

export function sanitizeProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  return {
    id: readText(profile.id),
    name: readText(profile.name),
    displayName: readText(profile.displayName),
    photoUrl: readText(profile.photoUrl),
    classId: readText(profile.classId),
    locationId: readText(profile.locationId),
    role: readText(profile.role),
    status: readText(profile.status),
    email: readText(profile.email),
    username: readText(profile.username)
  };
}

export function isActiveStudentStatus(status) {
  if (!status) {
    return true;
  }

  return status === "active" || status === "approved";
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}
