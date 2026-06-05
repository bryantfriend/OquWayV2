import { readSafeString } from "../../shared/utils/index.js";

export function normalizeLocation(location) {
  var safeLocation = location || {};

  return Object.assign({}, safeLocation, {
    id: readSafeString(safeLocation.id || safeLocation.locationId),
    name: readSafeString(safeLocation.name || safeLocation.displayName || safeLocation.schoolName).trim() || "Untitled Location",
    status: readSafeString(safeLocation.status || "active") || "active"
  });
}
