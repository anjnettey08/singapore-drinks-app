@echo off
echo LOCALHOST CONNECTION FIX - Singapore Drinks App
echo ================================================
echo.

REM Navigate to the project directory
cd /d "d:\Users\batulana\Desktop\Learning Friday\Drinks App"

REM Step 1: Backup current package.json
echo Step 1: Backing up current package.json...
if exist package.json (
    copy package.json package-backup.json >nul
    echo ✓ Backup created as package-backup.json
) else (
    echo ✗ package.json not found!
    pause
    exit /b 1
)

REM Step 2: Replace with local development version
echo.
echo Step 2: Setting up for local development...
if exist package-local.json (
    copy package-local.json package.json >nul
    echo ✓ Using local development package.json (without homepage)
) else (
    echo ✗ package-local.json not found!
    pause
    exit /b 1
)

REM Step 3: Kill any existing processes on port 3000
echo.
echo Step 3: Cleaning up existing processes...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo Found process on port 3000, attempting to kill...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /PID %%a /F 2>nul
    )
    echo ✓ Cleaned up port 3000
) else (
    echo ✓ Port 3000 is available
)

REM Step 4: Clear React cache
echo.
echo Step 4: Clearing React development cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ Cleared React cache
)

REM Step 5: Set environment variables
echo.
echo Step 5: Setting environment variables for local development...
set PUBLIC_URL=
set BROWSER=default
set HOST=localhost
set PORT=3000
set HTTPS=false
set REACT_APP_ENV=development

echo ✓ Environment configured for localhost

REM Step 6: Install/update dependencies if needed
echo.
echo Step 6: Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        echo Restoring original package.json...
        copy package-backup.json package.json >nul
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)

REM Step 7: Start the development server
echo.
echo Step 7: Starting development server...
echo =====================================
echo.
echo The app should start at: http://localhost:3000
echo.
echo If it doesn't open automatically, manually navigate to:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when you're done
echo.

timeout /t 3 /nobreak >nul

npm start

REM Step 8: Cleanup and restore
echo.
echo.
echo Step 8: Restoring original configuration...
if exist package-backup.json (
    copy package-backup.json package.json >nul
    del package-backup.json
    echo ✓ Original package.json restored
)

echo.
echo Localhost session ended.
echo To run again, use: start-local.bat or fix-localhost.bat
echo.
pause