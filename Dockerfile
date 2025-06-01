FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN chmod +x scripts/adjust-package.sh && ./scripts/adjust-package.sh

RUN npm ci
RUN npm run build:esbuild

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
