import { collection, db, getDocs, query, where } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.108-student-class-alias-merge";

export async function processLoadClassesForLocation(executionState) {
  var payload = executionState.payload;

  try {
    var classes = await loadClassesForLocation(payload.locationId);

    executionState.result = {
      classes: classes
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "LOGIN_CLASSES_LOAD_FAILED",
          message: error.message
        }
      ]
    };
  }
}

async function loadClassesForLocation(locationId) {
  var classes = [];

  try {
    var nestedSnapshot = await getDocs(collection(db, "locations", locationId, "classes"));

    nestedSnapshot.forEach(function (classSnap) {
      var classData = normalizeClassRecord(classSnap.id, classSnap.data());

      if (shouldIncludeClass(classData)) {
        classes.push(classData);
      }
    });
  } catch (error) {
    classes = [];
  }

  if (classes.length === 0) {
    var topLevelQuery = query(collection(db, "classes"), where("locationId", "==", locationId));
    var topLevelSnapshot = await getDocs(topLevelQuery);

    topLevelSnapshot.forEach(function (classSnap) {
      var classData = normalizeClassRecord(classSnap.id, classSnap.data());

      if (shouldIncludeClass(classData)) {
        classes.push(classData);
      }
    });
  }

  classes.sort(compareClasses);
  return classes;
}

function normalizeClassRecord(classId, data) {
  var classData = Object.assign({ id: classId }, data || {});

  if (!classData.status) {
    classData.status = "active";
  }

  return classData;
}

function shouldIncludeClass(classData) {
  return !classData.status || classData.status === "active" || classData.status === "approved";
}

function compareClasses(a, b) {
  return readClassName(a).localeCompare(readClassName(b));
}

function readClassName(classData) {
  if (!classData) {
    return "";
  }

  if (typeof classData.name === "string") {
    return classData.name;
  }

  if (typeof classData.title === "string") {
    return classData.title;
  }

  return classData.id || "";
}
