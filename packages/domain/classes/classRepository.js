import { db, doc, getDoc } from "../../firebase/index.js";
import { normalizeClass } from "./index.js";

export async function getClassById(classId, options) {
  if (!classId) {
    return null;
  }

  var locationIds = readLocationIds(options);
  var locationIndex = 0;

  while (locationIndex < locationIds.length) {
    var locationClass = await getClassByLocationId(classId, locationIds[locationIndex]);

    if (locationClass) {
      return locationClass;
    }

    locationIndex = locationIndex + 1;
  }

  var classSnap = await getDoc(doc(db, "classes", classId));

  if (!classSnap.exists()) {
    return null;
  }

  return normalizeClass(Object.assign({ id: classSnap.id }, classSnap.data() || {}));
}

async function getClassByLocationId(classId, locationId) {
  if (!classId || !locationId) {
    return null;
  }

  var classSnap = await getDoc(doc(db, "locations", locationId, "classes", classId));

  if (!classSnap.exists()) {
    return null;
  }

  return normalizeClass(Object.assign({
    id: classSnap.id,
    locationId: locationId
  }, classSnap.data() || {}));
}

function readLocationIds(options) {
  var ids = [];

  addUniqueText(ids, options && options.locationId);
  addTextList(ids, options && options.locationIds);

  return ids;
}

function addTextList(ids, values) {
  var source = Array.isArray(values) ? values : [];
  var index = 0;

  while (index < source.length) {
    addUniqueText(ids, source[index]);
    index = index + 1;
  }
}

function addUniqueText(ids, value) {
  var text = typeof value === "string" ? value.trim() : "";

  if (text && ids.indexOf(text) === -1) {
    ids.push(text);
  }
}
