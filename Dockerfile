FROM node:carbon

WORKDIR /var/www/metalarchives-api
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run catchDB; npm start
EXPOSE 3000
