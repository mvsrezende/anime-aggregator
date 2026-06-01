#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
TEST_USER_EMAIL="${TEST_USER_EMAIL:-smoke-test@local.dev}"
TEST_USER_PASSWORD="${TEST_USER_PASSWORD:-123456}"

echo "==> Backend health"
curl -fsS "$BASE_URL/health" >/dev/null
echo "OK"

echo "==> Frontend home should be reachable"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$FRONTEND_STATUS" != "200" ]; then
  echo "Frontend não respondeu com 200. HTTP: $FRONTEND_STATUS"
  exit 1
fi
echo "OK"

echo "==> Register user (201 or 409)"
REGISTER_STATUS=$(curl -s -o /tmp/register_response.json -w "%{http_code}" \
  -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_USER_EMAIL\",
    \"password\": \"$TEST_USER_PASSWORD\"
  }")

if [ "$REGISTER_STATUS" != "201" ] && [ "$REGISTER_STATUS" != "409" ]; then
  echo "Falha no register. HTTP: $REGISTER_STATUS"
  cat /tmp/register_response.json
  exit 1
fi
echo "OK"

echo "==> Login should return token"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_USER_EMAIL\",
    \"password\": \"$TEST_USER_PASSWORD\"
  }")

LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)

if [ "$LOGIN_STATUS" != "200" ]; then
  echo "Falha no login. HTTP: $LOGIN_STATUS"
  echo "$LOGIN_BODY"
  exit 1
fi

ACCESS_TOKEN=$(echo "$LOGIN_BODY" | jq -r '.access_token')
if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
  echo "Token JWT não retornado no login"
  exit 1
fi
echo "OK"

