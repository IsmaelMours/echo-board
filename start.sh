#!/bin/bash

# EchoBoard Start Script for Railway
echo "Starting EchoBoard application..."

# Check if we're in the server directory
if [ -f "package.json" ] && [ -f "dist/index.js" ]; then
    echo "Starting server from current directory..."
    node dist/index.js
elif [ -d "server" ] && [ -f "server/dist/index.js" ]; then
    echo "Starting server from server directory..."
    cd server && node dist/index.js
else
    echo "Error: Could not find server build files"
    echo "Available files:"
    ls -la
    exit 1
fi
