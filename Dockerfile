# Next.js 12 site, built and served on Exos Bay One (see github.com/RascalTwo/homelab).
FROM node:22-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_VITALS=true
COPY package.json package-lock.json ./
# --ignore-scripts: sharp 0.29 has no prebuilt binary for modern Node; Next falls back
# to its built-in image optimizer, which is fine for this site.
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
# Lint is skipped: eslint-config-next 11 mis-flags src/pages/_document.js under Next 12.
RUN node_modules/.bin/next build --no-lint

FROM node:22-slim
WORKDIR /app
# The commit this image was built from, served at /api/version (set by the CI workflow).
ARG GIT_SHA=""
ENV GIT_SHA=$GIT_SHA \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_VITALS=true \
    VITALS_PATH=vitals/vitals.jsonl
COPY --from=build /app ./
# View counts and web-vitals logs land here; mount a volume over it.
RUN mkdir -p vitals
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
