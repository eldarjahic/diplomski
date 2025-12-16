# Base image
FROM node:20 AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS builder
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
# Optional: run migrations before start
# CMD ["sh", "-c", "npm run migration:run && node dist/index.js"]
CMD ["node", "dist/index.js"]
