FROM node:8.2.1-alpine

RUN mkdir /app
WORKDIR /app

RUN npm install -g pm2

CMD ["pm2-docker", "start", "dist/app.js", "--instances", "1"]