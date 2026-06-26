import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var repoRoot = path.resolve(__dirname, "..");
var failures = [];

await runTest("users list removes teacher resource-data authorization", verifyUsersListRule);
await runTest("teacher list helpers guard list fields", verifyListTypeGuards);
await runTest("student class checks guard blank class ids", verifyStudentDataClassGuards);
await runTest("course assignments are scoped", verifyCourseAssignmentReadRules);
await runTest("external task submission list stays backend-safe", verifyExternalTaskSubmissionRules);
await runTest("emotional check-in reads are scoped", verifyEmotionalCheckInReadRules);
await runTest("class collection paths are documented", verifyClassPathDocumentation);
await runTest("explicit and collection-group step rules agree", verifyStepReadRules);

if (failures.length > 0) {
  console.error("Firestore rules regression failed:");
  failures.forEach(function (failure) {
    console.error("- " + failure);
  });
  process.exit(1);
}

console.log("Firestore rules regression passed.");

async function runTest(name, testFunction) {
  try {
    await testFunction();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + readErrorMessage(error));
  }
}

async function verifyUsersListRule() {
  var rulesSource = await readSource("firestore.rules");
  var usersBlock = readBlock(rulesSource, "match /users/{uid}");
  var usersListRule = readBetween(usersBlock, "allow list:", "// Allow admins");
  var getClassBlock = readBlock(rulesSource, "function isStudentInTeacherClass");
  var listedDataBlock = readBlock(rulesSource, "function studentDataHasTeacherListedClass");

  assertSourceIncludes(getClassBlock, "studentDataHasTeacherClass(resource.data)", "users get should keep full helper for single-document reads");
  assertNoSourceIncludes(usersListRule, "isStudentInTeacherListedClass()", "users list should not authorize teacher roster queries from resource.data");
  assertNoSourceIncludes(usersListRule, "studentDataHasTeacher", "users list should not depend on student resource class data");
  assertNoSourceIncludes(listedDataBlock, "isTeacherAssignedToClassId", "list-safe helper must not dynamically read /classes from resource data");
}

async function verifyListTypeGuards() {
  var rulesSource = await readSource("firestore.rules");
  var teacherClassBlock = readBlock(rulesSource, "function teacherHasClass");
  var teacherListBlock = readBlock(rulesSource, "function listHasTeacherClass");
  var locationBlock = readBlock(rulesSource, "function teacherHasLocation");

  assertSourceIncludes(teacherClassBlock, "user().data.get(\"classIds\", []) is list", "teacherHasClass should guard classIds type");
  assertSourceIncludes(teacherClassBlock, "linkedUser().data.get(\"assignedClassIds\", []) is list", "teacherHasClass should guard linked assignedClassIds type");
  assertSourceIncludes(teacherListBlock, "user().data.get(\"classIds\", []) is list && user().data.get(\"classIds\", []).hasAny(classIds)", "listHasTeacherClass should guard classIds before hasAny");
  assertSourceIncludes(teacherListBlock, "linkedUser().data.get(\"assignedClassIds\", []) is list && linkedUser().data.get(\"assignedClassIds\", []).hasAny(classIds)", "listHasTeacherClass should guard linked assignedClassIds before hasAny");
  assertSourceIncludes(locationBlock, "user().data.get(\"locationIds\", []) is list", "teacherHasLocation should guard locationIds type");
  assertSourceIncludes(locationBlock, "linkedUser().data.get(\"schoolIds\", []) is list", "teacherHasLocation should guard linked schoolIds type");
}

async function verifyStudentDataClassGuards() {
  var rulesSource = await readSource("firestore.rules");
  var studentDataBlock = readBlock(rulesSource, "function studentDataHasTeacherClass");

  assertSourceIncludes(studentDataBlock, "studentData.get(\"classId\", \"\") != \"\"", "classId should be non-empty before class assignment lookup");
  assertSourceIncludes(studentDataBlock, "studentData.get(\"primaryClassId\", \"\") != \"\"", "primaryClassId should be non-empty before class assignment lookup");
}

async function verifyCourseAssignmentReadRules() {
  var rulesSource = await readSource("firestore.rules");
  var assignmentBlock = readBlock(rulesSource, "match /courseAssignments/{assignmentId}");
  var canReadBlock = readBlock(rulesSource, "function canReadCourseAssignment");
  var studentAssignmentBlock = readBlock(rulesSource, "function isStudentAssignedCourseAssignment");

  assertNoSourceIncludes(assignmentBlock, "allow get, list: if request.auth != null", "courseAssignments must not be globally readable to all authenticated users");
  assertSourceIncludes(assignmentBlock, "allow get, list: if canReadCourseAssignment();", "courseAssignments reads should use scoped helper");
  assertSourceIncludes(canReadBlock, "isTeacherAssignedToCourseAssignment(resource.data)", "teacher assignment reads should be scoped to assignment ownership");
  assertSourceIncludes(canReadBlock, "isStudentAssignedCourseAssignment(resource.data)", "student assignment reads should be scoped to assigned targets");
  assertSourceIncludes(studentAssignmentBlock, "studentHasClass", "student class-target assignments should remain readable to assigned students");
  assertSourceIncludes(studentAssignmentBlock, "studentHasLocation", "student location-target assignments should remain readable to assigned students");
}

