# ===== BUILD =====
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npm install -g @angular/cli@20

COPY . .

RUN ng build --configuration=production

# ===== RUN SSR =====
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "dist/aquarismo-app/server/server.mjs"]
