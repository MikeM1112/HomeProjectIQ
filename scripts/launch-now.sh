#!/usr/bin/env bash
set -euo pipefail

echo "=============================="
echo "HomeProjectIQ — Launch Sequence"
echo "=============================="
echo ""

REPORT=".ai/reports/latest-launch-report.md"
DATE=$(date +%Y-%m-%d)

# Initialize report
cat > "$REPORT" <<EOF
# Launch Report — $DATE

## Pre-Deploy
| Check | Status | Notes |
|-------|--------|-------|
EOF

run_check() {
  local name="$1"
  local cmd="$2"
  echo "[$name] Running..."
  if eval "$cmd" > /dev/null 2>&1; then
    echo "| $name | PASS | |" >> "$REPORT"
    echo "  ✅ $name passed"
  else
    echo "| $name | FAIL | See logs |" >> "$REPORT"
    echo "  ❌ $name failed"
    return 1
  fi
}

run_check "Install" "npm ci --silent"
run_check "Lint" "npm run lint --if-present"
run_check "TypeScript" "npm run type-check"
run_check "Tests" "npm test"
run_check "Build" "npm run build"

# Git status check
if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
  echo "| Git Clean | PASS | |" >> "$REPORT"
  echo "  ✅ Git working tree clean"
else
  echo "| Git Clean | WARN | Uncommitted changes |" >> "$REPORT"
  echo "  ⚠️  Uncommitted changes detected"
fi

echo "" >> "$REPORT"
echo "## Launch Recommendation" >> "$REPORT"
echo "All automated checks passed. Ready for manual review and deploy." >> "$REPORT"

echo ""
echo "=============================="
echo "✅ Pre-deploy checks complete"
echo "Report: $REPORT"
echo "=============================="
