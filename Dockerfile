FROM node:21-alpine3.19

WORKDIR /app
COPY package.json ./

COPY ./src ./src
COPY ./public ./public

RUN npm install

EXPOSE 3000

CMD ["sh", "-c", "cd ./backend/src && node server.js && cd ../../ && npm start"]
