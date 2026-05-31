import { normalizeIdList, readSafeString, splitCommaList } from "../../shared/helpers.js";
import { normalizeRoles } from "../../shared/permissions.js";

export function normalizeUserPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      userId: readSafeString(payload.userId || payload.id).trim(),
      displayName: readSafeString(payload.displayName || payload.name).trim(),
      email: readSafeString(payload.email).trim(),
      phone: readSafeString(payload.phone).trim(),
      photoUrl: readSafeString(payload.photoUrl).trim(),
      roles: normalizeRoles(payload.roles, payload.role),
      locationIds: normalizeIdList(payload.locationIds || payload.locationId),
      primaryLocationId: readSafeString(payload.primaryLocationId || payload.locationId).trim(),
      status: readSafeString(payload.status || "active"),
      classId: readSafeString(payload.classId).trim(),
      childStudentIds: splitCommaList(payload.childStudentIds || payload.childStudentIdsText),
      classIds: splitCommaList(payload.classIds || payload.classIdsText)
    }
  };
}

export function normalizeUserId(executionState) {
  return {
    valid: true,
    data: {
      userId: readSafeString(executionState.payload.userId || executionState.payload.id).trim()
    }
  };
}
