import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const checks = [
  {
    file: "apps/course-creator-dashboard/src/ui/pages/CourseEditorPage.js",
    contains: [
      "ICT Readiness",
      "Suggested ICT arc: hook, teach, active practice, checkpoint, file upload, reflection.",
      "buildModuleReadinessPanel",
      "readModuleReadiness",
      "Teacher-reviewed evidence",
      "readStepPickerSearchText",
      "readActivitySearchTags",
      "docx",
      "pptx",
      "xlsx",
      "helpText"
    ]
  },
  {
    file: "packages/core/src/shared/stepTypes/ExternalTaskStep.js",
    contains: [
      "Allowed File Types",
      "Use document for Word, PowerPoint, Excel, PDF, text, and CSV uploads.",
      "Create a formatted Word document",
      "This becomes the student-facing success criteria and your review rubric."
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
      console.error("[course-creator-robustness:missing]", check.file, needle);
    }
  });
});

if (failures > 0) {
  console.error("[course-creator-robustness:failed]", failures + " missing marker(s)");
  process.exit(1);
}

console.log("[course-creator-robustness:passed]", checks.length + " authoring surfaces checked");
