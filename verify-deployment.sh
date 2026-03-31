#!/bin/bash

echo "🔍 Deployment Verification Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="https://gymsite-backend.onrender.com"
FRONTEND_URL="https://gymplannerworkout.netlify.app"

echo "1. Testing Backend Health..."
echo "   URL: $BACKEND_URL/health"
backend_response=$(curl -s -w "\n%{http_code}" $BACKEND_URL/health)
http_code=$(echo "$backend_response" | tail -n1)
response_body=$(echo "$backend_response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "   ${GREEN}✅ Backend is running!${NC}"
    echo "   Response: $response_body"
else
    echo -e "   ${RED}❌ Backend not responding (HTTP $http_code)${NC}"
    echo -e "   ${YELLOW}Note: Render free tier sleeps after 15 min. First request takes 30-60s.${NC}"
    echo "   Retrying in 30 seconds..."
    sleep 30
    backend_response=$(curl -s $BACKEND_URL/health)
    if [[ $backend_response == *"ok"* ]]; then
        echo -e "   ${GREEN}✅ Backend woke up successfully!${NC}"
    else
        echo -e "   ${RED}Backend still not responding. Check Render dashboard.${NC}"
    fi
fi

echo ""
echo "2. Testing Frontend..."
echo "   URL: $FRONTEND_URL"
frontend_response=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)

if [ "$frontend_response" = "200" ]; then
    echo -e "   ${GREEN}✅ Frontend is accessible!${NC}"
else
    echo -e "   ${RED}❌ Frontend not responding (HTTP $frontend_response)${NC}"
    echo "   Check Netlify dashboard for deployment status"
fi

echo ""
echo "3. Testing API Endpoints..."

# Test auth endpoint
echo "   Testing /api/auth endpoint..."
auth_response=$(curl -s -X GET -w "\n%{http_code}" $BACKEND_URL/api/auth)
auth_code=$(echo "$auth_response" | tail -n1)

if [ "$auth_code" = "404" ] || [ "$auth_code" = "405" ] || [ "$auth_code" = "401" ]; then
    echo -e "   ${GREEN}✅ Auth endpoint exists${NC}"
elif [ "$auth_code" = "200" ] || [ "$auth_code" = "201" ]; then
    echo -e "   ${GREEN}✅ Auth endpoint responding${NC}"
else
    echo -e "   ${YELLOW}⚠️  Auth endpoint returned: $auth_code${NC}"
fi

echo ""
echo "4. Checking CORS Configuration..."
cors_response=$(curl -s -I -X OPTIONS \
    -H "Origin: https://gymplannerworkout.netlify.app" \
    -H "Access-Control-Request-Method: GET" \
    $BACKEND_URL/api/auth 2>/dev/null | grep -i "access-control-allow-origin")

if [[ $cors_response == *"gymplannerworkout.netlify.app"* ]]; then
    echo -e "   ${GREEN}✅ CORS properly configured${NC}"
else
    echo -e "   ${RED}❌ CORS not configured for frontend${NC}"
    echo "   Ensure CORS_ORIGIN env var is set in Render"
fi

echo ""
echo "=================================="
echo "📋 Summary:"
echo ""

# Final summary
all_good=true

if [[ $backend_response == *"ok"* ]]; then
    echo -e "${GREEN}✅ Backend: Running${NC}"
else
    echo -e "${RED}❌ Backend: Not responding${NC}"
    all_good=false
fi

if [ "$frontend_response" = "200" ]; then
    echo -e "${GREEN}✅ Frontend: Accessible${NC}"
else
    echo -e "${RED}❌ Frontend: Not accessible${NC}"
    all_good=false
fi

if [[ $cors_response == *"gymplannerworkout.netlify.app"* ]]; then
    echo -e "${GREEN}✅ CORS: Configured${NC}"
else
    echo -e "${YELLOW}⚠️  CORS: May need configuration${NC}"
fi

echo ""
if $all_good; then
    echo -e "${GREEN}🎉 Your app is fully deployed and working!${NC}"
    echo "Visit: $FRONTEND_URL"
else
    echo -e "${YELLOW}⚠️  Some components need attention. Check the logs above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. If backend not responding: Wait for Render deployment or wake from sleep"
    echo "2. If frontend not accessible: Check Netlify deployment status"
    echo "3. If CORS issues: Update CORS_ORIGIN in Render environment variables"
fi