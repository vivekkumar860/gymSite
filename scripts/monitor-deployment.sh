#!/bin/bash

API_KEY="rnd_AYSplfnvjpy6HQVoOzM5ByaSr5de"
SERVICE_ID="srv-d7550ofpm1nc7398nt5g"
DEPLOY_ID="dep-d758tc63jp1c739g1qg0"

echo "🚀 Monitoring Render deployment..."
echo "================================="
echo ""

while true; do
    response=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Accept: application/json")

    status=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['status'])")

    case $status in
        "build_in_progress")
            echo "🔨 Building... $(date +%H:%M:%S)"
            ;;
        "update_in_progress")
            echo "🔄 Updating... $(date +%H:%M:%S)"
            ;;
        "live")
            echo "✅ DEPLOYMENT SUCCESSFUL! $(date +%H:%M:%S)"
            echo ""
            echo "🎉 Your backend is now live at:"
            echo "   https://gymsite-backend.onrender.com"
            echo ""
            echo "📊 Check health status:"
            echo "   curl https://gymsite-backend.onrender.com/health"
            break
            ;;
        "build_failed"|"update_failed")
            echo "❌ DEPLOYMENT FAILED! $(date +%H:%M:%S)"
            echo "Check logs at: https://dashboard.render.com/web/$SERVICE_ID/logs"
            break
            ;;
        *)
            echo "📋 Status: $status $(date +%H:%M:%S)"
            ;;
    esac

    sleep 5
done