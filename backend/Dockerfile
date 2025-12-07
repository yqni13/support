# Stage build (stag & prod)
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# compile typescript
RUN npm run build


# Stage development
FROM node:22 AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development

# PORT
EXPOSE 3000

CMD ["npx", "ts-node", "src/server.ts"]

# Stage staging
FROM node:22 AS staging

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# use build result
COPY --from=build /app/dist ./dist

ENV NODE_ENV=staging

EXPOSE 3000

CMD ["node", "dist/server.js"]


# Stage production
FROM node:22 AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]