echo "==> Auth /me should return current user"
ME_EMAIL=$(curl -fsS "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.email')

if [ "$ME_EMAIL" != "$TEST_USER_EMAIL" ]; then
  echo "Esperava email $TEST_USER_EMAIL em /auth/me, mas recebi: $ME_EMAIL"
  exit 1
fi
echo "OK"

echo "==> Search"
SEARCH_COUNT=$(curl -fsS "$BASE_URL/animes/search?q=naruto&page=1&limit=3" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.items | length')

if [ "$SEARCH_COUNT" -lt 1 ]; then
  echo "Search retornou 0 itens"
  exit 1
fi
echo "OK"

echo "==> Get by ID"
ANIME_ID=$(curl -fsS "$BASE_URL/animes/20" | jq '.id')
if [ "$ANIME_ID" != "20" ]; then
  echo "Esperava anime id 20, mas recebi: $ANIME_ID"
  exit 1
fi
echo "OK"

echo "==> Top"
TOP_COUNT=$(curl -fsS "$BASE_URL/animes/top/list?page=1&limit=3" | jq '.items | length')
if [ "$TOP_COUNT" -lt 1 ]; then
  echo "Top retornou 0 itens"
  exit 1
fi
echo "OK"

echo "==> Cleanup previous favorite if exists"
EXISTING_FAVORITE_ID=$(curl -fsS "$BASE_URL/favorites" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.[] | select(.anime_id == 20) | .id' | head -n1 || true)

if [ -n "${EXISTING_FAVORITE_ID:-}" ]; then
  curl -fsS -X DELETE "$BASE_URL/favorites/$EXISTING_FAVORITE_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" >/dev/null
fi
echo "OK"

echo "==> Create favorite"
CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/favorites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "anime_id": 20,
    "anime_source": "jikan",
    "title": "Naruto",
    "title_japanese": "ナルト",
    "image": "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    "score": 8.01,
    "anime_url": "https://myanimelist.net/anime/20/Naruto"
  }')

CREATE_BODY=$(echo "$CREATE_RESPONSE" | head -n1)
CREATE_STATUS=$(echo "$CREATE_RESPONSE" | tail -n1)

if [ "$CREATE_STATUS" != "201" ]; then
  echo "Falha ao criar favorito. HTTP: $CREATE_STATUS"
  echo "$CREATE_BODY"
  exit 1
fi

FAVORITE_ID=$(echo "$CREATE_BODY" | jq '.id')
if [ -z "$FAVORITE_ID" ] || [ "$FAVORITE_ID" = "null" ]; then
  echo "Não foi possível obter o favorite_id"
  exit 1
fi
echo "OK"

echo "==> Duplicate favorite should return 409"
DUPLICATE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/favorites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "anime_id": 20,
    "anime_source": "jikan",
    "title": "Naruto",
    "title_japanese": "ナルト",
    "image": "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    "score": 8.01,
    "anime_url": "https://myanimelist.net/anime/20/Naruto"
  }')

if [ "$DUPLICATE_STATUS" != "409" ]; then
  echo "Esperava 409 no duplicado, mas recebi: $DUPLICATE_STATUS"
  exit 1
fi
echo "OK"

echo "==> List favorites"
LIST_COUNT=$(curl -fsS "$BASE_URL/favorites" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq 'length')

if [ "$LIST_COUNT" -lt 1 ]; then
  echo "Esperava ao menos 1 favorito"
  exit 1
fi
echo "OK"

echo "==> Delete favorite"
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/favorites/$FAVORITE_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if [ "$DELETE_STATUS" != "204" ]; then
  echo "Falha ao deletar favorito. HTTP: $DELETE_STATUS"
  exit 1
fi
echo "OK"

echo "==> Confirm favorites empty for anime 20"
FINAL_MATCH_COUNT=$(curl -fsS "$BASE_URL/favorites" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '[.[] | select(.anime_id == 20)] | length')

if [ "$FINAL_MATCH_COUNT" != "0" ]; then
  echo "Esperava 0 favoritos do anime 20 após delete, mas recebi: $FINAL_MATCH_COUNT"
  exit 1
fi
echo "OK"

echo "==> Search history should record searches"
curl -fsS "$BASE_URL/animes/search?q=death%20note&page=1&limit=2" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >/dev/null

HISTORY_COUNT=$(curl -fsS "$BASE_URL/search-history?limit=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq 'length')

if [ "$HISTORY_COUNT" -lt 1 ]; then
  echo "Esperava ao menos 1 item no search-history"
  exit 1
fi
echo "OK"

echo "==> Search history latest query should match"
LATEST_QUERY=$(curl -fsS "$BASE_URL/search-history?limit=1" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.[0].query')

if [ "$LATEST_QUERY" != "death note" ]; then
  echo "Esperava 'death note' como última busca, mas recebi: $LATEST_QUERY"
  exit 1
fi
echo "OK"

echo "==> Delete latest search history item"
LATEST_HISTORY_ID=$(curl -fsS "$BASE_URL/search-history?limit=1" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.[0].id')

DELETE_HISTORY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE "$BASE_URL/search-history/$LATEST_HISTORY_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if [ "$DELETE_HISTORY_STATUS" != "204" ]; then
  echo "Falha ao deletar item do histórico. HTTP: $DELETE_HISTORY_STATUS"
  exit 1
fi
echo "OK"

echo "==> Cache should MISS then HIT"
docker exec -i anime_db psql -U anime -d anime \
  -c "DELETE FROM anime_cache WHERE anime_id = 5114 AND source = 'jikan';" >/dev/null

FIRST_CACHE=$(curl -i -s "$BASE_URL/animes/5114" | tr -d '\r' | grep -i '^x-cache:' | awk '{print $2}')
SECOND_CACHE=$(curl -i -s "$BASE_URL/animes/5114" | tr -d '\r' | grep -i '^x-cache:' | awk '{print $2}')

if [ "$FIRST_CACHE" != "MISS" ]; then
  echo "Esperava MISS na primeira chamada, mas recebi: $FIRST_CACHE"
  exit 1
fi

if [ "$SECOND_CACHE" != "HIT" ]; then
  echo "Esperava HIT na segunda chamada, mas recebi: $SECOND_CACHE"
  exit 1
fi
echo "OK"

echo "==> Legacy header fallback should still work"
LEGACY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/favorites" \
  -H "X-User-Email: legacy-smoke@local.dev")

if [ "$LEGACY_STATUS" != "200" ]; then
  echo "Fallback por X-User-Email falhou. HTTP: $LEGACY_STATUS"
  exit 1
fi
echo "OK"

echo "✅ Full smoke test passed"