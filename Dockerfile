FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/

RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "server/index.js"]
