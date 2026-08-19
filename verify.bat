@echo off
REM LapakRo - Verification Script (Windows)
REM Verifikasi bahwa semua setup sudah benar

echo.
echo ================================
echo LapakRo - Project Verification
echo ================================
echo.

setlocal enabledelayedexpansion
set passed=0
set failed=0

REM Check Node.js
echo Checking environment...
node --version >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Node.js installed
    set /a passed+=1
) else (
    echo [FAIL] Node.js not installed
    set /a failed+=1
)

npm --version >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] npm installed
    set /a passed+=1
) else (
    echo [FAIL] npm not installed
    set /a failed+=1
)

REM Check backend
echo.
echo Checking backend...
cd backend 2>nul
if exist "node_modules" (
    echo [OK] Backend node_modules exists
    set /a passed+=1
) else (
    echo [FAIL] Backend node_modules missing
    set /a failed+=1
)

if exist "package.json" (
    echo [OK] Backend package.json exists
    set /a passed+=1
) else (
    echo [FAIL] Backend package.json missing
    set /a failed+=1
)

npm run build >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Backend builds successfully
    set /a passed+=1
) else (
    echo [FAIL] Backend build failed
    set /a failed+=1
)

if exist ".env.example" (
    echo [OK] Backend .env.example exists
    set /a passed+=1
) else (
    echo [FAIL] Backend .env.example missing
    set /a failed+=1
)

REM Check frontend
echo.
echo Checking frontend...
cd ..\frontend 2>nul
if exist "node_modules" (
    echo [OK] Frontend node_modules exists
    set /a passed+=1
) else (
    echo [FAIL] Frontend node_modules missing
    set /a failed+=1
)

if exist "package.json" (
    echo [OK] Frontend package.json exists
    set /a passed+=1
) else (
    echo [FAIL] Frontend package.json missing
    set /a failed+=1
)

npm run build >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Frontend builds successfully
    set /a passed+=1
) else (
    echo [FAIL] Frontend build failed
    set /a failed+=1
)

if exist ".env.example" (
    echo [OK] Frontend .env.example exists
    set /a passed+=1
) else (
    echo [FAIL] Frontend .env.example missing
    set /a failed+=1
)

REM Check documentation
echo.
echo Checking documentation...
cd .. 2>nul
if exist "README.md" (
    echo [OK] README.md exists
    set /a passed+=1
) else (
    echo [FAIL] README.md missing
    set /a failed+=1
)

if exist "QUICK_START.md" (
    echo [OK] QUICK_START.md exists
    set /a passed+=1
) else (
    echo [FAIL] QUICK_START.md missing
    set /a failed+=1
)

if exist "backend\SETUP_GUIDE.md" (
    echo [OK] SETUP_GUIDE.md exists
    set /a passed+=1
) else (
    echo [FAIL] SETUP_GUIDE.md missing
    set /a failed+=1
)

if exist "frontend\ENHANCEMENT_GUIDE.md" (
    echo [OK] ENHANCEMENT_GUIDE.md exists
    set /a passed+=1
) else (
    echo [FAIL] ENHANCEMENT_GUIDE.md missing
    set /a failed+=1
)

if exist "INDEX.md" (
    echo [OK] INDEX.md exists
    set /a passed+=1
) else (
    echo [FAIL] INDEX.md missing
    set /a failed+=1
)

REM Summary
echo.
echo ================================
echo Verification Summary
echo ================================
echo Passed: !passed!
echo Failed: !failed!

if !failed! equ 0 (
    echo.
    echo [SUCCESS] All checks passed!
    echo Ready to start development.
    exit /b 0
) else (
    echo.
    echo [ERROR] Some checks failed
    echo Please fix the issues before starting.
    exit /b 1
)
