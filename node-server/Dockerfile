FROM node:18-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY src /app/src
COPY jest.config.js /app

EXPOSE 8001

CMD [ "npm", "run", "prod" ]
