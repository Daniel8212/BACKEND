FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY src ./src
RUN npm install --omit=dev
EXPOSE 4000
CMD ["node", "src/api/server.js"]