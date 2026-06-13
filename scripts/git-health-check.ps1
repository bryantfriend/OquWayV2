$ErrorActionPreference = "Stop"

function Fail($message) {
    Write-Error $message
    exit 1
}

Write-Host "Checking Git working tree health..."

$lockFiles = @(
    ".git/index.lock",
    ".git/config.lock"
) | Where-Object { Test-Path $_ }

if ($lockFiles.Count -gt 0) {
    Fail "Git lock file(s) found: $($lockFiles -join ', '). Close other Git processes or remove stale locks after confirming no Git command is running."
}

$unmergedFiles = git diff --name-only --diff-filter=U
if ($LASTEXITCODE -ne 0) {
    Fail "Could not inspect unmerged files."
}

if ($unmergedFiles) {
    Write-Host "Unmerged files:"
    $unmergedFiles | ForEach-Object { Write-Host "  $_" }
    Fail "Resolve merge/rebase conflicts before continuing."
}

$markerMatches = git grep -n -E '^(<<<<<<<|>>>>>>>)' -- apps packages scripts VERSION 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Conflict markers found:"
    $markerMatches | ForEach-Object { Write-Host $_ }
    Fail "Remove conflict markers before continuing."
}

if ($LASTEXITCODE -ne 1) {
    Fail "Conflict marker scan failed."
}

$branchStatus = git status -sb
if ($LASTEXITCODE -ne 0) {
    Fail "Could not read Git status."
}

Write-Host $branchStatus
if ($branchStatus -match '\[behind|\[ahead [0-9]+, behind') {
    Fail "This branch is behind upstream. Pull/rebase before committing or deploying."
}

$stashList = git stash list
if ($LASTEXITCODE -ne 0) {
    Fail "Could not inspect Git stash list."
}

if ($stashList) {
    Write-Warning "Git stashes exist. Review them with: git stash list"
    $stashList | ForEach-Object { Write-Warning $_ }
}

Write-Host "Git health check passed."
