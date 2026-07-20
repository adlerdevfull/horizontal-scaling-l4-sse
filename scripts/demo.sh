#!/bin/bash
# Demo: Escalabilidade Horizontal com Load Balancer L4 + SSE
# Uso: ./scripts/demo.sh

echo "=== horizontal-scaling-l4-sse ==="
echo ""

echo "1. Health Check (via LB - port 8000)"
curl -s http://localhost:8000/api/v1/health | jq .
echo ""

echo "2. Verificar distribución del LB (5 requests)"
for i in $(seq 1 5); do
  INSTANCE=$(curl -s http://localhost:8000/api/v1/health | jq -r '.instance // .source_instance // "unknown"')
  echo "   Request $i → $INSTANCE"
done
echo ""

echo "3. Login"
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@platform.test","password":"password"}' | jq -r '.token // .access_token')
echo "   Token: ${TOKEN:0:30}..."
echo ""

echo "4. Dispatch Event (via LB)"
curl -s -X POST http://localhost:8000/api/v1/events/dispatch \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"deploy","payload":{"service":"api","version":"2.1.0"}}' | jq .
echo ""

echo "5. Recent Events"
curl -s http://localhost:8000/api/v1/events/recent \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
echo ""

echo "6. SSE via dedicated port 8001 (5s sample)"
timeout 5 curl -s -N http://localhost:8001/api/v1/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: text/event-stream" 2>/dev/null || true
echo ""
echo "   (Stream cerrado después de 5s)"
echo ""

echo "=== Demo completada ==="
echo ""
echo "Otros scripts disponibles:"
echo "  ./scripts/load-test.sh     - Test de carga con conexiones concurrentes"
echo "  ./scripts/failover-test.sh - Test de failover (parar instancia)"
