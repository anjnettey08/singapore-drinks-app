@echo off
echo Installing React Web App dependencies...
echo.

REM Navigate to project directory
cd /d "d:\Users\batulana\Desktop\Learning Friday\Drinks App"

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js with npm from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js and npm are available
node --version
npm --version
echo.

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Delete node_modules if it exists
if exist node_modules (
    echo Removing existing node_modules...
    rmdir /s /q node_modules
)

REM Delete package-lock.json if it exists
if exist package-lock.json (
    echo Removing existing package-lock.json...
    del package-lock.json
)

REM Install Node dependencies for React web app
echo Installing npm packages...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed
    echo Trying with --legacy-peer-deps flag...
    npm install --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Installation failed even with legacy peer deps
        echo Please check your internet connection and Node.js version
        pause
        exit /b 1
    )
)

echo.
echo Installation complete!
echo.
echo To run the app:
echo   npm start (starts development server)
echo   npm run build (builds for production)
echo.
echo The app will run in your web browser at http://localhost:3000
echo.
pause