FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV CI=true

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/package.json
COPY apps/client/package.json apps/client/package.json
RUN pnpm install --frozen-lockfile --filter @app/server...

COPY apps/server apps/server

WORKDIR /app/apps/server
RUN pnpm build
RUN pnpm prune --prod

FROM node:20-bookworm-slim
WORKDIR /app/apps/server

ENV NODE_ENV=production

COPY --from=build /app/apps/server/package.json ./package.json
COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/server/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/src/server.js"]
