#!/bin/bash
# ============================================
# Failover Test - Verifies LB handles instance failure
# ============================================

echo "🧪 Failover Test"
echo "================================================"

echo "1. Checking all instances are healthy..."
for i in 1 2 3; do
  STATUS=$(docker compose exec app$i curl -s http://localhost/api/v1/health | head -1)
  echo "   app$i: $STATUS"
done

echo ""
echo "2. Stopping app2..."
docker compose stop app2

echo ""
echo "3. Sending requests (should route to app1 and app3 only)..."
for i in $(seq 1 10); do
  INSTANCE=$(curl -s http://localhost:8000/api/v1/health | jq -r '.instance')
  echo "   Request $i → $INSTANCE"
done

echo ""
echo "4. Restarting app2..."
docker compose start app2
sleep 5

echo ""
echo "5. Verifying app2 is back..."
for i in $(seq 1 6); do
  INSTANCE=$(curl -s http://localhost:8000/api/v1/health | jq -r '.instance')
  echo "   Request $i → $INSTANCE"
done

echo ""
echo "✅ Failover test complete!"
