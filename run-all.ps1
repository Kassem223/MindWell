<#
Run all MindWelll services for local development (Windows PowerShell)

This script opens one PowerShell window per service and runs the module's mvnw spring-boot:run (skipping tests)
and starts the frontend via npm. Run this from the repository root or by double-clicking the script.

Usage:
  .\run-all.ps1            # start all services and frontend
  .\run-all.ps1 -NoFrontend  # start only backend services

Prerequisites:
 - JDK installed and JAVA_HOME set (or java available on PATH)
 - Node and npm installed

#>

param(
    [switch]$NoFrontend
)

function Check-Command($cmd) {
    $p = Get-Command $cmd -ErrorAction SilentlyContinue
    return $null -ne $p
}

Write-Host "Run-All: checking environment..."

if (-not (Check-Command java) -and -not $env:JAVA_HOME) {
    Write-Host "ERROR: Java not found. Please install a JDK and set JAVA_HOME, or ensure 'java' is on PATH." -ForegroundColor Red
    exit 1
}

if (-not $NoFrontend) {
    if (-not (Check-Command npm)) {
        Write-Host "ERROR: npm not found. Please install Node.js and npm." -ForegroundColor Red
        exit 1
    }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Repository root: $root"

function Start-ServiceWindow($workdir, $command, $title) {
    $psCmd = "Set-Location -LiteralPath '$workdir'; $command"
    Write-Host "Starting $title in new window: $workdir"
    Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',$psCmd -WindowStyle Normal -WorkingDirectory $workdir
}

# Paths (relative to repo root)
$eureka = Join-Path $root 'backend\eureka-server'
$auth = Join-Path $root 'backend\auth-service'
$mood = Join-Path $root 'backend\mood-service'
$gateway = Join-Path $root 'backend\api-gateway'
$frontend = Join-Path $root 'frontendF'

# Start sequence
Start-ServiceWindow $eureka ".\mvnw.cmd -DskipTests spring-boot:run" "Eureka Server"
Start-Sleep -Seconds 4
Start-ServiceWindow $auth ".\mvnw.cmd -DskipTests spring-boot:run" "Auth Service"
Start-Sleep -Seconds 3
Start-ServiceWindow $mood ".\mvnw.cmd -DskipTests spring-boot:run" "Mood Service"
Start-Sleep -Seconds 3
Start-ServiceWindow $gateway ".\mvnw.cmd -DskipTests spring-boot:run" "API Gateway"

if (-not $NoFrontend) {
    Start-Sleep -Seconds 2
    Start-ServiceWindow $frontend "npm run start" "Frontend (Angular)"
}

Write-Host "All startup commands issued. Check the newly opened windows for logs and ready status." -ForegroundColor Green
