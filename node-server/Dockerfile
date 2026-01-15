FROM node:18-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY src /app/src
COPY jest.config.js /app

EXPOSE 8001

CMD [ "npm", "run", "prod" ]
