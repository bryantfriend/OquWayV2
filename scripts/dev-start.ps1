$ErrorActionPreference = "Stop"

& "$PSScriptRoot\git-health-check.ps1"

$workingTreeChanges = git status --porcelain
if ($LASTEXITCODE -ne 0) {
    Write-Error "Could not read Git status."
    exit 1
}

if ($workingTreeChanges) {
    git status
    Write-Error "Working tree has local changes. Commit or stash them before pulling."
    exit 1
}

git pull --ff-only origin main
