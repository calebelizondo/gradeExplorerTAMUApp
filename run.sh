#!/bin/bash

# Check if venv folder exists, if not create one
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Run Django
echo "Starting Django development server..."
source venv/Scripts/activate
pip install -r requirements.txt
python manage.py runserver &

# Run React
echo "Starting React development server..."
cd frontend
npm install
npm run start