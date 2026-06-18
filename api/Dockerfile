FROM oven/bun:1-alpine
WORKDIR /app

# Manifesto da workspace + lock raiz (Bun workspaces usam lock único)
COPY package.json bun.lock ./
COPY api/package.json ./api/package.json
COPY mobile/package.json ./mobile/package.json

# Instala apenas deps da workspace api
RUN bun install --frozen-lockfile --filter api

WORKDIR /app/api
COPY api/src ./src
COPY api/migrations ./migrations
COPY api/migrate.ts ./

EXPOSE 3000
CMD ["bun", "src/index.ts"]
