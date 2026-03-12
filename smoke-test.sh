#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"
TEST_USER_EMAIL="${TEST_USER_EMAIL:-smoke-test@local.dev}"

echo "==> Health"
curl -fsS "$BASE_URL/health" >/dev/null
echo "OK"

echo "==> Search"
SEARCH_COUNT=$(curl -fsS "$BASE_URL/animes/search?q=naruto&page=1&limit=3" | jq '.items | length')
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

echo "==> Create favorite"
CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/favorites" \
  -H "Content-Type: application/json" \
  -H "X-User-Email: $TEST_USER_EMAIL" \
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
  -H "X-User-Email: $TEST_USER_EMAIL" \
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
  -H "X-User-Email: $TEST_USER_EMAIL" | jq 'length')

if [ "$LIST_COUNT" -lt 1 ]; then
  echo "Esperava ao menos 1 favorito"
  exit 1
fi
echo "OK"

echo "==> Delete favorite"
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/favorites/$FAVORITE_ID" \
  -H "X-User-Email: $TEST_USER_EMAIL")

if [ "$DELETE_STATUS" != "204" ]; then
  echo "Falha ao deletar favorito. HTTP: $DELETE_STATUS"
  exit 1
fi
echo "OK"

echo "==> Confirm favorites empty"
FINAL_COUNT=$(curl -fsS "$BASE_URL/favorites" \
  -H "X-User-Email: $TEST_USER_EMAIL" | jq 'length')

if [ "$FINAL_COUNT" != "0" ]; then
  echo "Esperava 0 favoritos após delete, mas recebi: $FINAL_COUNT"
  exit 1
fi
echo "OK"

echo "==> Search history should record searches"
curl -fsS "$BASE_URL/animes/search?q=death%20note&page=1&limit=2" \
  -H "X-User-Email: $TEST_USER_EMAIL" >/dev/null

HISTORY_COUNT=$(curl -fsS "$BASE_URL/search-history?limit=10" \
  -H "X-User-Email: $TEST_USER_EMAIL" | jq 'length')

if [ "$HISTORY_COUNT" -lt 1 ]; then
  echo "Esperava ao menos 1 item no search-history"
  exit 1
fi
echo "OK"

echo "==> Search history latest query should match"
LATEST_QUERY=$(curl -fsS "$BASE_URL/search-history?limit=1" \
  -H "X-User-Email: $TEST_USER_EMAIL" | jq -r '.[0].query')

if [ "$LATEST_QUERY" != "death note" ]; then
  echo "Esperava 'death note' como última busca, mas recebi: $LATEST_QUERY"
  exit 1
fi
echo "OK"

echo "✅ Sprint 2 smoke test passed"