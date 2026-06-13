$ErrorActionPreference = "Stop"

& "$PSScriptRoot\git-health-check.ps1"

$roots = @("apps", "packages", "scripts") | Where-Object { Test-Path $_ }
$files = Get-ChildItem -Path $roots -Recurse -File -Include *.js, *.mjs

foreach ($file in $files) {
    Write-Host "node --check $($file.FullName)"
    node --check $file.FullName
}
