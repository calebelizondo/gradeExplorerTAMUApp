#!/bin/bash

export $(grep -v '^#' .env | xargs)

set -e
cd backend/build
npm ci --omit="dev"
node bin/server.js    