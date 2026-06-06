import { collection, db, getDocs, query, where } from "../../../../../packages/firebase/index.js?v=1.1.79-user-command-center";

export async function loadClasses() {
  return [];
}

export async function getTeacherClasses(teacherId) {
  var safeTeacherId = typeof teacherId === "string" ? teacherId.trim() : "";
  var classes = [];

  if (!safeTeacherId) {
    return classes;
  }

  await appendClassQuery(classes, query(collection(db, "classes"), where("primaryTeacherId", "==", safeTeacherId)));
  await appendClassQuery(classes, query(collection(db, "classes"), where("assistantIds", "array-contains", safeTeacherId)));

  return classes.sort(function (a, b) {
    return String(a.name || a.id || "").localeCompare(String(b.name || b.id || ""));
  });
}

async function appendClassQuery(classes, classQuery) {
  var snapshot = await getDocs(classQuery);

  snapshot.forEach(function (classSnap) {
    if (!classes.some(function (classRecord) { return classRecord.id === classSnap.id; })) {
      classes.push(Object.assign({ id: classSnap.id }, classSnap.data() || {}));
    }
  });
}
