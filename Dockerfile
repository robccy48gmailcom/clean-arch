FROM node:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY bin ./bin
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY src/infrastructure/data-access/mysql/database.json ./src/infrastructure/data-access/mysql/database.json
COPY src/infrastructure/data-access/mysql/migrations ./src/infrastructure/data-access/mysql/migrations
EXPOSE 3000
CMD ["node", "bin/app"]