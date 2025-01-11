#!/bin/bash

# load environment variables from .env file
export $(grep -v '^#' .env | xargs)

set -e

echo "Building frontend application..."
cd frontend
npm install
npm install --save-dev @types/react @types/react-dom
npm run build
cd ..

echo "Frontend build complete!"

echo "Moving frontend build to backend public directory..."
rm -rf backend/public/*
cp -r frontend/dist/* backend/public/

echo "Building backend application..."
cd backend
npm install
node ace build --ignore-ts-errors
cd ..

echo "Backend build complete!"
echo "Build process finished successfully!"
