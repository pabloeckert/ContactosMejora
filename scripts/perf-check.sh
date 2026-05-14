#!/bin/bash
# Performance budget checker
set -e

echo "🔍 Checking build size..."

MAX_INDEX_KB=500
MAX_TOTAL_KB=2000

INDEX_SIZE=$(find dist -name "index-*.js" -exec stat -c%s {} \; 2>/dev/null | head -1 || echo "0")
INDEX_KB=$((INDEX_SIZE / 1024))

TOTAL_KB=0
while IFS= read -r file; do
  SIZE=$(stat -c%s "$file" 2>/dev/null || echo "0")
  TOTAL_KB=$((TOTAL_KB + SIZE / 1024))
done < <(find dist -type f \( -name "*.js" -o -name "*.css" \))

echo "📦 index.js: ${INDEX_KB}KB (max: ${MAX_INDEX_KB}KB)"
echo "📦 Total JS+CSS: ${TOTAL_KB}KB (max: ${MAX_TOTAL_KB}KB)"

if [ "$INDEX_KB" -gt "$MAX_INDEX_KB" ]; then
  echo "❌ FAIL: index.js exceeds budget (${INDEX_KB}KB > ${MAX_INDEX_KB}KB)"
  exit 1
fi

if [ "$TOTAL_KB" -gt "$MAX_TOTAL_KB" ]; then
  echo "❌ FAIL: Total size exceeds budget (${TOTAL_KB}KB > ${MAX_TOTAL_KB}KB)"
  exit 1
fi

echo "✅ Performance budget OK"
