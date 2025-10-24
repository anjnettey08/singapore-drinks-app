# Troubleshooting Guide

## Current Issues and Solutions

### 🔧 **Issue 1: 'react-scripts' is not recognized**
This means the dependencies weren't installed properly.

**Quick Fix:**
1. Double-click `fix-and-start.bat` in Windows Explorer
2. Wait for it to complete the installation
3. The app should start automatically

**Manual Fix:**
```cmd
cd "d:\Users\batulana\Desktop\Learning Friday\Drinks App"
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
npm start
```

### 🔧 **Issue 2: npm run dev - 9 vulnerabilities**
Security warnings in dependencies.

**Fix:**
```cmd
npm audit fix
npm audit fix --force
```

**Alternative (if above doesn't work):**
```cmd
npm install --legacy-peer-deps
npm audit fix --legacy-peer-deps
```

## Installation Issues

### Common npm install errors and solutions:

#### 1. **Error: react-scripts version issue**
If you see errors about react-scripts version `^0.0.0`, this has been fixed in the latest package.json.

#### 2. **Permission errors**
Run your command prompt as Administrator:
```cmd
Right-click Command Prompt → "Run as administrator"
```

#### 3. **Node.js not found**
Make sure Node.js is installed:
- Download from: https://nodejs.org/
- Choose LTS version (recommended)
- Restart your command prompt after installation

#### 4. **Network/proxy issues**
Try these commands in order:
```cmd
npm cache clean --force
npm install --legacy-peer-deps
```

#### 5. **Path issues with spaces**
The folder name contains spaces. Try these alternatives:

**Option A: Use quotes**
```cmd
cd "d:\Users\batulana\Desktop\Learning Friday\Drinks App"
npm install
```

**Option B: Use the batch file**
Double-click `fix-and-start.bat` in Windows Explorer

#### 6. **Clear everything and start fresh**
```cmd
cd "d:\Users\batulana\Desktop\Learning Friday\Drinks App"
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

## Alternative Installation Methods

### Method 1: Using the comprehensive fix script (RECOMMENDED)
1. Navigate to the project folder in Windows Explorer
2. Double-click `fix-and-start.bat`
3. Follow the prompts - it will fix everything automatically

### Method 2: Manual command line
```cmd
cd "d:\Users\batulana\Desktop\Learning Friday\Drinks App"
npm install --legacy-peer-deps
npm start
```

### Method 3: If all else fails
1. Copy the project to a folder without spaces (e.g., `C:\drinks-app`)
2. Run npm install from there

## Running the App

After successful installation:
```cmd
npm start
```
OR
```cmd
npm run dev
```

The app will open in your browser at: http://localhost:3000

## Vulnerability Fixes

If you see vulnerability warnings:
```cmd
npm audit fix
```

For more aggressive fixes:
```cmd
npm audit fix --force
```

## Getting Help

If you're still having issues:
1. Check your Node.js version: `node --version` (should be 16+)
2. Check your npm version: `npm --version`
3. Try running as Administrator
4. Use the `fix-and-start.bat` script which handles most issues automatically
5. Copy the exact error message for troubleshooting