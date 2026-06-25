import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var repoRoot = path.resolve(__dirname, "..");
var failures = [];

await runTest("users list avoids dynamic class document lookups", verifyUsersListRule);
await runTest("teacher list helpers guard list fields", verifyListTypeGuards);
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
  var getClassBlock = readBlock(rulesSource, "function isStudentInTeacherClass");
  var listedClassBlock = readBlock(rulesSource, "function isStudentInTeacherListedClass");
  var listedDataBlock = readBlock(rulesSource, "function studentDataHasTeacherListedClass");

  assertSourceIncludes(getClassBlock, "studentDataHasTeacherClass(resource.data)", "users get should keep full helper for single-document reads");
  assertSourceIncludes(listedClassBlock, "studentDataHasTeacherListedClass(resource.data)", "users list should use list-safe student class helper");
  assertNoSourceIncludes(listedClassBlock, "studentDataHasTeacherClass(resource.data)", "users list should not use get/read helper");
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