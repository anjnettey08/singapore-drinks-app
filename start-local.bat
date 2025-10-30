@echo off
echo Starting Singapore Drinks App Locally
echo =====================================
echo.

REM Navigate to the correct directory
cd /d "d:\Users\batulana\Desktop\Learning Friday\Drinks App"

REM Check if we're in the right directory
if not exist package.json (
    echo ERROR: package.json not found. Are we in the right directory?
    pause
    exit /b 1
)

echo Current directory: %cd%
echo.

REM Check Node.js
echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Set environment variables to ensure local development
set PUBLIC_URL=
set BROWSER=none

echo.
echo Starting development server...
echo The app will open at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm start

pause