# ===== BUILD =====
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@11
RUN npm ci
RUN npm install -g @angular/cli@22

ARG CONFIGURATION=production

COPY . .

RUN ng build --configuration=${CONFIGURATION}

# ===== RUN SSR =====
FROM node:24-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm install -g npm@11
RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "dist/aquarismo-app/server/server.mjs"]
