param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$repoPath = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Set-Location $repoPath

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
    throw "No Git repository was found at $repoPath"
}

$branch = (git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($branch)) {
    throw "The repository is not currently on a named branch."
}

if ($DryRun) {
    Write-Output "Daily Git backup is ready for branch '$branch' at '$repoPath'."
    git status --short
    exit $LASTEXITCODE
}

git add -A
if ($LASTEXITCODE -ne 0) {
    throw "git add failed."
}

git diff --cached --quiet
$diffExitCode = $LASTEXITCODE

if ($diffExitCode -eq 0) {
    Write-Output "No changes to commit."
    exit 0
}

if ($diffExitCode -ne 1) {
    throw "Unable to check for staged changes."
}

$date = Get-Date -Format "yyyy-MM-dd"
git commit -m "chore: daily backup $date"
if ($LASTEXITCODE -ne 0) {
    throw "git commit failed."
}

git rev-parse --abbrev-ref --symbolic-full-name "@{u}" *> $null
if ($LASTEXITCODE -eq 0) {
    git push
} else {
    git push --set-upstream origin $branch
}

if ($LASTEXITCODE -ne 0) {
    throw "git push failed. Check your network connection and GitHub authentication."
}
