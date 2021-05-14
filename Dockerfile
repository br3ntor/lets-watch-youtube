# syntax=docker/dockerfile:1

FROM node:16-alpine
WORKDIR /app
COPY ["client/package.json", "client/package-lock.json*", "./"]
RUN npm install --production
COPY client/ .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY ["server/package.json", "server/package-lock.json*", "./"]
RUN npm install --production
COPY ./server .
COPY --from=0 /app/build build/
CMD [ "node", "server.js" ]