FROM node:latest
WORKDIR /app
COPY . .
RUN npm ci
RUN npm i sqlite3
RUN npm run seed
EXPOSE 3001
ENTRYPOINT [ "node", "./server/server.js"" ]