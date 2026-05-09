FROM node:20-bookworm-slim AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/package.json
COPY apps/server/package.json apps/server/package.json
RUN pnpm install --frozen-lockfile --filter client...

COPY apps/client apps/client

WORKDIR /app/apps/client

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

# Runtime-образ: Nginx отдает статический фронтенд и проксирует /api в Fastify.
FROM nginx:1.27-alpine
COPY --from=build /app/apps/client/dist /usr/share/nginx/html
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
