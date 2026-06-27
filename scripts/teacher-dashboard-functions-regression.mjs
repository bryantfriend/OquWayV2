import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var repoRoot = path.resolve(__dirname, "..");
var failures = [];

await runTest("teacher dashboard callable uses Gen 2 onCall", verifyCallableExport);
await runTest("teacher dashboard students are scoped server-side", verifyServerSideScope);
await runTest("teacher dashboard students use Admin SDK queries", verifyAdminSdkQueries);
await runTest("teacher dashboard students are sanitized", verifySanitizedResponse);

if (failures.length > 0) {
  console.error("Teacher dashboard functions regression failed:");
  failures.forEach(function (failure) {
    console.error("- " + failure);
  });
  process.exit(1);
}

console.log("Teacher dashboard functions regression passed.");

async function runTest(name, testFunction) {
  try {
    await testFunction();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + readErrorMessage(error));
  }
}

async function verifyCallableExport() {
  var source = await readSource("functions/index.js");
  var exportBlock = readBlock(source, "exports.teacherDashboard = onCall");

  assertSourceIncludes(source, "require(\"firebase-functions/v2/https\")", "functions should use Firebase Gen 2 HTTPS callables");
  assertSourceIncludes(exportBlock, "verifyTeacherDashboardCaller(auth)", "callable should require an authenticated caller before routing actions");
  assertSourceIncludes(exportBlock, "action === \"listStudents\"", "callable should expose the listStudents action");
  assertSourceIncludes(exportBlock, "listTeacherDashboardStudents(data, auth)", "listStudents should run through the server-side teacher dashboard loader");
}

async function verifyServerSideScope() {
  var source = await readSource("functions/index.js");
  var loaderBlock = readBlock(source, "async function listTeacherDashboardStudents");
  var callerBlock = readBlock(source, "async function loadTeacherDashboardCaller");
  var scopeBlock = readBlock(source, "function resolveTeacherDashboardScope");
  var filterBlock = readBlock(source, "function filterAuthorizedScope");

  assertSourceIncludes(loaderBlock, "loadTeacherDashboardCaller(db, auth)", "loader should resolve caller profile from auth uid");
  assertSourceIncludes(loaderBlock, "resolveTeacherDashboardScope(caller.profile, caller.roles)", "loader should resolve teacher scope on the server");
  assertSourceIncludes(callerBlock, "readCallerProfile(db, authUid)", "caller should be loaded from /users instead of trusting request data");
  assertSourceIncludes(callerBlock, "Only teachers, assistants, or admins", "caller should enforce dashboard roles");
  assertSourceIncludes(scopeBlock, "readTeacherClassIds(profile || {})", "scope should include teacher class ids from profile");
  assertSourceIncludes(scopeBlock, "readTeacherLocationIds", "scope should include teacher location ids from profile");
  assertSourceIncludes(filterBlock, "permission-denied", "requested client scope should be rejected when outside authorized scope");
}

async function verifyAdminSdkQueries() {
  var source = await readSource("functions/index.js");
  var byClassBlock = readBlock(source, "async function appendTeacherDashboardStudentsByClass");
  var byLocationBlock = readBlock(source, "async function appendTeacherDashboardStudentsByLocation");
  var queryBlock = readBlock(source, "async function appendTeacherDashboardStudentQuery");

  assertSourceIncludes(byClassBlock, "db.collection(\"users\").where(\"classId\", \"in\"", "class lookup should run through Admin SDK query");
  assertSourceIncludes(byClassBlock, "where(\"classIds\", \"array-contains-any\"", "class array lookup should be supported");
  assertSourceIncludes(byClassBlock, "where(\"assignedClassIds\", \"array-contains-any\"", "assigned class lookup should be supported");
  assertSourceIncludes(byLocationBlock, "where(\"locationId\", \"in\"", "location lookup should be supported");
  assertSourceIncludes(byLocationBlock, "where(\"primaryLocationId\", \"in\"", "primary location lookup should be supported");
  assertSourceIncludes(byLocationBlock, "where(\"schoolId\", \"in\"", "school lookup should be supported");
  assertSourceIncludes(queryBlock, "studentsQuery.limit(250).get()", "queries should be bounded");
  assertSourceIncludes(queryBlock, "hasStudentRole(student) && isActiveStudent(student)", "query results should be filtered to active students");
}

async function verifySanitizedResponse() {
  var source = await readSource("functions/index.js");
  var queryBlock = readBlock(source, "async function appendTeacherDashboardStudentQuery");
  var responseBlock = readBlock(source, "function buildTeacherDashboardStudentsResponse");
  var roleBlock = readBlock(source, "function readCallerRoles");

  assertSourceIncludes(queryBlock, "sanitizeStudent(studentDoc.id, student)", "callable should return sanitized student records only");
  assertSourceIncludes(responseBlock, "students: students", "response should return the sanitized student list");
  assertSourceIncludes(roleBlock, "token.ROLE_TEACHER === true", "role parsing should support boolean ROLE_TEACHER claims");
}

async function readSource(relativePath) {
  return await readFile(path.join(repoRoot, relativePath), "utf8");
}

function assertSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) !== -1, true, message);
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