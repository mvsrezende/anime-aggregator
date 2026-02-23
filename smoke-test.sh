#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"

echo "==> Health"
curl -fsS "$BASE_URL/health" >/dev/null
echo "OK"

echo "==> Search"
curl -fsS "$BASE_URL/animes/search?q=naruto&page=1&limit=3" | jq '.items | length' >/dev/null
echo "OK"

echo "==> Get by ID"
curl -fsS "$BASE_URL/animes/20" | jq '.id' >/dev/null
echo "OK"

echo "==> Top"
curl -fsS "$BASE_URL/animes/top/list?page=1&limit=3" | jq '.items | length' >/dev/null
echo "OK"

echo "✅ Smoke test passed"