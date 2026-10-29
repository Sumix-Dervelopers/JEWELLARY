# syntax=docker/dockerfile:1

# Production image for Coolify (or any Docker host). Builds the standalone server
# (`output: "standalone"` in next.config.ts) and runs it as a non-root user on port 3000.

ARG NODE_VERSION=24-alpine

# --- Dependencies -------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# --- Build --------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the bundle at build time, so they must be passed
# as build arguments (in Coolify, tick "Build Variable" on the environment variable).
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Git does not keep empty folders, so make sure /app/public exists for the runtime stage.
RUN mkdir -p public && npm run build

# --- Runtime ------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

# HOSTNAME "::" listens on IPv4 and IPv6. With 0.0.0.0, health checks that hit "localhost"
# (which Alpine can resolve to ::1) get "connection refused".
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=::

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

CMD ["node", "server.js"]
