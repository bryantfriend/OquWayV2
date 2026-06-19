import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isOpenableCourseStatus } from "../packages/domain/courses/courseOpenValidation.js";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var repoRoot = path.resolve(__dirname, "..");
var failures = [];

await runTest("student course status visibility", verifyStudentCourseStatusVisibility);
await runTest("student dashboard render states", verifyStudentDashboardRenderStates);
await runTest("student dashboard load timeout and retry contract", verifyLoadTimeoutAndRetryContract);
await runTest("student dashboard ICF source guards", verifyIcfSourceGuards);

if (failures.length > 0) {
  console.error("Student Dashboard load regression failed:");
  failures.forEach(function (failure) {
    console.error("- " + failure);
  });
  process.exit(1);
}

console.log("Student Dashboard load regression passed.");

async function runTest(name, testFunction) {
  try {
    await testFunction();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + readErrorMessage(error));
  }
}

function verifyStudentCourseStatusVisibility() {
  assert.equal(isOpenableCourseStatus("published"), true, "published courses should open");
  assert.equal(isOpenableCourseStatus("active"), true, "active courses should open");
  assert.equal(isOpenableCourseStatus("ready"), true, "ready courses should open");
  assert.equal(isOpenableCourseStatus("assigned"), true, "assigned legacy courses should open");
  assert.equal(isOpenableCourseStatus("draft"), false, "draft courses should not open for students");
  assert.equal(isOpenableCourseStatus("archived"), false, "archived courses should not open");
  assert.equal(isOpenableCourseStatus("deleted"), false, "deleted courses should not open");
}

async function verifyStudentDashboardRenderStates() {
  var mainSource = await readSource("apps/student-dashboard/src/main.js");

  assertSourceIncludes(mainSource, "buildLoadingView()", "dashboard should still render loading state");
  assertSourceIncludes(mainSource, "student-course-card", "assigned course cards should keep smoke-test selector");
  assertSourceIncludes(mainSource, "className: \"student-empty student-home-empty\"", "empty state should keep student-empty selector");
  assertSourceIncludes(mainSource, "No courses are ready yet", "empty state should use class-safe wording");
  assertSourceIncludes(mainSource, "buildStudentDashboardErrorState", "dashboard should render explicit error state");
  assertSourceIncludes(mainSource, "student-error-retry-btn", "dashboard error should include retry button");
  assertSourceIncludes(mainSource, "student-reload-btn", "retry should reuse existing reload behavior");
  assert.equal(
    readStoreImportVersion(mainSource),
    readStoreImportVersion(await readSource("apps/student-dashboard/src/ui/services/studentDashboardService.js")),
    "main and service must import the same student dashboard store module URL"
  );
}

async function verifyLoadTimeoutAndRetryContract() {
  var serviceSource = await readSource("apps/student-dashboard/src/ui/services/studentDashboardService.js");

  assertSourceIncludes(serviceSource, "waitForStudentDashboardLoad", "student dashboard service should bound dashboard loading");
  assertSourceIncludes(serviceSource, "LoadStudentDashboardIntent", "dashboard should continue using ICF intent");
  assertSourceIncludes(serviceSource, "StudentOpenCourseIntent", "course launch should continue using ICF intent");
  assertSourceIncludes(serviceSource, "isLoading: false", "load failure should clear isLoading");
  assertSourceIncludes(serviceSource, "readDashboardLoadErrorMessage", "load failures should produce safe student-facing copy");
  assertSourceIncludes(serviceSource, "[student-dashboard:load-failed]", "load failures should log diagnostic context");
  assertNoSourceIncludes(serviceSource, "alert(", "student dashboard service must not use alerts");
}

async function verifyIcfSourceGuards() {
  var loadDashboardSource = await readSource("packages/core/src/icf/stages/process/domain/student/processLoadStudentDashboard.js");
  var loadCourseSource = await readSource("packages/core/src/icf/stages/process/domain/student/processLoadStudentCourse.js");
  var openCourseSource = await readSource("packages/core/src/icf/stages/process/domain/student/processStudentOpenCourse.js");

  assertSourceIncludes(loadDashboardSource, "waitForStudentDashboardRead", "LoadStudentDashboard process should bound assignment/course reads");
  assertSourceIncludes(loadDashboardSource, "ASSIGNED_COURSE_NOT_READY", "unpublished assigned courses should be skipped with warning");
  assertSourceIncludes(loadDashboardSource, "isStudentVisibleCourseSummary", "course summaries should be filtered before rendering");
  assertNoSourceIncludes(readFunctionBlock(loadDashboardSource, "function isStudentVisibleCourseSummary"), 'status === "draft"', "draft courses should not be visible in summaries");
  assertNoSourceIncludes(readFunctionBlock(loadCourseSource, "function isStudentVisibleCourse"), 'courseData.status === "draft"', "draft courses should not be visible in full course fallback");
  assertSourceIncludes(openCourseSource, "waitForStudentCourseOpenRead", "StudentOpenCourse process should bound assignment lookup");
  assertSourceIncludes(openCourseSource, "getAssignedCourseIds", "StudentOpenCourse should remain assignment-scoped");
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

function readFunctionBlock(source, marker) {
  var startIndex = source.indexOf(marker);
  var braceIndex = startIndex === -1 ? -1 : source.indexOf("{", startIndex);
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

function readStoreImportVersion(source) {
  var match = source.match(/studentDashboardState\.js\?v=([^"']+)/);
  return match ? match[1] : "";
}

function readErrorMessage(error) {
  return error && error.message ? error.message : String(error);
}
