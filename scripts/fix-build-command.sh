#!/bin/bash

API_KEY="rnd_AYSplfnvjpy6HQVoOzM5ByaSr5de"
SERVICE_ID="srv-d7550ofpm1nc7398nt5g"

echo "Updating build command..."

curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"serviceDetails":{"envSpecificDetails":{"buildCommand":"npm install && npx prisma generate && npm run build","startCommand":"npm run start:prod"}}}'

echo ""
echo "Triggering new deployment..."

curl -X POST "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "clear"}'

echo ""
echo "✅ Done! Check deployment at:"
echo "   https://dashboard.render.com/web/$SERVICE_ID"