import { createRequire } from "node:module";

const require = createRequire(new URL("../functions/package.json", import.meta.url));
const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID || "oquway-c1160";
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
const storageHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST || "127.0.0.1:9199";
const testUid = process.env.COURSE_CREATOR_TEST_UID || "course_creator_test";
const testEmail = process.env.COURSE_CREATOR_TEST_EMAIL || "course.creator.test@oquway.local";
const testPassword = process.env.COURSE_CREATOR_TEST_PASSWORD || "CourseCreatorTest123!";

process.env.GCLOUD_PROJECT = projectId;
process.env.FIREBASE_CONFIG = JSON.stringify({ projectId });
process.env.FIREBASE_AUTH_EMULATOR_HOST = authHost;
process.env.FIRESTORE_EMULATOR_HOST = firestoreHost;
process.env.FIREBASE_STORAGE_EMULATOR_HOST = storageHost;

const app = admin.apps.length > 0 ? admin.app() : admin.initializeApp({
  projectId,
  storageBucket: projectId + ".firebasestorage.app"
});

const auth = admin.auth(app);
const db = admin.firestore(app);
const FieldValue = admin.firestore.FieldValue;

await seedCourseCreatorUser();
await seedCourseCreatorTargets();

console.log("Seeded Course Creator emulator account");
console.log("Email: " + testEmail);
console.log("Password: " + testPassword);
console.log("URL: http://127.0.0.1:4173/apps/course-creator-dashboard/login.html?useFirebaseEmulator=1");

async function seedCourseCreatorUser() {
  var userRecord = null;

  try {
    userRecord = await auth.getUser(testUid);
    await auth.updateUser(testUid, {
      email: testEmail,
      password: testPassword,
      emailVerified: true,
      displayName: "Course Creator Test"
    });
  } catch (error) {
    userRecord = await auth.createUser({
      uid: testUid,
      email: testEmail,
      password: testPassword,
      emailVerified: true,
      displayName: "Course Creator Test"
    });
  }

  await auth.setCustomUserClaims(userRecord.uid, {
    role: "courseCreator",
    roles: ["courseCreator"],
    ROLE_COURSE_CREATOR: true
  });

  await db.doc("users/" + userRecord.uid).set({
    id: userRecord.uid,
    authUid: userRecord.uid,
    displayName: "Course Creator Test",
    firstName: "Course",
    lastName: "Creator",
    email: testEmail,
    role: "courseCreator",
    roles: ["courseCreator"],
    ROLE_COURSE_CREATOR: true,
    status: "active",
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}

async function seedCourseCreatorTargets() {
  await db.doc("locations/course_creator_test_location").set({
    id: "course_creator_test_location",
    name: "Course Creator Test Location",
    title: "Course Creator Test Location",
    status: "active",
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  await db.doc("classes/course_creator_test_class").set({
    id: "course_creator_test_class",
    name: "Course Creator Test Class",
    title: "Course Creator Test Class",
    locationId: "course_creator_test_location",
    primaryLocationId: "course_creator_test_location",
    primaryTeacherId: testUid,
    teacherOwnershipIds: [testUid],
    status: "active",
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  await db.doc("users/course_creator_test_student").set({
    id: "course_creator_test_student",
    authUid: "course_creator_test_student",
    displayName: "Course Creator Test Student",
    firstName: "Test",
    lastName: "Student",
    role: "student",
    roles: ["student"],
    classId: "course_creator_test_class",
    classIds: ["course_creator_test_class"],
    assignedClassIds: ["course_creator_test_class"],
    locationId: "course_creator_test_location",
    status: "active",
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}
