#!/bin/bash
# ============================================
# Load Test Script - Simulates concurrent SSE connections
# Requires: curl, jq
# Usage: ./scripts/load-test.sh [connections] [duration_seconds]
# ============================================

CONNECTIONS=${1:-100}
DURATION=${2:-30}
BASE_URL="http://localhost:8000/api/v1"
SSE_URL="http://localhost:8001/api/v1"

echo "🔧 Registering test user..."
REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"LoadTest","email":"load@test.com","password":"password123"}')

TOKEN=$(echo $REGISTER | jq -r '.data.token // empty')

if [ -z "$TOKEN" ]; then
  echo "Trying login..."
  LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"load@test.com","password":"password123"}')
  TOKEN=$(echo $LOGIN | jq -r '.data.token')
fi

echo "✅ Token obtained"
echo ""
echo "🚀 Starting load test: $CONNECTIONS connections for ${DURATION}s"
echo "================================================"

# Track PIDs
PIDS=()

# Start SSE connections
for i in $(seq 1 $CONNECTIONS); do
  curl -s -N -H "Authorization: Bearer $TOKEN" \
    "$SSE_URL/events" > /dev/null 2>&1 &
  PIDS+=($!)

  if [ $((i % 50)) -eq 0 ]; then
    echo "  Started $i connections..."
  fi
done

echo "✅ All $CONNECTIONS connections established"
echo ""

# Dispatch events during the test
echo "📤 Dispatching events..."
for i in $(seq 1 20); do
  curl -s -X POST "$BASE_URL/events/dispatch" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"order.updated\",\"data\":{\"order_id\":$i,\"status\":\"paid\"}}" > /dev/null &
  sleep 1
done

# Wait for duration
echo "⏳ Waiting ${DURATION}s..."
sleep $DURATION

# Check health of all instances
echo ""
echo "🏥 Health check:"
curl -s "$BASE_URL/health" | jq .
echo ""

# Kill all connections
echo "🛑 Closing connections..."
for pid in "${PIDS[@]}"; do
  kill $pid 2>/dev/null
done

wait 2>/dev/null

echo ""
echo "✅ Load test complete!"
echo "================================================"
echo "Connections: $CONNECTIONS"
echo "Duration: ${DURATION}s"
echo "Events dispatched: 20"
