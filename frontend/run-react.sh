#!/bin/bash
echo "Starting Myanmar Earthquake Alert System..."
echo ""
echo "Setting NODE_OPTIONS environment variable..."
export NODE_OPTIONS="--openssl-legacy-provider"

echo "Starting React development server..."
npm start
