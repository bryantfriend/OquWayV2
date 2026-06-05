import { db, doc, getDoc } from "../../firebase/index.js";
import { normalizeClass } from "./index.js";

export async function getClassById(classId) {
  if (!classId) {
    return null;
  }

  var classSnap = await getDoc(doc(db, "classes", classId));

  if (!classSnap.exists()) {
    return null;
  }

  return normalizeClass(Object.assign({ id: classSnap.id }, classSnap.data() || {}));
}
