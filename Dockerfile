# ===== BUILD =====
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@11
RUN npm ci
RUN npm install -g @angular/cli@22

ARG CONFIGURATION=production

COPY . .

# A pré-renderização busca cada artigo na blog-api. Com vários workers em paralelo as requisições
# estouram o rate limit do nginx da API (10 req/s por IP), recebem 503 e o artigo sai sem cabeçalho.
ENV NG_BUILD_MAX_WORKERS=1

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
