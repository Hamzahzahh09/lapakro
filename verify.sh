#!/bin/bash

# LapakRo - Verification Script
# Verifikasi bahwa semua setup sudah benar

echo "================================"
echo "LapakRo - Project Verification"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $1"
        ((failed++))
    fi
}

# Check Node.js
echo "Checking environment..."
node --version > /dev/null 2>&1
check "Node.js installed"

npm --version > /dev/null 2>&1
check "npm installed"

# Check backend
echo ""
echo "Checking backend..."
cd backend 2>/dev/null
[ -d "node_modules" ]
check "Backend node_modules exists"

[ -f "package.json" ]
check "Backend package.json exists"

npm run build > /dev/null 2>&1
check "Backend builds successfully"

[ -f ".env.example" ]
check "Backend .env.example exists"

# Check frontend
echo ""
echo "Checking frontend..."
cd ../frontend 2>/dev/null
[ -d "node_modules" ]
check "Frontend node_modules exists"

[ -f "package.json" ]
check "Frontend package.json exists"

npm run build > /dev/null 2>&1
check "Frontend builds successfully"

[ -f ".env.example" ]
check "Frontend .env.example exists"

# Check documentation
echo ""
echo "Checking documentation..."
cd .. 2>/dev/null
[ -f "README.md" ]
check "README.md exists"

[ -f "QUICK_START.md" ]
check "QUICK_START.md exists"

[ -f "SETUP_GUIDE.md" ]
check "SETUP_GUIDE.md exists (root)"

[ -f "backend/SETUP_GUIDE.md" ]
check "SETUP_GUIDE.md exists (backend)"

[ -f "frontend/ENHANCEMENT_GUIDE.md" ]
check "ENHANCEMENT_GUIDE.md exists"

[ -f "INDEX.md" ]
check "INDEX.md exists"

# Summary
echo ""
echo "================================"
echo "Verification Summary"
echo "================================"
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"

if [ $failed -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo "Ready to start development."
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some checks failed${NC}"
    echo "Please fix the issues before starting."
    exit 1
fi
