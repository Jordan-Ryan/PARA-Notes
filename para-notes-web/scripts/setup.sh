#!/bin/bash

# PARA Notes Web Application Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 Setting up PARA Notes Web Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp env.template .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
    echo "   You can get them from: https://supabase.com/dashboard"
else
    echo "✅ Environment file already exists"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI already installed"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Update .env.local with your Supabase credentials"
echo "2. Start Supabase locally: npm run supabase:start"
echo "3. Run database migrations: npm run supabase:db:push"
echo "4. Generate types: npm run supabase:gen:types"
echo "5. Start development server: npm run dev"
echo ""
echo "📚 For more information, see the README.md file"
echo "🔗 Open http://localhost:3000 in your browser when ready"
