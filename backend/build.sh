#!/bin/bash
# Build script for Render deployment
# This script builds the frontend and prepares static files

set -e

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Building frontend..."
npm run build

echo "Moving build files to backend templates..."
mkdir -p ../backend/templates
cp -r dist/* ../backend/templates/

echo "Collecting static files..."
cd ../backend
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate

echo "Build complete!"
