#!/usr/bin/env bash
set -euo pipefail

echo "=============================="
echo "HomeProjectIQ — Product Autopilot"
echo "=============================="
echo ""

# Step 1: Install
echo "[1/5] Installing dependencies..."
npm ci --silent

# Step 2: Lint
echo "[2/5] Running lint..."
npm run lint --if-present 2>&1 || echo "⚠️  Lint issues found"

# Step 3: Type check
echo "[3/5] Running TypeScript check..."
npm run type-check 2>&1 || { echo "❌ TypeScript errors found"; exit 1; }

# Step 4: Tests
echo "[4/5] Running tests..."
npm test 2>&1 || { echo "❌ Test failures found"; exit 1; }

# Step 5: Build
echo "[5/5] Running production build..."
npm run build 2>&1 || { echo "❌ Build failed"; exit 1; }

echo ""
echo "=============================="
echo "✅ All validations passed"
echo "=============================="
echo ""
echo "Next step: Run AI autopilot review against changed files."
echo "Report will be written to .ai/reports/latest-autopilot-report.md"
