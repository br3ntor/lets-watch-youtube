# syntax=docker/dockerfile:1

FROM node:16-alpine
WORKDIR /app
COPY ["server/package.json", "server/package-lock.json*", "./"]
RUN npm install --production
COPY ./server .
# I need to make a multi stage build I think to first build my frontend
COPY ./client/build build/
CMD [ "node", "server.js" ]