@echo off
echo STEP BY STEP MANUAL FIX
echo ========================
echo.
echo This script will walk you through fixing npm start issues manually.
echo Follow each step and press any key to continue to the next step.
echo.

echo STEP 1: Check Node.js
echo ---------------------
echo Your Node.js version:
node --version
echo.
echo Your npm version:
npm --version
echo.
echo If either command failed, install Node.js from https://nodejs.org/
echo Press any key to continue...
pause >nul

echo.
echo STEP 2: Navigate to project directory
echo ------------------------------------
cd "d:\Users\batulana\Desktop\Learning Friday\Drinks App"
echo Current directory: %cd%
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 3: Clean existing installation
echo ----------------------------------
echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules
echo Removing package-lock.json...
if exist package-lock.json del package-lock.json
echo Cleaning npm cache...
npm cache clean --force
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 4: Use simplified package.json (optional)
echo ---------------------------------------------
echo Do you want to try the simplified package.json? (y/n)
set /p choice="Enter choice: "
if /i "%choice%"=="y" (
    echo Backing up current package.json...
    copy package.json package-backup.json
    echo Using simplified package.json...
    copy package-simple.json package.json
)
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 5: Install dependencies
echo ---------------------------
echo Installing with legacy peer deps...
npm install --legacy-peer-deps
echo.
if %errorlevel% neq 0 (
    echo Installation failed. Trying with --force...
    npm install --force
)
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 6: Verify react-scripts
echo ---------------------------
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✓ react-scripts found
) else (
    echo Installing react-scripts manually...
    npm install react-scripts@5.0.1
)
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 7: Try to start the app
echo ---------------------------
echo Starting the development server...
echo If this fails, you'll see the exact error message.
echo.
npm start

echo.
echo If the app didn't start, please copy the error message and share it.
pause