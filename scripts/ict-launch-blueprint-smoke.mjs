import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const blueprintPath = path.join(repoRoot, "knowledgebase", "ICT_Launch_Course_Blueprint.json");
const blueprint = JSON.parse(await readFile(blueprintPath, "utf8"));
const failures = [];

assert(blueprint.launchScope.teacherCount === 1, "launch scope should be one teacher");
assert(Array.isArray(blueprint.launchScope.classes) && blueprint.launchScope.classes.length === 6, "launch scope should include six classes");
assert(Array.isArray(blueprint.courses) && blueprint.courses.length === 3, "three ICT courses should be defined");
assert(blueprint.attendance.statuses.join(",") === "present,absent,late,excused", "attendance statuses should match launch policy");
assert(blueprint.attendance.lateRequiresMinutes === true, "late attendance should require minutes");
assert(blueprint.review.scoreRange === "0-100", "review score range should be 0-100");

const expectedModules = {
  "ict-grade-6-2026-2027": 51,
  "ict-grade-7-2026-2027": 42,
  "ict-grade-8-2026-2027": 49
};

for (const course of blueprint.courses) {
  const expectedCount = expectedModules[course.id];
  assert(Boolean(expectedCount), `unexpected course id ${course.id}`);
  assert(course.modules.length === expectedCount + 1, `${course.id} should include Module 0 plus ${expectedCount} curriculum modules`);
  assert(course.classes.length === 2, `${course.id} should map to two classes`);
}

const allTasks = blueprint.courses.flatMap((course) => course.modules.map((module) => module.externalTask).filter(Boolean));
const taskTools = new Set(allTasks.map((task) => task.tool));
assert(taskTools.has("Microsoft Word"), "Word upload tasks should be present");
assert(taskTools.has("Microsoft PowerPoint"), "PowerPoint upload tasks should be present");
assert(taskTools.has("Microsoft Excel"), "Excel upload tasks should be present");
assert(allTasks.length >= 40, "launch blueprint should include substantial teacher-reviewed upload coverage");

if (failures.length > 0) {
  console.error("ICT launch blueprint smoke failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log(`[ict-launch-blueprint:passed] ${blueprint.courses.length} courses, ${allTasks.length} upload tasks, ${blueprint.launchScope.classes.length} classes checked`);

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}