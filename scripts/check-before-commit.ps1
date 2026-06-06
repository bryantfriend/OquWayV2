$ErrorActionPreference = "Stop"

$files = @(
    "apps/super-admin-dashboard/src/main.js",
    "apps/student-dashboard/src/main.js",
    "apps/teacher-dashboard/src/main.js",
    "apps/course-creator-dashboard/src/main.js",
    "packages/shared/index.js",
    "packages/shared/version.js",
    "packages/ui/index.js",
    "packages/firebase/index.js",
    "packages/icf/index.js",
    "packages/core/src/icf/engine/runIntentPipeline.js"
)

foreach ($file in $files) {
    Write-Host "node --check $file"
    node --check $file
}
