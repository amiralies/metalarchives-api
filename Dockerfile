FROM node:carbon-alpine

WORKDIR /var/www/metalarchives-api
COPY package*.json ./
RUN npm install -g pm2 
RUN npm install
COPY . .
CMD npm run catchDB & pm2-docker --format process.json
EXPOSE 3000
