FROM node:carbon-alpine

WORKDIR /var/www/metalarchives-api
COPY package*.json ./
RUN npm install -g pm2 
RUN npm install
COPY . .
CMD sleep 1s && npm run catchDB & pm2-docker --format process.json
EXPOSE 3000
