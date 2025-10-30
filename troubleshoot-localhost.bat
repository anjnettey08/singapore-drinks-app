@echo off
echo QUICK LOCALHOST TROUBLESHOOT
echo ============================
echo.

REM Check what's running on common ports
echo Checking port usage:
echo -------------------
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo Port 3000 is in use
) else (
    echo Port 3000 is available
)

netstat -ano | findstr :3001
if %errorlevel% equ 0 (
    echo Port 3001 is in use  
) else (
    echo Port 3001 is available
)

echo.
echo Testing localhost connectivity:
echo ------------------------------
ping -n 1 localhost >nul
if %errorlevel% equ 0 (
    echo ✓ Localhost is reachable
) else (
    echo ✗ Localhost connectivity issue
)

ping -n 1 127.0.0.1 >nul
if %errorlevel% equ 0 (
    echo ✓ 127.0.0.1 is reachable
) else (
    echo ✗ 127.0.0.1 connectivity issue
)

echo.
echo Node.js processes:
echo -----------------
tasklist | findstr node.exe

echo.
echo React/npm processes:
echo -------------------
tasklist | findstr npm.cmd

echo.
echo Checking Windows Firewall:
echo -------------------------
netsh advfirewall show allprofiles | findstr "State"

echo.
echo System Info:
echo -----------
echo Current user: %USERNAME%
echo Current directory: %CD%
echo PATH includes Node.js: 
where node 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js found in PATH
) else (
    echo ✗ Node.js not found in PATH
)

echo.
echo Press any key to continue...
pause >nul