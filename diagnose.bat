@echo off
echo DIAGNOSTIC SCRIPT - Singapore Drinks App
echo =========================================
echo.

echo Current Directory:
cd
echo.

echo Node.js Information:
echo ---------------------
node --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    goto :end
)

npm --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    goto :end
)

echo.
echo Package.json exists?
if exist package.json (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found
    goto :end
)

echo.
echo node_modules exists?
if exist node_modules (
    echo ✓ node_modules folder exists
) else (
    echo ✗ node_modules folder missing
    echo Running npm install...
    npm install --legacy-peer-deps
)

echo.
echo react-scripts installed?
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✓ react-scripts.cmd found
) else (
    echo ✗ react-scripts.cmd missing
)

if exist "node_modules\react-scripts\bin\react-scripts.js" (
    echo ✓ react-scripts.js found
) else (
    echo ✗ react-scripts.js missing
    echo Installing react-scripts...
    npm install react-scripts@5.0.1 --save
)

echo.
echo Checking main files:
echo -------------------
if exist "src\index.tsx" (
    echo ✓ src\index.tsx exists
) else (
    echo ✗ src\index.tsx missing
)

if exist "public\index.html" (
    echo ✓ public\index.html exists
) else (
    echo ✗ public\index.html missing
)

if exist "App.tsx" (
    echo ✓ App.tsx exists
) else (
    echo ✗ App.tsx missing
)

echo.
echo Trying to run npm start...
echo =========================
echo If this fails, you'll see the exact error:
echo.

npm start

:end
echo.
echo Press any key to close...
pause >nul