@echo off
echo Singapore Drinks App - Complete Installation and Fix
echo ============================================
echo.

REM Check Node.js version
echo Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking npm version...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo.
echo Step 1: Cleaning up existing installation...
echo ============================================

REM Clean npm cache
echo Cleaning npm cache...
npm cache clean --force
if %errorlevel% neq 0 (
    echo Warning: Cache clean failed, continuing...
)

REM Remove node_modules and package-lock.json
if exist node_modules (
    echo Removing node_modules folder...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

echo.
echo Step 2: Installing dependencies...
echo ================================

REM Install with legacy peer deps to avoid conflicts
echo Installing packages with legacy peer deps...
npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo.
    echo Installation failed. Trying alternative method...
    echo.
    echo Trying with --force flag...
    npm install --force
    
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Both installation methods failed
        echo Please check your internet connection and Node.js version
        echo.
        echo Suggested fixes:
        echo 1. Update Node.js to latest LTS version
        echo 2. Run as Administrator
        echo 3. Check firewall/antivirus settings
        pause
        exit /b 1
    )
)

echo.
echo Step 3: Fixing vulnerabilities...
echo ===============================
echo Running npm audit fix...
npm audit fix

echo.
echo Step 4: Verifying installation...
echo ===============================

REM Check if react-scripts is installed
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✓ react-scripts is properly installed
) else (
    echo ✗ react-scripts installation failed
    echo Trying to install react-scripts specifically...
    npm install react-scripts@5.0.1 --save
)

echo.
echo Step 5: Testing the application...
echo ===============================
echo Attempting to start the development server...
echo Press Ctrl+C to stop the server when it opens
echo.

timeout /t 3 /nobreak >nul

npm start

echo.
echo Installation and setup complete!
echo.
echo If the app didn't start automatically:
echo 1. Run: npm start
echo 2. Open: http://localhost:3000
echo.
pause