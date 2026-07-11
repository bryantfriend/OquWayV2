import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const checks = [
  {
    file: "packages/core/src/icf/engine/intentRegistry.js",
    contains: [
      "LoadTeacherAttendanceIntent",
      "SaveTeacherAttendanceIntent",
      "LoadTeacherStudentDetailIntent"
    ]
  },
  {
    file: "packages/core/src/icf/intents/intents.js",
    contains: [
      "LoadTeacherAttendanceIntent",
      "SaveTeacherAttendanceIntent",
      "LoadTeacherStudentDetailIntent"
    ]
  },
  {
    file: "packages/core/src/icf/stages/process/domain/teacher/teacherDashboardProcessors.js",
    contains: [
      "processLoadTeacherAttendance",
      "processSaveTeacherAttendance",
      "processLoadTeacherStudentDetail",
      "attendanceRecords",
      "lateMinutes",
      "readStudentHelpSignals"
    ]
  },
  {
    file: "apps/teacher-dashboard/src/main.js",
    contains: [
      "buildAttendanceView",
      "buildNeedsHelpView",
      "buildStudentDetailView",
      "data-action=\"save-attendance\"",
      "data-attendance-late-minutes",
      "teacher-attendance-export",
      "data-score-id",
      "data-action=\"view-student-detail\""
    ]
  },
  {
    file: "packages/core/src/shared/stepTypes/ExternalTaskStep.js",
    contains: [
      "Teacher feedback:",
      "Read your teacher feedback"
    ]
  },
  {
    file: "knowledgebase/ICT_Launch_Course_Blueprint.json",
    contains: [
      "ICT Grade 6 2026-2027",
      "ICT Grade 7 2026-2027",
      "ICT Grade 8 2026-2027",
      "Microsoft Word",
      "Microsoft PowerPoint",
      "Microsoft Excel"
    ]
  },
  {
    file: "knowledgebase/ICT_Launch_Course_Blueprint.md",
    contains: [
      "Grade 6",
      "Grade 7",
      "Grade 8",
      "EDU Page"
    ]
  },
  {
    file: "knowledgebase/Launch_Readiness_Checklist.md",
    contains: [
      "Teacher can take attendance",
      "Needs Help list"
    ]
  },
  {
    file: "knowledgebase/Teacher_Quick_Start_Guide.md",
    contains: [
      "Take attendance",
      "Review assignments"
    ]
  }
];

let failures = 0;

checks.forEach(function (check) {
  const filePath = resolve(root, check.file);
  const text = readFileSync(filePath, "utf8");

  check.contains.forEach(function (needle) {
    if (!text.includes(needle)) {
      failures += 1;
      console.error("[launch-smoke:missing]", check.file, needle);
    }
  });
});

if (failures > 0) {
  console.error("[launch-smoke:failed]", failures + " missing marker(s)");
  process.exit(1);
}

console.log("[launch-smoke:passed]", checks.length + " launch-readiness surfaces checked");
