# --- Build stage ---
FROM docker.io/library/node:22-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# Public URL path the app is served under (must start and end with "/")
ARG BASE_PATH=/showcase/
RUN pnpm build --base=$BASE_PATH

# --- Runtime stage ---
FROM docker.io/library/nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Only the public media folders; storage/db is never shipped
COPY storage/proyectos /usr/share/nginx/html/storage/proyectos
COPY storage/eventos /usr/share/nginx/html/storage/eventos
COPY storage/patrocinadores /usr/share/nginx/html/storage/patrocinadores
EXPOSE 80
