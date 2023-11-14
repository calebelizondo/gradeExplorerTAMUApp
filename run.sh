#!/bin/bash

# Run Django
echo "Starting Django development server..."
source venv/Scripts/activate
pip install -r requirements.txt
python app/manage.py runserver &

# Run React
echo "Starting React development server..."
cd frontend
npm install
npm run start