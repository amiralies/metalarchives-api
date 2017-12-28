#!/bin/sh 

if [[ -z "${DB_CATCH}" ]]; then
  DB_CATCH=true
else
  DB_CATCH="${DB_CATCH}"
fi

if $DB_CATCH; then
  sleep 1s && npm run catchDB & pm2-docker --format process.json
else
  sleep 1s && pm2-docker --format process.json
fi
