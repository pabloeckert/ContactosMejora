#!/bin/bash
# Uptime check for MejoraContactos
# Run via cron: */5 * * * * /path/to/uptime-check.sh
# Or use OpenClaw cron job

URL="https://util.mejoraok.com/mejoracontactos/health.json"
TIMEOUT=10
EXPECTED_STATUS="ok"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL" 2>/dev/null)
BODY=$(curl -s --max-time $TIMEOUT "$URL" 2>/dev/null)
STATUS=$(echo "$BODY" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$RESPONSE" != "200" ]; then
  echo "🔴 ALERT: MejoraContactos DOWN — HTTP $RESPONSE"
  exit 1
fi

if [ "$STATUS" != "$EXPECTED_STATUS" ]; then
  echo "🟡 WARNING: MejoraContactos status=$STATUS (expected=$EXPECTED_STATUS)"
  exit 1
fi

echo "✅ MejoraContactos OK — HTTP $RESPONSE, status=$STATUS"
exit 0