async function verifyExternalTaskSubmissionRules() {
  var rulesSource = await readSource("firestore.rules");
  var submissionBlock = readBlock(rulesSource, "match /externalTaskSubmissions/{submissionId}");
  var getRule = readBetween(submissionBlock, "allow get:", "allow list:");
  var listRule = readBetween(submissionBlock, "allow list:", "allow update:");

  assertSourceIncludes(getRule, "isTeacherInExternalTaskScope()", "teachers should keep scoped single-submission reads");
  assertNoSourceIncludes(listRule, "isTeacherInExternalTaskScope()", "teacher review queue list should move behind backend/admin access, not client resource-data scope");
}

async function verifyEmotionalCheckInReadRules() {
  var rulesSource = await readSource("firestore.rules");
  var checkInBlock = readBlock(rulesSource, "match /emotionalCheckIns/{checkInId}");
  var readBlockSource = readBlock(rulesSource, "function canReadEmotionalCheckIn");
  var teacherScopeBlock = readBlock(rulesSource, "function isTeacherInEmotionalCheckInScope");
  var listRule = readBetween(checkInBlock, "allow list:", "allow update:");

  assertSourceIncludes(checkInBlock, "allow get: if canReadEmotionalCheckIn();", "emotional check-in get should use scoped read helper");
  assertSourceIncludes(readBlockSource, "isTeacherInEmotionalCheckInScope()", "teachers should have scoped single check-in reads");
  assertSourceIncludes(teacherScopeBlock, "teacherHasClass", "teacher check-in reads should be class scoped");
  assertSourceIncludes(teacherScopeBlock, "teacherHasLocation", "teacher check-in reads should be location scoped");
  assertNoSourceIncludes(listRule, "isTeacherInEmotionalCheckInScope()", "teacher check-in list views should be served by backend instead of client resource-data scope");
}

async function verifyClassPathDocumentation() {
  var rulesSource = await readSource("firestore.rules");

  assertSourceIncludes(rulesSource, "Student login still reads legacy location-scoped classes", "location class path should be intentionally documented");
  assertSourceIncludes(rulesSource, "Root classes are used by dashboards and location fallback queries", "root class path should be intentionally documented");
}

async function verifyStepReadRules() {
  var rulesSource = await readSource("firestore.rules");
  var courseStepsBlock = readBlock(rulesSource, "match /courses/{courseId}/modules/{moduleId}/steps/{stepId}");
  var catalogStepsBlock = readBlock(rulesSource, "match /catalogCourses/{courseId}/modules/{moduleId}/steps/{stepId}");
  var groupStepsBlock = readBlock(rulesSource, "match /{path=**}/steps/{stepId}");

  assertSourceIncludes(rulesSource, "function canReadRuntimeSteps()", "rules should define a shared step read helper");
  assertSourceIncludes(courseStepsBlock, "allow read: if canReadRuntimeSteps();", "course steps should use shared runtime step read helper");
  assertSourceIncludes(catalogStepsBlock, "allow read: if canReadRuntimeSteps();", "catalog course steps should use shared runtime step read helper");
  assertSourceIncludes(groupStepsBlock, "allow read: if canReadRuntimeSteps();", "collection-group steps should use shared runtime step read helper");
  assertNoSourceIncludes(courseStepsBlock, "allow read: if true", "course steps should not bypass role checks");
  assertNoSourceIncludes(catalogStepsBlock, "allow read: if true", "catalog course steps should not bypass role checks");
}

async function readSource(relativePath) {
  return await readFile(path.join(repoRoot, relativePath), "utf8");
}

function assertSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) !== -1, true, message);
}

function assertNoSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) === -1, true, message);
}

function readBetween(source, startMarker, endMarker) {
  var startIndex = source.indexOf(startMarker);
  var endIndex = startIndex === -1 ? -1 : source.indexOf(endMarker, startIndex + startMarker.length);

  assert.equal(startIndex !== -1, true, "missing source marker " + startMarker);
  assert.equal(endIndex !== -1, true, "missing end marker " + endMarker);

  return source.slice(startIndex, endIndex);
}

function readBlock(source, marker) {
  var startIndex = source.indexOf(marker);
  var braceIndex = startIndex === -1 ? -1 : source.indexOf("{", startIndex + marker.length);
  var depth = 0;
  var index = braceIndex;

  assert.equal(startIndex !== -1, true, "missing source marker " + marker);
  assert.equal(braceIndex !== -1, true, "missing block brace for " + marker);

  while (index < source.length) {
    if (source[index] === "{") {
      depth = depth + 1;
    } else if (source[index] === "}") {
      depth = depth - 1;
      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }

    index = index + 1;
  }

  return source.slice(startIndex);
}

function readErrorMessage(error) {
  return error && error.message ? error.message : String(error);
}