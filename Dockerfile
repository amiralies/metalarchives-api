FROM node:carbon-alpine

WORKDIR /var/www/metalarchives-api
COPY package*.json ./
RUN npm install -g pm2 
RUN npm install
COPY . .
CMD ./start.sh
EXPOSE 3000
