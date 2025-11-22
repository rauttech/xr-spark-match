#!/bin/bash

echo "🚀 Setting up XR Spark Match..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in your PATH."
    echo "👉 Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed."
fi

# Run the app
echo "🔮 Starting XR Spark Match..."
echo "👉 Open the URL below in your Meta Quest Browser (ensure HTTPS is accepted)"
npm run dev
