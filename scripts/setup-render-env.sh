#!/bin/bash

# Render API configuration
API_KEY="rnd_AYSplfnvjpy6HQVoOzM5ByaSr5de"
SERVICE_ID="srv-d7550ofpm1nc7398nt5g"
API_URL="https://api.render.com/v1"

# Database connection
DATABASE_URL="postgresql://gymsite_db_user:CnhQPUOfue38dwPnIy1IVMI0janjrCkq@dpg-d754u9npm1nc7398m8eg-a.oregon-postgres.render.com:5432/gymsite_db"

# JWT secrets (generated randomly)
JWT_SECRET="xK9mP3nQ7vR5tY8wZ2aB4cD6eF1gH0jL"
REFRESH_TOKEN_SECRET="aZ3bY5cX7dW9eV1fU4gT6hS8iR0jK2mN"

echo "Setting up environment variables for Render service..."

# Function to add environment variable
add_env_var() {
    local key=$1
    local value=$2

    echo "Adding $key..."
    curl -X PUT "$API_URL/services/$SERVICE_ID/env-vars/$key" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"value\": \"$value\"}"
    echo ""
}

# Add all environment variables
add_env_var "NODE_ENV" "production"
add_env_var "PORT" "3001"
add_env_var "DATABASE_URL" "$DATABASE_URL"
add_env_var "JWT_SECRET" "$JWT_SECRET"
add_env_var "JWT_EXPIRES_IN" "15m"
add_env_var "REFRESH_TOKEN_SECRET" "$REFRESH_TOKEN_SECRET"
add_env_var "CORS_ORIGIN" "https://gymplannerworkout.netlify.app"

echo "✅ Environment variables configured!"
echo "🚀 Triggering deployment..."

# Trigger a new deployment
curl -X POST "$API_URL/services/$SERVICE_ID/deploys" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"clearCache": "clear"}'

echo ""
echo "✨ Deployment triggered! Check status at:"
echo "   https://dashboard.render.com/web/$SERVICE_ID"