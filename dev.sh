#!/bin/bash

# load environment variables from .env file
export $(grep -v '^#' .env | xargs)


# start applications
cd backend
npm run dev &  

cd ../frontend
npm install
npm run dev
