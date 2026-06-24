import { collection, db, doc, getDoc, getDocs, serverTimestamp, setDoc } from "../../firebase/index.js";
import { normalizeModule } from "./index.js";

export async function getModuleById(courseId, moduleId, options) {
  var sources = options && Array.isArray(options.sources) ? options.sources : ["catalogCourses", "courses"];
  var includeStandaloneLegacy = options && options.includeStandaloneLegacy === true;
  var sourceIndex = 0;

  if (!courseId || !moduleId) {
    return null;
  }

  while (sourceIndex < sources.length) {
    var moduleRecord = await readModuleFromSource(courseId, moduleId, sources[sourceIndex]);

    if (moduleRecord) {
      return moduleRecord;
    }

    sourceIndex = sourceIndex + 1;
  }

  if (includeStandaloneLegacy) {
    return readStandaloneLegacyModule(moduleId);
  }

  return null;
}

export async function getModulesForCourse(courseId, options) {
  var sources = options && Array.isArray(options.sources) ? options.sources : ["catalogCourses", "courses"];
  var course = options && options.course ? options.course : {};
  var sourceIndex = 0;

  if (!courseId) {
    return [];
  }

  while (sourceIndex < sources.length) {
    var modules = await readModulesFromSource(courseId, sources[sourceIndex]);

    if (modules.length > 0 || sources[sourceIndex] === sources[sources.length - 1]) {
      sortModulesByCourseOrder(modules, Array.isArray(course.moduleOrder) ? course.moduleOrder : []);
      return modules;
    }

    sourceIndex = sourceIndex + 1;
  }

  return [];
}

export async function getModuleSourceCheck(courseId, options) {
  var course = options && options.course ? options.course : await readCourseContext(courseId);
  var catalogModules = await readModulesFromSource(courseId, "catalogCourses");
  var legacyModules = await readModulesFromSource(courseId, "courses");
  var moduleOrder = Array.isArray(course.moduleOrder) ? course.moduleOrder : [];
  var embeddedModules = Array.isArray(course.modules) ? course.modules : [];

  return {
    catalogModulesCount: catalogModules.length,
    legacyCoursesModulesCount: legacyModules.length,
    catalogModules: catalogModules,
    legacyModules: legacyModules,
    moduleOrder: moduleOrder,
    embeddedModulesCount: embeddedModules.length,
    courseContext: {
      collectionName: "catalogCourses",
      course: course || {}
    }
  };
}

export async function createModule(courseId, moduleData) {
  var safeModule = normalizeModule(moduleData || {});
  var moduleId = safeModule.id;

  if (!courseId || !moduleId) {
    throw new Error("Course id and module id are required.");
  }

  await setDoc(doc(db, "catalogCourses", courseId, "modules", moduleId), Object.assign({}, moduleData || {}, {
    id: moduleId,
    updatedAt: serverTimestamp(),
    createdAt: moduleData && moduleData.createdAt ? moduleData.createdAt : serverTimestamp()
  }), { merge: true });

  return getModuleById(courseId, moduleId, { sources: ["catalogCourses"] });
}

export async function updateModule(courseId, moduleId, updates) {
  if (!courseId || !moduleId) {
    throw new Error("Course id and module id are required.");
  }

  await setDoc(doc(db, "catalogCourses", courseId, "modules", moduleId), Object.assign({}, updates || {}, {
    updatedAt: serverTimestamp()
  }), { merge: true });

  return getModuleById(courseId, moduleId, { sources: ["catalogCourses"] });
}

async function readModuleFromSource(courseId, moduleId, source) {
  var moduleSnap = await getDoc(doc(db, source, courseId, "modules", moduleId));

  if (!moduleSnap.exists()) {
    return null;
  }

  return normalizeModuleDocument(Object.assign({ id: moduleSnap.id }, moduleSnap.data() || {}), source);
}

async function readStandaloneLegacyModule(moduleId) {
  var moduleSnap = await getDoc(doc(db, "modules", moduleId));

  if (!moduleSnap.exists()) {
    return null;
  }

  return normalizeModuleDocument(Object.assign({ id: moduleSnap.id }, moduleSnap.data() || {}), "modules");
}

async function readCourseContext(courseId) {
  var catalogSnap = await getDoc(doc(db, "catalogCourses", courseId));

  if (catalogSnap.exists()) {
    return Object.assign({ id: catalogSnap.id }, catalogSnap.data() || {});
  }

  var legacySnap = await getDoc(doc(db, "courses", courseId));

  if (legacySnap.exists()) {
    return Object.assign({ id: legacySnap.id }, legacySnap.data() || {});
  }

  return {};
}

async function readModulesFromSource(courseId, source) {
  var snapshot = await getDocs(collection(db, source, courseId, "modules"));
  var modules = [];

  snapshot.forEach(function (moduleSnap) {
    modules.push(normalizeModuleDocument(Object.assign({ id: moduleSnap.id }, moduleSnap.data() || {}), source));
  });

  return modules;
}

function normalizeModuleDocument(moduleRecord, source) {
  var normalized = normalizeModule(moduleRecord);
  var mergedModule = Object.assign({}, moduleRecord, {
    id: normalized.id || moduleRecord.id || moduleRecord.moduleId || "",
    status: normalized.status,
    source: source
  });

  if (!mergedModule.moduleId && mergedModule.id) {
    mergedModule.moduleId = mergedModule.id;
  }

  return mergedModule;
}
function sortModulesByCourseOrder(modules, moduleOrder) {
  var order = Array.isArray(moduleOrder) ? moduleOrder : [];
  var orderIndexById = {};

  order.forEach(function (moduleId, index) {
    orderIndexById[moduleId] = index;
  });

  modules.sort(function (firstModule, secondModule) {
    var firstId = firstModule.id || firstModule.moduleId;
    var secondId = secondModule.id || secondModule.moduleId;
    var firstHasOrder = Object.prototype.hasOwnProperty.call(orderIndexById, firstId);
    var secondHasOrder = Object.prototype.hasOwnProperty.call(orderIndexById, secondId);

    if (firstHasOrder && secondHasOrder) {
      return orderIndexById[firstId] - orderIndexById[secondId];
    }

    if (firstHasOrder) {
      return -1;
    }

    if (secondHasOrder) {
      return 1;
    }

    return readOrder(firstModule) - readOrder(secondModule);
  });
}

function readOrder(moduleRecord) {
  return moduleRecord && typeof moduleRecord.order === "number" ? moduleRecord.order : 0;
}
