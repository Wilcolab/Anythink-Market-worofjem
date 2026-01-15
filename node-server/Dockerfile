FROM node:14

WORKDIR /app

COPY package*.json /app
RUN yarn install
EXPOSE 8001

CMD [ "yarn", "start" ]
