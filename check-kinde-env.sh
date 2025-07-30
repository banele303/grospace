#!/bin/bash

# Script to check and fix Kinde environment variables

echo "=== Kinde Environment Variable Checker ==="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ No .env file found. Creating one from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
    else
        echo "❌ No .env.example file found either. Creating a basic .env file..."
        cat > .env << EOF
# Kinde Auth Configuration
KINDE_CLIENT_ID=your_client_id_here
KINDE_CLIENT_SECRET=your_client_secret_here
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Database
DATABASE_URL="your_database_url_here"
EOF
        echo "✅ Created basic .env file"
    fi
fi

echo ""
echo "=== Current Kinde Configuration ==="

# Check each required variable
check_var() {
    local var_name=$1
    local var_value=$(grep "^${var_name}=" .env 2>/dev/null | cut -d'=' -f2- | tr -d '"')
    
    if [ -z "$var_value" ] || [ "$var_value" = "your_${var_name,,}_here" ]; then
        echo "❌ $var_name: Not set or using placeholder"
        return 1
    else
        echo "✅ $var_name: $var_value"
        return 0
    fi
}

# Check all required variables
vars_ok=true
check_var "KINDE_CLIENT_ID" || vars_ok=false
check_var "KINDE_CLIENT_SECRET" || vars_ok=false
check_var "KINDE_ISSUER_URL" || vars_ok=false
check_var "KINDE_SITE_URL" || vars_ok=false
check_var "KINDE_POST_LOGOUT_REDIRECT_URL" || vars_ok=false
check_var "KINDE_POST_LOGIN_REDIRECT_URL" || vars_ok=false

echo ""

# Fix the problematic redirect URL if it's set to "/"
post_login_url=$(grep "^KINDE_POST_LOGIN_REDIRECT_URL=" .env 2>/dev/null | cut -d'=' -f2- | tr -d '"')
if [ "$post_login_url" = "/" ]; then
    echo "🔧 Fixing KINDE_POST_LOGIN_REDIRECT_URL from '/' to '/dashboard'..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's|KINDE_POST_LOGIN_REDIRECT_URL=/|KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard|' .env
    else
        # Linux/Windows (Git Bash)
        sed -i 's|KINDE_POST_LOGIN_REDIRECT_URL=/|KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard|' .env
    fi
    echo "✅ Fixed KINDE_POST_LOGIN_REDIRECT_URL"
fi

echo ""
if [ "$vars_ok" = true ]; then
    echo "🎉 All Kinde environment variables are configured!"
    echo "If you're still getting errors, please:"
    echo "1. Make sure your Kinde dashboard callback URLs match these settings"
    echo "2. Restart your development server: npm run dev"
else
    echo "⚠️  Please update the missing variables in your .env file with your actual Kinde values"
    echo "You can find these in your Kinde dashboard at: https://app.kinde.com/"
fi

echo ""
echo "=== Next Steps ==="
echo "1. Update .env with your actual Kinde values"
echo "2. Ensure callback URLs in Kinde dashboard include:"
echo "   - http://localhost:3000/api/auth/kinde_callback"
echo "   - Your production domain + /api/auth/kinde_callback"
echo "3. Restart development server: npm run dev"
