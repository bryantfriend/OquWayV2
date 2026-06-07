import { collection, db, doc, getDoc, getDocs, query, where } from "../../firebase/index.js";
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

  if (classSnap.exists()) {
    return normalizeClass(Object.assign({
      id: classSnap.id,
      locationId: locationId
    }, classSnap.data() || {}));
  }

  return getClassByLocationAlias(classId, locationId);
}

async function getClassByLocationAlias(classId, locationId) {
  var aliasFields = ["classId", "name", "code", "classCode", "title", "displayName"];
  var fieldIndex = 0;

  while (fieldIndex < aliasFields.length) {
    var classRecord = await getFirstClassByField(
      collection(db, "locations", locationId, "classes"),
      aliasFields[fieldIndex],
      classId,
      locationId
    );

    if (classRecord) {
      return classRecord;
    }

    fieldIndex = fieldIndex + 1;
  }

  return null;
}

async function getFirstClassByField(classesRef, fieldName, value, locationId) {
  var snapshot = await getDocs(query(classesRef, where(fieldName, "==", value)));
  var classRecord = null;

  snapshot.forEach(function (classSnap) {
    if (!classRecord) {
      classRecord = normalizeClass(Object.assign({
        id: classSnap.id,
        locationId: locationId
      }, classSnap.data() || {}));
    }
  });

  return classRecord;
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
