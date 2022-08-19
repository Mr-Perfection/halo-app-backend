#!/bin/bash
val=$(node scripts/getDBUrl.js)
# echo "set-db-url.sh returns: $val" 
echo "DATABASE_URL=$val" >> .env