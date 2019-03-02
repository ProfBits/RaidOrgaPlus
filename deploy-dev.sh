#!/bin/sh
git reset --hard
git pull
npm run install
npm run serve

screen -S backend-dev -X quit
screen -d -m -S backend-dev bash -c 'cd backend && nodejs app.js'

screen -S frontend-dev -X quit
screen -d -m -S frontend-dev bash -c 'cd frontend && serve dist'