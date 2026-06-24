#!/usr/bin/env bash
set -e

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "=== TEST CLIENT PATH ==="
echo "BASE_URL=$BASE_URL"

echo
echo "1) POST /api/client-questionnaire"

RESPONSE="$(curl -sS -X POST "$BASE_URL/api/client-questionnaire" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Restaurant Client",
    "business_name":"Test Restaurant Client",
    "email":"test-client@example.com",
    "business_type":"restaurant",
    "language":"ru",
    "phone":"+491111111111",
    "telegram":"",
    "whatsapp":"",
    "address":"München",
    "website":"",
    "logo":"assets/logo.png",
    "currency":"EUR",
    "plan_id":"free",
    "plan":"Free",
    "amount":0,
    "payment_status":"FREE",
    "terms_accepted":true,
    "privacy_accepted":true,
    "working_hours":{
      "monday":"09:00-18:00",
      "tuesday":"09:00-18:00",
      "wednesday":"09:00-18:00",
      "thursday":"09:00-18:00",
      "friday":"09:00-18:00"
    },
    "social_links":{
      "instagram":"",
      "facebook":"",
      "tiktok":""
    },
    "business_questions":{}
  }')"

echo "$RESPONSE" | tee output/test_client_response.json

CLIENT_ID="$(node -e "const r=require('./output/test_client_response.json'); console.log(r.clientId || '')")"
REDIRECT_URL="$(node -e "const r=require('./output/test_client_response.json'); console.log(r.redirectUrl || '')")"

echo
echo "CLIENT_ID=$CLIENT_ID"
echo "REDIRECT_URL=$REDIRECT_URL"

if [ -z "$CLIENT_ID" ]; then
  echo "FAIL: clientId not returned"
  exit 1
fi

echo
echo "2) Check local manifest file"

MANIFEST_FILE="data/manifests/$CLIENT_ID.json"

if [ ! -f "$MANIFEST_FILE" ]; then
  echo "FAIL: manifest file not found: $MANIFEST_FILE"
  exit 1
fi

node -e "
const fs=require('fs');
const m=JSON.parse(fs.readFileSync('$MANIFEST_FILE','utf8'));
console.log({
  businessName:m.businessName,
  businessType:m.businessType || m.business_type,
  language:m.language,
  pages:m.pages,
  hasDemoData:!!m.demoData,
  hasScenario:!!m.scenario,
  hasTheme:!!m.theme,
  heroPhoto:m.heroPhoto
});
"

echo
echo "3) GET /api/manifest/$CLIENT_ID"

curl -sS "$BASE_URL/api/manifest/$CLIENT_ID" | tee output/test_manifest_api.json >/dev/null

node -e "
const m=require('./output/test_manifest_api.json');
if(!m || Object.keys(m).length===0){ throw new Error('manifest API empty'); }
console.log('PASS manifest API:', {
  businessName:m.businessName,
  businessType:m.businessType || m.business_type,
  language:m.language
});
"

echo
echo "4) Check redirect URL"

if [ -z "$REDIRECT_URL" ]; then
  echo "FAIL: redirectUrl empty"
  exit 1
fi

echo "$REDIRECT_URL" | grep -q "clientId=$CLIENT_ID" \
  && echo "PASS redirectUrl contains clientId" \
  || { echo "FAIL redirectUrl does not contain clientId"; exit 1; }

echo
echo "5) Check MVP runtime App.jsx"

grep -n "VITE_MANIFEST_API_BASE\|/api/manifest/\|applyManifestConfig\|clientId" \
  artifacts/factory_output/react_mvp/src/App.jsx \
  | tee output/test_app_runtime_grep.txt

echo
echo "6) Check built template contains manifest runtime"

grep -R "api/manifest" -n mvp-template/dist artifacts/factory_output/react_mvp/dist 2>/dev/null \
  | tee output/test_dist_manifest_grep.txt || true

if [ ! -s output/test_dist_manifest_grep.txt ]; then
  echo "WARNING: built dist may be old or missing manifest loader"
else
  echo "PASS dist contains manifest loader"
fi

echo
echo "=== RESULT ==="
echo "CLIENT_ID=$CLIENT_ID"
echo "MANIFEST_FILE=$MANIFEST_FILE"
echo "MANIFEST_API=$BASE_URL/api/manifest/$CLIENT_ID"
echo "REDIRECT_URL=$REDIRECT_URL"
