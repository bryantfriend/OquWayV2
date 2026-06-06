$ErrorActionPreference = "Stop"

git status
git log -1 --oneline
Write-Host ""
Write-Host "Reminder: after deploy, open the live app console and confirm [oquway-build] is printed."
